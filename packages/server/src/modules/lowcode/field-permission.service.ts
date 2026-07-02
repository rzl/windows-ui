import { db } from '../../db'
import { AppError } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import { tenantWhere, setTenantId } from '../../utils/tenant'

export interface FieldPermissionRule {
  id?: number
  model_code: string
  field_code: string
  readable?: number
  editable?: number
  hidden?: number
  role_ids?: number[]
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

export async function getFieldPermissionRules(req: AuthRequest, query: any = {}) {
  const { modelCode, fieldCode, page = 1, pageSize = 10 } = query
  const builder = db('lowcode_field_permission_rules')
    .where({ status: 1 })
    .where(tenantWhere(req))

  if (modelCode) builder.where('model_code', modelCode)
  if (fieldCode) builder.where('field_code', fieldCode)

  const total = await builder.clone().count({ count: '*' }).first()
  const list = await builder
    .orderBy('id', 'desc')
    .offset((Number(page) - 1) * Number(pageSize))
    .limit(Number(pageSize))

  return {
    list: list.map((item) => ({
      ...item,
      role_ids: parseJson<number[]>(item.role_ids)
    })),
    total: Number(total?.count || 0),
    page: Number(page),
    pageSize: Number(pageSize)
  }
}

export async function getFieldPermissionRuleById(req: AuthRequest, id: number) {
  const rule = await db('lowcode_field_permission_rules').where({ id }).where(tenantWhere(req)).first()
  if (!rule) throw new AppError('字段权限规则不存在', 404)
  return {
    ...rule,
    role_ids: parseJson<number[]>(rule.role_ids)
  }
}

export async function createFieldPermissionRule(req: AuthRequest, data: FieldPermissionRule) {
  const exists = await db('lowcode_field_permission_rules')
    .where({ model_code: data.model_code, field_code: data.field_code })
    .where(tenantWhere(req))
    .first()
  if (exists) throw new AppError('该模型字段已存在规则', 400)

  const [id] = await db('lowcode_field_permission_rules').insert(
    setTenantId(
      {
        model_code: data.model_code,
        field_code: data.field_code,
        readable: data.readable ?? 1,
        editable: data.editable ?? 1,
        hidden: data.hidden ?? 0,
        role_ids: JSON.stringify(data.role_ids || []),
        status: data.status ?? 1
      },
      req
    )
  )
  return getFieldPermissionRuleById(req, id)
}

export async function updateFieldPermissionRule(req: AuthRequest, id: number, data: FieldPermissionRule) {
  const rule = await db('lowcode_field_permission_rules').where({ id }).where(tenantWhere(req)).first()
  if (!rule) throw new AppError('字段权限规则不存在', 404)

  await db('lowcode_field_permission_rules')
    .where({ id })
    .where(tenantWhere(req))
    .update(
      setTenantId(
        {
          readable: data.readable ?? rule.readable,
          editable: data.editable ?? rule.editable,
          hidden: data.hidden ?? rule.hidden,
          role_ids: JSON.stringify(data.role_ids || []),
          status: data.status ?? rule.status,
          update_time: db.fn.now()
        },
        req
      )
    )
  return getFieldPermissionRuleById(req, id)
}

export async function deleteFieldPermissionRule(req: AuthRequest, id: number) {
  const rule = await db('lowcode_field_permission_rules').where({ id }).where(tenantWhere(req)).first()
  if (!rule) throw new AppError('字段权限规则不存在', 404)
  await db('lowcode_field_permission_rules')
    .where({ id })
    .where(tenantWhere(req))
    .update(setTenantId({ status: 0 }, req))
  return true
}

// 获取某角色对某模型的字段权限映射
export async function getFieldPermissionMap(req: AuthRequest, modelCode: string, roleId: number) {
  if (roleId === 1) {
    return {}
  }

  const rules = await db('lowcode_field_permission_rules')
    .where({ model_code: modelCode, status: 1 })
    .where(tenantWhere(req))
    .select('*')

  const result: Record<string, { readable: boolean; editable: boolean; hidden: boolean }> = {}
  for (const rule of rules) {
    const roleIds = parseJson<number[]>(rule.role_ids)
    // 若 role_ids 为空数组，则对所有角色生效；否则仅对指定角色生效
    if (roleIds.length && !roleIds.includes(roleId)) continue

    result[rule.field_code] = {
      readable: !!rule.readable,
      editable: !!rule.editable,
      hidden: !!rule.hidden
    }
  }
  return result
}

// 校验请求体中是否包含不可写字段
export async function assertFieldWritable(
  req: AuthRequest,
  modelCode: string,
  data: Record<string, any>,
  user: { id: number; roleId: number; isAdmin?: boolean }
) {
  if (user.isAdmin || user.roleId === 1) return

  const fieldMap = await getFieldPermissionMap(req, modelCode, user.roleId)
  const forbiddenFields = Object.entries(fieldMap)
    .filter(([_, perm]) => !perm.editable || perm.hidden)
    .map(([field]) => field)

  for (const key of Object.keys(data)) {
    if (forbiddenFields.includes(key)) {
      throw new AppError(`字段 ${key} 无写入权限`, 403)
    }
  }
}

// 对查询结果过滤隐藏字段
export async function filterHiddenFields(
  req: AuthRequest,
  modelCode: string,
  rows: any[],
  user: { id: number; roleId: number; isAdmin?: boolean }
) {
  if (user.isAdmin || user.roleId === 1 || !rows.length) return rows

  const fieldMap = await getFieldPermissionMap(req, modelCode, user.roleId)
  const hiddenFields = Object.entries(fieldMap)
    .filter(([_, perm]) => perm.hidden)
    .map(([field]) => field)

  if (!hiddenFields.length) return rows

  return rows.map((row) => {
    const copy = { ...row }
    for (const field of hiddenFields) {
      delete copy[field]
    }
    return copy
  })
}
