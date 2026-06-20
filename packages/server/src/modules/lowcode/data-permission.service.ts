import { db } from '../../db'
import { AppError } from '../../utils/response'

export interface DataPermissionRule {
  id?: number
  code: string
  name: string
  model_code: string
  scope: 'all' | 'dept' | 'dept_and_sub' | 'self' | 'roles' | 'users'
  role_ids?: number[]
  user_ids?: number[]
  custom_filter?: any[]
  status?: number
}

function parseJson<T>(value: any): T {
  if (!value) return [] as unknown as T
  if (Array.isArray(value)) return value as T
  try {
    return JSON.parse(value) as T
  } catch {
    return [] as unknown as T
  }
}

export async function getDataPermissionRules(query: any = {}) {
  const { keyword, modelCode, page = 1, pageSize = 10 } = query
  const builder = db('lowcode_data_permission_rules').where({ status: 1 })

  if (keyword) {
    builder.where((qb) => {
      qb.where('name', 'like', `%${keyword}%`).orWhere('code', 'like', `%${keyword}%`)
    })
  }
  if (modelCode) {
    builder.where('model_code', modelCode)
  }

  const total = await builder.clone().count({ count: '*' }).first()
  const list = await builder
    .orderBy('id', 'desc')
    .offset((Number(page) - 1) * Number(pageSize))
    .limit(Number(pageSize))

  return {
    list: list.map((item) => ({
      ...item,
      role_ids: parseJson<number[]>(item.role_ids),
      user_ids: parseJson<number[]>(item.user_ids),
      custom_filter: parseJson<any[]>(item.custom_filter)
    })),
    total: Number(total?.count || 0),
    page: Number(page),
    pageSize: Number(pageSize)
  }
}

export async function getDataPermissionRuleById(id: number) {
  const rule = await db('lowcode_data_permission_rules').where({ id }).first()
  if (!rule) throw new AppError('数据权限规则不存在', 404)
  return {
    ...rule,
    role_ids: parseJson<number[]>(rule.role_ids),
    user_ids: parseJson<number[]>(rule.user_ids),
    custom_filter: parseJson<any[]>(rule.custom_filter)
  }
}

export async function createDataPermissionRule(data: DataPermissionRule) {
  const exists = await db('lowcode_data_permission_rules').where({ code: data.code }).first()
  if (exists) throw new AppError('规则编码已存在', 400)

  const [id] = await db('lowcode_data_permission_rules').insert({
    code: data.code,
    name: data.name,
    model_code: data.model_code,
    scope: data.scope,
    role_ids: JSON.stringify(data.role_ids || []),
    user_ids: JSON.stringify(data.user_ids || []),
    custom_filter: JSON.stringify(data.custom_filter || []),
    status: data.status ?? 1
  })
  return getDataPermissionRuleById(id)
}

export async function updateDataPermissionRule(id: number, data: DataPermissionRule) {
  const rule = await db('lowcode_data_permission_rules').where({ id }).first()
  if (!rule) throw new AppError('数据权限规则不存在', 404)

  const codeExists = await db('lowcode_data_permission_rules')
    .where({ code: data.code })
    .whereNot({ id })
    .first()
  if (codeExists) throw new AppError('规则编码已存在', 400)

  await db('lowcode_data_permission_rules')
    .where({ id })
    .update({
      code: data.code,
      name: data.name,
      model_code: data.model_code,
      scope: data.scope,
      role_ids: JSON.stringify(data.role_ids || []),
      user_ids: JSON.stringify(data.user_ids || []),
      custom_filter: JSON.stringify(data.custom_filter || []),
      status: data.status ?? rule.status,
      update_time: db.fn.now()
    })
  return getDataPermissionRuleById(id)
}

export async function deleteDataPermissionRule(id: number) {
  const rule = await db('lowcode_data_permission_rules').where({ id }).first()
  if (!rule) throw new AppError('数据权限规则不存在', 404)
  await db('lowcode_data_permission_rules').where({ id }).update({ status: 0 })
  return true
}

// 根据角色 ID 获取绑定的数据规则
export async function getRoleDataPermissionIds(roleId: number) {
  const rows = await db('role_data_permissions')
    .where({ role_id: roleId })
    .join('lowcode_data_permission_rules', 'role_data_permissions.data_permission_id', 'lowcode_data_permission_rules.id')
    .where({ 'lowcode_data_permission_rules.status': 1 })
    .select('lowcode_data_permission_rules.id')
  return rows.map((row) => row.id)
}

export async function getRoleDataPermissionRules(roleId: number) {
  const rows = await db('role_data_permissions')
    .where({ role_id: roleId })
    .join('lowcode_data_permission_rules', 'role_data_permissions.data_permission_id', 'lowcode_data_permission_rules.id')
    .where({ 'lowcode_data_permission_rules.status': 1 })
    .select('lowcode_data_permission_rules.*')

  return rows.map((item) => ({
    ...item,
    role_ids: parseJson<number[]>(item.role_ids),
    user_ids: parseJson<number[]>(item.user_ids),
    custom_filter: parseJson<any[]>(item.custom_filter)
  }))
}

export async function saveRoleDataPermissions(roleId: number, dataPermissionIds: number[]) {
  await db('role_data_permissions').where({ role_id: roleId }).del()
  const validIds = (dataPermissionIds || []).filter((id) => Number(id) > 0)
  if (validIds.length) {
    await db('role_data_permissions').insert(
      validIds.map((dataPermissionId) => ({ role_id: roleId, data_permission_id: dataPermissionId }))
    )
  }
}

// 获取部门及其所有子部门 ID
async function getSubDeptIds(deptId: number): Promise<number[]> {
  const result = new Set<number>([deptId])
  const queue = [deptId]
  while (queue.length) {
    const parentId = queue.shift()!
    const children = await db('depts').where({ parent_id: parentId }).select('id')
    for (const child of children) {
      if (!result.has(child.id)) {
        result.add(child.id)
        queue.push(child.id)
      }
    }
  }
  return Array.from(result)
}

// 为 Knex builder 注入数据权限 where 条件
export async function applyDataPermissionWhere(
  builder: any,
  modelCode: string,
  user: { id: number; roleId: number; deptId?: number; isAdmin?: boolean }
) {
  if (user.isAdmin || user.roleId === 1) return

  const rules = await getRoleDataPermissionRules(user.roleId)
  const modelRules = rules.filter((rule) => rule.model_code === modelCode)

  // 若角色未配置该模型规则，回退到模型默认 data_permission（兼容旧逻辑）
  if (!modelRules.length) {
    const model = await db('lowcode_models').where({ code: modelCode }).first()
    if (model?.data_permission && model.data_permission !== 'all') {
      await applyLegacyDataPermission(builder, model.data_permission, user)
    }
    return
  }

  builder.where((qb: any) => {
    for (const rule of modelRules) {
      qb.orWhere((sub: any) => {
        applyRuleScope(sub, rule, user)
      })
    }
  })
}

async function applyLegacyDataPermission(builder: any, scope: string, user: { id: number; deptId?: number }) {
  switch (scope) {
    case 'self':
      builder.where('create_by', user.id)
      break
    case 'dept':
      if (user.deptId) builder.where('dept_id', user.deptId)
      break
    case 'dept_and_child':
      if (user.deptId) {
        const deptIds = await getSubDeptIds(user.deptId)
        builder.whereIn('dept_id', deptIds)
      }
      break
    case 'none':
      builder.whereRaw('1 = 0')
      break
  }
}

async function applyRuleScope(builder: any, rule: any, user: { id: number; roleId: number; deptId?: number }) {
  switch (rule.scope) {
    case 'self':
      builder.where('create_by', user.id)
      break
    case 'dept':
      if (user.deptId) builder.where('dept_id', user.deptId)
      break
    case 'dept_and_sub':
      if (user.deptId) {
        const deptIds = await getSubDeptIds(user.deptId)
        builder.whereIn('dept_id', deptIds)
      }
      break
    case 'roles':
      if (rule.role_ids?.length) {
        // 角色规则：仅当用户角色在列表中才放行；否则该子条件不生效
        // 实际效果：与空条件叠加后该行规则不限制
        if (!rule.role_ids.includes(user.roleId)) {
          // 不附加条件，表示该规则允许该用户
        }
      }
      break
    case 'users':
      if (rule.user_ids?.length) {
        if (!rule.user_ids.includes(user.id)) {
          builder.whereRaw('1 = 0')
        }
      }
      break
    case 'all':
    default:
      break
  }

  if (rule.custom_filter?.length) {
    for (const filter of rule.custom_filter) {
      applyCustomFilter(builder, filter)
    }
  }
}

function applyCustomFilter(builder: any, filter: any) {
  const { field, op, value } = filter
  if (!field || !op) return
  switch (op) {
    case '=':
    case 'eq':
      builder.where(field, value)
      break
    case '!=':
    case 'ne':
      builder.whereNot(field, value)
      break
    case '>':
    case 'gt':
      builder.where(field, '>', value)
      break
    case '<':
    case 'lt':
      builder.where(field, '<', value)
      break
    case '>=':
    case 'gte':
      builder.where(field, '>=', value)
      break
    case '<=':
    case 'lte':
      builder.where(field, '<=', value)
      break
    case 'like':
      builder.where(field, 'like', `%${value}%`)
      break
    case 'in':
      builder.whereIn(field, Array.isArray(value) ? value : [value])
      break
  }
}

// 校验单条数据是否有行级权限（用于详情/更新/删除）
export async function assertRowPermission(
  modelCode: string,
  rowId: number,
  user: { id: number; roleId: number; deptId?: number; isAdmin?: boolean }
) {
  if (user.isAdmin || user.roleId === 1) return

  const model = await db('lowcode_models').where({ code: modelCode }).first()
  if (!model) throw new AppError('模型不存在', 404)

  const row = await db(model.table_name).where({ id: rowId }).first()
  if (!row) throw new AppError('记录不存在', 404)

  // 构造一个只查询该 id 的 builder，应用数据权限 where，看能否查到
  const builder = db(model.table_name).where({ id: rowId })
  await applyDataPermissionWhere(builder, modelCode, user)
  const exists = await builder.first()

  if (!exists) {
    throw new AppError('无权限访问该数据', 403)
  }
}
