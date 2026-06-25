import { db } from '../../db'
import { AppError } from '../../utils/response'
import { applyDataPermissionWhere } from './data-permission.service'
import { getModelByCode } from './lowcode.service'

export async function getRelations(query: any = {}) {
  const builder = db('lowcode_model_relations').orderBy('id', 'desc')
  if (query.sourceModel) {
    builder.where('source_model', query.sourceModel)
  }
  if (query.targetModel) {
    builder.where('target_model', query.targetModel)
  }
  if (query.status !== undefined) {
    builder.where('status', query.status)
  }
  return builder
}

export async function getRelationById(id: number) {
  const relation = await db('lowcode_model_relations').where({ id }).first()
  if (!relation) throw new AppError('关联关系不存在', 404)
  return relation
}

export async function getRelationByCode(code: string) {
  return db('lowcode_model_relations').where({ code }).first()
}

export async function createRelation(data: any) {
  const code = safeCode(data.code)
  const exists = await db('lowcode_model_relations').where({ code }).first()
  if (exists) throw new AppError('关系编码已存在', 400)

  validateRelation(data)

  const [id] = await db('lowcode_model_relations').insert({
    code,
    name: data.name,
    source_model: data.sourceModel,
    target_model: data.targetModel,
    relation_type: data.relationType || 'belongsTo',
    source_field: data.sourceField,
    target_field: data.targetField || 'id',
    junction_table: data.junctionTable || null,
    status: data.status ?? 1
  })

  return getRelationById(id)
}

export async function updateRelation(id: number, data: any) {
  const relation = await getRelationById(id)
  validateRelation({ ...relation, ...data })

  await db('lowcode_model_relations').where({ id }).update({
    name: data.name ?? relation.name,
    source_model: data.sourceModel ?? relation.source_model,
    target_model: data.targetModel ?? relation.target_model,
    relation_type: data.relationType ?? relation.relation_type,
    source_field: data.sourceField ?? relation.source_field,
    target_field: data.targetField ?? relation.target_field,
    junction_table: data.junctionTable ?? relation.junction_table,
    status: data.status ?? relation.status,
    update_time: db.fn.now()
  })

  return getRelationById(id)
}

export async function deleteRelation(id: number) {
  const relation = await getRelationById(id)
  // 检查是否有字段引用该关系
  const used = await db('lowcode_fields').where({ ref_relation: relation.code }).first()
  if (used) throw new AppError('该关系已被字段引用，无法删除', 400)
  await db('lowcode_model_relations').where({ id }).del()
  return true
}

function validateRelation(data: any) {
  if (!data.sourceModel) throw new AppError('源模型不能为空', 400)
  if (!data.targetModel) throw new AppError('目标模型不能为空', 400)
  if (!data.sourceField) throw new AppError('源字段不能为空', 400)
  const validTypes = ['belongsTo', 'hasMany', 'manyToMany']
  if (!validTypes.includes(data.relationType || data.relation_type)) {
    throw new AppError('关系类型无效', 400)
  }
  if ((data.relationType || data.relation_type) === 'manyToMany' && !(data.junctionTable || data.junction_table)) {
    throw new AppError('多对多关系必须配置中间表', 400)
  }
}

function safeCode(code: string) {
  return String(code).replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

// ---------- 关联数据查询 ----------

/**
 * 解析 expand 参数并返回关联字段映射
 * expand 格式: fieldName1,fieldName2
 * 只有字段配置了 ref_relation 或 ref_model 的字段才会被展开
 */
export async function resolveExpands(modelCode: string, expand?: string) {
  if (!expand) return []
  const model = await getModelByCode(modelCode)
  const expandNames = String(expand)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const fields = model.fields.filter((f: any) => f.status === 1)
  const result: any[] = []

  for (const name of expandNames) {
    const field = fields.find((f: any) => f.field_name === name)
    if (!field) continue
    if (field.ref_relation) {
      const relation = await getRelationByCode(field.ref_relation)
      if (relation && relation.status === 1) {
        result.push({ field, relation })
      }
    } else if (field.type === 'ref' && field.ref_model && field.ref_display_field) {
      // 兼容旧版简易引用：构造一个虚拟的 belongsTo 关系
      result.push({
        field,
        relation: {
          code: `${modelCode}_${name}`,
          relation_type: 'belongsTo',
          source_model: modelCode,
          target_model: field.ref_model,
          source_field: name,
          target_field: 'id'
        }
      })
    }
  }

  return result
}

/**
 * 统一填充所有 expand 关联数据（belongsTo / hasMany / manyToMany）
 */
export async function fillAllExpands(rows: any[], expands: any[], user?: any) {
  if (!rows.length || !expands.length) return rows
  const currentUser = normalizeUser(user)

  for (const { field, relation } of expands) {
    const targetModel = await getModelByCode(relation.target_model)
    const sourceValues = [...new Set(rows.map((r) => r[relation.source_field]).filter((v) => v !== undefined && v !== null))]
    if (!sourceValues.length) continue

    let targetRows: any[] = []
    let isSingle = false

    if (relation.relation_type === 'belongsTo') {
      isSingle = true
      const builder = db(targetModel.table_name).whereIn(relation.target_field, sourceValues)
      await applyDataPermissionWhere(builder, relation.target_model, currentUser)
      targetRows = await builder
    } else if (relation.relation_type === 'hasMany') {
      const builder = db(targetModel.table_name).whereIn(relation.target_field, sourceValues)
      await applyDataPermissionWhere(builder, relation.target_model, currentUser)
      targetRows = await builder
    } else if (relation.relation_type === 'manyToMany') {
      const junctionRows = await db(relation.junction_table).whereIn(relation.source_field, sourceValues)
      const targetIds = junctionRows.map((r) => r[relation.target_field]).filter(Boolean)
      if (!targetIds.length) continue
      const builder = db(targetModel.table_name).whereIn('id', targetIds)
      await applyDataPermissionWhere(builder, relation.target_model, currentUser)
      targetRows = await builder
      for (const row of targetRows) {
        row.__junction = junctionRows.find((j) => j[relation.target_field] === row.id)
      }
    }

    if (isSingle) {
      const targetMap = new Map(targetRows.map((r) => [r[relation.target_field], r]))
      for (const row of rows) {
        row[field.field_name] = targetMap.get(row[relation.source_field]) || null
      }
    } else {
      const targetMap = new Map()
      for (const row of targetRows) {
        const key = relation.relation_type === 'manyToMany'
          ? row.__junction?.[relation.source_field]
          : row[relation.target_field]
        if (key === undefined) continue
        if (!targetMap.has(key)) targetMap.set(key, [])
        targetMap.get(key).push(row)
      }
      for (const row of rows) {
        row[field.field_name] = targetMap.get(row[relation.source_field]) || []
      }
    }
  }

  return rows
}

/**
 * 校验关联字段值是否存在于目标模型
 */
export async function assertRelationValuesValid(modelCode: string, data: any) {
  const model = await getModelByCode(modelCode)
  const fields = model.fields.filter((f: any) => f.status === 1)

  for (const field of fields) {
    const value = data[field.field_name]
    if (value === undefined || value === null || value === '') continue

    let targetModelCode: string | null = null
    let targetField = 'id'

    if (field.ref_relation) {
      const relation = await getRelationByCode(field.ref_relation)
      if (relation && relation.relation_type === 'belongsTo') {
        targetModelCode = relation.target_model
        targetField = relation.target_field
      }
    } else if (field.type === 'ref' && field.ref_model) {
      targetModelCode = field.ref_model
      targetField = 'id'
    }

    if (!targetModelCode) continue

    const targetModel = await getModelByCode(targetModelCode)
    const exists = await db(targetModel.table_name)
      .where({ [targetField]: value })
      .first()
    if (!exists) {
      throw new AppError(`${field.display_name || field.field_name} 关联的数据不存在`, 400)
    }
  }
}

/**
 * 获取关联字段的下拉选项数据
 */
export async function getRelationOptions(relationCode: string, query: any = {}) {
  const relation = await getRelationByCode(relationCode)
  if (!relation) throw new AppError('关联关系不存在', 404)
  if (relation.relation_type !== 'belongsTo') {
    throw new AppError('只有 belongsTo 关系支持下拉选项', 400)
  }

  const targetModel = await getModelByCode(relation.target_model)
  const builder = db(targetModel.table_name).select('*')

  // 关键词搜索：对所有字符串字段模糊匹配
  if (query.keyword) {
    const stringFields = targetModel.fields
      .filter((f: any) => ['string', 'text', 'textarea'].includes(f.type))
      .map((f: any) => f.field_name)
    if (stringFields.length) {
      builder.where((qb: any) => {
        stringFields.forEach((field: string, index: number) => {
          if (index === 0) qb.where(field, 'like', `%${query.keyword}%`)
          else qb.orWhere(field, 'like', `%${query.keyword}%`)
        })
      })
    }
  }

  // 固定筛选条件
  if (relation.ref_filter) {
    const filter = typeof relation.ref_filter === 'string'
      ? JSON.parse(relation.ref_filter)
      : relation.ref_filter
  }

  // 分页
  const page = Number(query.page) || 1
  const pageSize = Math.min(Number(query.pageSize) || 20, 100)
  const total = await builder.clone().count({ count: '*' }).first()
  const list = await builder.offset((page - 1) * pageSize).limit(pageSize)

  return {
    list,
    total: Number(total?.count || 0),
    page,
    pageSize
  }
}

function normalizeUser(user?: any) {
  if (!user) return { id: 0, roleId: 0 }
  return {
    id: user.id,
    roleId: user.roleId,
    deptId: user.deptId,
    isAdmin: user.roleId === 1 || user.permissions?.includes('*')
  }
}
