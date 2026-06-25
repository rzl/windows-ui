import { db } from '../../db'
import { AppError } from '../../utils/response'
import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'
import * as dashboardService from '../dashboard/dashboard.service'
import * as flowService from '../flow/flow.service'
import * as externalDatasourceService from '../external-datasource/external-datasource.service'
import * as auditService from '../audit/audit.service'
import { applyDataPermissionWhere, assertRowPermission as assertDataPermissionRow } from './data-permission.service'
import { assertFieldWritable, filterHiddenFields, getFieldPermissionMap } from './field-permission.service'
import * as pluginService from '../plugin/plugin.service'
import * as relationService from './relation.service'
import { rebuildTableWithoutColumns } from '../../utils/rebuildTable'

const RESERVED_FIELDS = ['id', 'create_time', 'update_time']

function safeTableName(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function safeFieldName(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

async function getPluginFieldMap(): Promise<Record<string, any>> {
  try {
    const plugins = await pluginService.getActivePlugins()
    const map: Record<string, any> = {}
    for (const plugin of plugins) {
      const contributions = typeof plugin.contributions === 'string'
        ? JSON.parse(plugin.contributions || '{}')
        : plugin.contributions || {}
      for (const ft of contributions.fieldTypes || []) {
        if (ft.type) map[ft.type] = ft
      }
    }
    return map
  } catch {
    return {}
  }
}

function buildColumn(table: any, columnName: string, dbType: string, length?: number) {
  switch (dbType) {
    case 'string':
      table.string(columnName, length || 255)
      break
    case 'text':
      table.text(columnName)
      break
    case 'integer':
      table.integer(columnName)
      break
    case 'tinyint':
    case 'boolean':
      table.tinyint(columnName)
      break
    case 'datetime':
      table.datetime(columnName)
      break
    case 'decimal':
      table.decimal(columnName, 18, 4)
      break
    case 'json':
      table.json(columnName)
      break
    default:
      table.string(columnName, 255)
  }
}

// ---------- 数据模型 ----------

export async function getModels(user?: any) {
  const isAdmin = user?.roleId === 1 || user?.permissions?.includes('*')
  const builder = db('lowcode_models').orderBy('id', 'desc')
  if (!isAdmin) {
    builder.whereNot('data_permission', 'none')
  }
  return builder
}

export async function getModelById(id: number) {
  const model = await db('lowcode_models').where({ id }).first()
  if (!model) throw new AppError('模型不存在', 404)
  let fields = await db('lowcode_fields')
    .where({ model_id: id })
    .orderBy('sort', 'asc')
  fields = await fillDictOptions(fields)
  const forms = await db('lowcode_forms').where({ model_id: id })
  const tables = await db('lowcode_tables').where({ model_id: id })
  return { ...model, fields, forms, tables }
}

export async function getModelByCode(code: string) {
  const model = await db('lowcode_models').where({ code }).first()
  if (!model) throw new AppError('模型不存在', 404)
  let fields = await db('lowcode_fields')
    .where({ model_id: model.id })
    .orderBy('sort', 'asc')
  fields = await fillDictOptions(fields)
  const forms = await db('lowcode_forms').where({ model_id: model.id })
  const tables = await db('lowcode_tables').where({ model_id: model.id })
  return { ...model, fields, forms, tables }
}

async function fillDictOptions(fields: any[]) {
  const dictCodes = fields
    .filter((f) => f.dict_code && ['select', 'radio'].includes(f.type))
    .map((f) => f.dict_code)

  if (!dictCodes.length) return fields

  const dicts = await db('dicts')
    .whereIn('code', [...new Set(dictCodes)])
    .where('status', 1)

  if (!dicts.length) return fields

  const dictIds = dicts.map((d) => d.id)
  const items = await db('dict_items')
    .whereIn('dict_id', dictIds)
    .where('status', 1)
    .orderBy('sort', 'asc')

  const dictMap = new Map()
  dicts.forEach((d) => {
    dictMap.set(d.code, items.filter((item) => item.dict_id === d.id).map((item) => ({
      label: item.label,
      value: item.value
    })))
  })

  return fields.map((f) => {
    const field = parseFieldJson({ ...f })
    if (field.dict_code && dictMap.has(field.dict_code)) {
      field.options = dictMap.get(field.dict_code)
    }
    return field
  })
}

function parseFieldJson(field: any) {
  if (field.ref_filter && typeof field.ref_filter === 'string') {
    try {
      field.ref_filter = JSON.parse(field.ref_filter)
    } catch {
      field.ref_filter = null
    }
  }
  if (field.options && typeof field.options === 'string') {
    try {
      field.options = JSON.parse(field.options)
    } catch {
      field.options = null
    }
  }
  return field
}

export async function createModel(data: any) {
  const code = safeFieldName(data.code)
  const tableName = data.tableName
    ? safeTableName(data.tableName)
    : `lc_${code}`

  const exists = await db('lowcode_models').where({ code }).orWhere({ table_name: tableName }).first()
  if (exists) throw new AppError('模型编码或表名已存在', 400)

  const [id] = await db('lowcode_models').insert({
    code,
    name: data.name,
    table_name: tableName,
    description: data.description,
    data_permission: data.dataPermission || 'all',
    status: data.status ?? 1,
    enable_audit: data.enableAudit ? 1 : 0
  })

  // 自动创建物理表（仅 id + 时间戳）
  await createPhysicalTable(tableName)

  return db('lowcode_models').where({ id }).first()
}

export async function updateModel(id: number, data: any) {
  const model = await db('lowcode_models').where({ id }).first()
  if (!model) throw new AppError('模型不存在', 404)

  await db('lowcode_models').where({ id }).update({
    name: data.name,
    description: data.description,
    data_permission: data.dataPermission || 'all',
    status: data.status,
    enable_audit: data.enableAudit ? 1 : 0,
    update_time: db.fn.now()
  })
  return db('lowcode_models').where({ id }).first()
}

export async function deleteModel(id: number) {
  const model = await db('lowcode_models').where({ id }).first()
  if (!model) throw new AppError('模型不存在', 404)

  // 删除物理表
  await db.schema.dropTableIfExists(model.table_name)

  // 元数据由外键级联删除
  await db('lowcode_models').where({ id }).del()
  return true
}

// ---------- 模型字段 ----------

export async function createField(data: any) {
  const model = await db('lowcode_models').where({ id: data.modelId }).first()
  if (!model) throw new AppError('模型不存在', 404)

  const fieldName = safeFieldName(data.fieldName)
  if (RESERVED_FIELDS.includes(fieldName)) {
    throw new AppError(`${fieldName} 为保留字段`, 400)
  }

  const exists = await db('lowcode_fields')
    .where({ model_id: data.modelId, field_name: fieldName })
    .first()
  if (exists) throw new AppError('字段已存在', 400)

  const [id] = await db('lowcode_fields').insert({
    model_id: data.modelId,
    field_name: fieldName,
    display_name: data.displayName,
    type: data.type || 'string',
    length: data.length ?? 255,
    required: data.required ? 1 : 0,
    default_value: data.defaultValue,
    default_value_type: data.defaultValueType || 'constant',
    default_value_expr: data.defaultValueExpr || null,
    options: data.options ? JSON.stringify(data.options) : null,
    validation_rule: data.validationRule || null,
    dict_code: data.dictCode || null,
    ref_model: data.refModel || null,
    ref_display_field: data.refDisplayField || null,
    ref_relation: data.refRelation || null,
    ref_filter: data.refFilter ? JSON.stringify(data.refFilter) : null,
    sort: data.sort ?? 0,
    status: data.status ?? 1
  })

  // 同步到物理表
  await addPhysicalColumn(model.table_name, fieldName, data)

  return db('lowcode_fields').where({ id }).first()
}

export async function updateField(id: number, data: any) {
  const field = await db('lowcode_fields').where({ id }).first()
  if (!field) throw new AppError('字段不存在', 404)

  const model = await db('lowcode_models').where({ id: field.model_id }).first()
  if (!model) throw new AppError('模型不存在', 404)

  await db('lowcode_fields').where({ id }).update({
    display_name: data.displayName,
    type: data.type,
    length: data.length,
    required: data.required ? 1 : 0,
    default_value: data.defaultValue,
    default_value_type: data.defaultValueType || 'constant',
    default_value_expr: data.defaultValueExpr || null,
    options: data.options ? JSON.stringify(data.options) : null,
    validation_rule: data.validationRule || null,
    dict_code: data.dictCode || null,
    ref_model: data.refModel || null,
    ref_display_field: data.refDisplayField || null,
    ref_relation: data.refRelation || null,
    ref_filter: data.refFilter ? JSON.stringify(data.refFilter) : null,
    sort: data.sort,
    status: data.status
  })

  // 同步物理表字段类型（SQLite 支持有限，先尝试 alter）
  await alterPhysicalColumn(model.table_name, field.field_name, data)

  return db('lowcode_fields').where({ id }).first()
}

export async function deleteField(id: number) {
  const field = await db('lowcode_fields').where({ id }).first()
  if (!field) throw new AppError('字段不存在', 404)

  const model = await db('lowcode_models').where({ id: field.model_id }).first()
  if (!model) throw new AppError('模型不存在', 404)

  await assertFieldNotReferencedByRelation(model.code, field.field_name)

  await db.transaction(async (trx) => {
    await trx('lowcode_fields').where({ id }).del()
    await rebuildTableWithoutColumns(model.table_name, [field.field_name])
  })

  return true
}

export async function batchDeleteFields(ids: number[]) {
  if (!ids?.length) throw new AppError('字段 ID 不能为空', 400)

  const fields = await db('lowcode_fields').whereIn('id', ids)
  if (!fields.length) throw new AppError('字段不存在', 404)

  const modelIds = [...new Set(fields.map((f) => f.model_id))]
  if (modelIds.length > 1) throw new AppError('批量删除的字段必须属于同一个模型', 400)

  const model = await db('lowcode_models').where({ id: modelIds[0] }).first()
  if (!model) throw new AppError('模型不存在', 404)

  for (const field of fields) {
    await assertFieldNotReferencedByRelation(model.code, field.field_name)
  }

  const columnsToRemove = fields.map((f) => f.field_name)

  await db.transaction(async (trx) => {
    await trx('lowcode_fields').whereIn('id', ids).del()
    await rebuildTableWithoutColumns(model.table_name, columnsToRemove)
  })

  return true
}

async function assertFieldNotReferencedByRelation(modelCode: string, fieldName: string) {
  const relation = await db('lowcode_model_relations')
    .where((builder) => {
      builder.where('source_model', modelCode).andWhere('source_field', fieldName)
    })
    .orWhere((builder) => {
      builder.where('target_model', modelCode).andWhere('target_field', fieldName)
    })
    .first()

  if (relation) {
    throw new AppError(
      `字段 "${fieldName}" 已被关联关系 "${relation.name || relation.code}" 引用，请先解除关系后再删除`,
      400
    )
  }
}

// ---------- 表单/列表配置 ----------

async function getFormConfig(modelId: number) {
  const form = await db('lowcode_forms').where({ model_id: modelId }).first()
  if (!form || !form.config) return null
  try {
    return typeof form.config === 'string' ? JSON.parse(form.config) : form.config
  } catch {
    return null
  }
}

async function getTableConfig(modelId: number) {
  const table = await db('lowcode_tables').where({ model_id: modelId }).first()
  if (!table || !table.config) return null
  try {
    return typeof table.config === 'string' ? JSON.parse(table.config) : table.config
  } catch {
    return null
  }
}

async function checkButtonPermission(modelCode: string, action: string, actionType: 'toolbar' | 'rowAction', user?: any) {
  if (!user) return
  const isAdmin = user?.roleId === 1 || user?.permissions?.includes('*')
  if (isAdmin) return

  const model = await getModelByCode(modelCode)
  const tableConfig = await getTableConfig(model.id)
  if (!tableConfig) return

  const key = actionType === 'toolbar' ? 'toolbarPermissions' : 'rowActionPermissions'
  const permission = tableConfig[key]?.[action]
  if (!permission) return

  if (!user.permissions?.includes(permission)) {
    throw new AppError('无权执行该操作', 403)
  }
}

export async function saveForm(data: any) {
  const model = await db('lowcode_models').where({ id: data.modelId }).first()
  if (!model) throw new AppError('模型不存在', 404)

  const exists = await db('lowcode_forms').where({ model_id: data.modelId }).first()
  if (exists) {
    await db('lowcode_forms').where({ id: exists.id }).update({
      name: data.name,
      config: JSON.stringify(data.config),
      status: data.status ?? 1
    })
    return db('lowcode_forms').where({ id: exists.id }).first()
  }

  const [id] = await db('lowcode_forms').insert({
    model_id: data.modelId,
    name: data.name,
    config: JSON.stringify(data.config),
    status: data.status ?? 1
  })
  return db('lowcode_forms').where({ id }).first()
}

export async function saveTable(data: any) {
  const model = await db('lowcode_models').where({ id: data.modelId }).first()
  if (!model) throw new AppError('模型不存在', 404)

  const exists = await db('lowcode_tables').where({ model_id: data.modelId }).first()
  if (exists) {
    await db('lowcode_tables').where({ id: exists.id }).update({
      name: data.name,
      config: JSON.stringify(data.config),
      status: data.status ?? 1
    })
    return db('lowcode_tables').where({ id: exists.id }).first()
  }

  const [id] = await db('lowcode_tables').insert({
    model_id: data.modelId,
    name: data.name,
    config: JSON.stringify(data.config),
    status: data.status ?? 1
  })
  return db('lowcode_tables').where({ id }).first()
}

// ---------- 动态表操作 ----------

async function createPhysicalTable(tableName: string) {
  const exists = await db.schema.hasTable(tableName)
  if (exists) return

  await db.schema.createTable(tableName, (table) => {
    table.increments('id').primary()
    table.integer('create_by').unsigned().nullable()
    table.integer('update_by').unsigned().nullable()
    table.integer('dept_id').unsigned().nullable()
    table.timestamp('create_time').defaultTo(db.fn.now())
    table.timestamp('update_time').defaultTo(db.fn.now())
  })
}

async function addPhysicalColumn(tableName: string, columnName: string, fieldData: any) {
  const exists = await db.schema.hasColumn(tableName, columnName)
  if (exists) return

  const pluginDbType = await pluginService.getFieldDbType(fieldData.type)

  await db.schema.table(tableName, (table) => {
    if (pluginDbType) {
      buildColumn(table, columnName, pluginDbType, fieldData.length)
      return
    }

    switch (fieldData.type) {
      case 'string':
      case 'select':
      case 'radio':
      case 'date':
        table.string(columnName, fieldData.length || 255)
        break
      case 'text':
      case 'textarea':
        table.text(columnName)
        break
      case 'number':
      case 'integer':
        table.integer(columnName)
        break
      case 'boolean':
      case 'switch':
        table.tinyint(columnName)
        break
      case 'datetime':
        table.datetime(columnName)
        break
      case 'ref':
      case 'upload':
      case 'cascader':
        table.integer(columnName)
        break
      case 'rich-text':
        table.text(columnName)
        break
      default:
        table.string(columnName, 255)
    }
  })
}

async function alterPhysicalColumn(tableName: string, columnName: string, fieldData: any) {
  // SQLite 对 alter column 支持有限，这里仅做占位
  // 生产环境建议根据数据库类型做迁移
  return true
}

// ---------- 权限 ----------

export async function getModelPermission(modelCode: string, user?: any) {
  const model = await getModelByCode(modelCode)
  const permission = model.data_permission || 'all'
  const currentUser = normalizeUser(user)

  // 管理员拥有全部权限
  if (currentUser.isAdmin) {
    return {
      dataScope: 'all',
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canExport: true,
      canImport: true,
      canDesign: true,
      fieldPermissions: {}
    }
  }

  // 根据数据权限范围决定操作权限
  if (permission === 'none') {
    return {
      dataScope: 'none',
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canExport: false,
      canImport: false,
      canDesign: false,
      fieldPermissions: await getFieldPermissionMap(modelCode, currentUser.roleId)
    }
  }

  return {
    dataScope: permission,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canImport: true,
    canDesign: false,
    fieldPermissions: await getFieldPermissionMap(modelCode, currentUser.roleId)
  }
}

// ---------- 动态 CRUD ----------

export async function dynamicList(modelCode: string, query: any, user?: any) {
  const model = await getModelByCode(modelCode)
  const { keyword, filters, page = 1, pageSize = 10, sortBy, sortOrder, expand } = query

  const fields = model.fields.filter((f: any) => f.status === 1)
  const fieldNames = fields.map((f: any) => f.field_name)
  const refFields = fields.filter((f: any) => f.type === 'ref' && f.ref_model && f.ref_display_field)
  const expands = await relationService.resolveExpands(modelCode, expand)
  const expandRelSet = new Set(expands.map((e) => e.field.field_name))

  // 构建主查询，包含旧版 ref 关联字段显示值
  const displayRefFields = refFields.filter((f: any) => !expandRelSet.has(f.field_name))
  const selectColumns = [`${model.table_name}.*`, ...displayRefFields.map((f: any) => `ref_${f.field_name}.${f.ref_display_field} as ${f.field_name}_display`)]
  const builder = db(model.table_name).select(selectColumns)

  for (const field of displayRefFields) {
    const refModel = await getModelByCode(field.ref_model)
    builder.leftJoin(
      `${refModel.table_name} as ref_${field.field_name}`,
      `${model.table_name}.${field.field_name}`,
      `ref_${field.field_name}.id`
    )
  }

  // 数据权限过滤
  const currentUser = normalizeUser(user)
  await applyDataPermissionWhere(builder, modelCode, currentUser)

  // 关键词模糊搜索
  if (keyword && fields.length) {
    const searchFields = fields
      .filter((f: any) => ['string', 'text', 'textarea'].includes(f.type) || (f.type === 'ref' && f.ref_display_field))
      .map((f: any) => f.type === 'ref' ? `ref_${f.field_name}.${f.ref_display_field}` : `${model.table_name}.${f.field_name}`)

    if (searchFields.length) {
      builder.where((qb) => {
        searchFields.forEach((field: string, index: number) => {
          if (index === 0) {
            qb.where(field, 'like', `%${keyword}%`)
          } else {
            qb.orWhere(field, 'like', `%${keyword}%`)
          }
        })
      })
    }
  }

  // 高级查询条件
  let filterList: any[] = []
  if (filters) {
    try {
      filterList = JSON.parse(filters)
      if (!Array.isArray(filterList)) filterList = []
    } catch {
      filterList = []
    }
  }

  filterList.forEach((condition: any) => {
    const { field, operator, value } = condition
    if (value === undefined || value === '' || value === null || !field) return

    const resolveField = (f: string) => {
      const refField = refFields.find((rf: any) => rf.field_name === f)
      if (refField) return `ref_${f}.${refField.ref_display_field}`
      return `${model.table_name}.${f}`
    }

    switch (operator) {
      case 'eq':
        builder.where(resolveField(field), value)
        break
      case 'ne':
        builder.whereNot(resolveField(field), value)
        break
      case 'like':
        builder.where(resolveField(field), 'like', `%${value}%`)
        break
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          builder.whereBetween(resolveField(field), [value[0], value[1]])
        }
        break
      case 'gt':
        builder.where(resolveField(field), '>', value)
        break
      case 'lt':
        builder.where(resolveField(field), '<', value)
        break
      case 'gte':
        builder.where(resolveField(field), '>=', value)
        break
      case 'lte':
        builder.where(resolveField(field), '<=', value)
        break
      default:
        builder.where(resolveField(field), value)
    }
  })

  const total = await builder.clone().count({ count: '*' }).first()

  // 排序
  if (sortBy && fieldNames.includes(sortBy)) {
    const order = sortOrder === 'ascending' ? 'asc' : 'desc'
    const sortField = refFields.find((f: any) => f.field_name === sortBy)
      ? `${sortBy}_display`
      : `${model.table_name}.${sortBy}`
    builder.orderBy(sortField, order)
  } else {
    builder.orderBy(`${model.table_name}.id`, 'desc')
  }

  let list = await builder
    .offset((Number(page) - 1) * Number(pageSize))
    .limit(Number(pageSize))

  // 填充 expand 关联数据
  list = await relationService.fillAllExpands(list, expands, currentUser)

  // 附加流程状态
  const flowDef = await flowService.getFlowDefinitionByModelCode(modelCode)
  if (flowDef && list.length) {
    const businessKeys = list.map((r: any) => r.id)
    const instances = await db('flow_instances')
      .where({ flow_code: flowDef.code })
      .whereIn('business_key', businessKeys)
    const instanceIds = instances.map((i) => i.id)
    const tasks = instanceIds.length
      ? await db('flow_tasks').whereIn('instance_id', instanceIds).where('status', 'pending')
      : []
    const instanceMap = new Map(instances.map((i) => [i.business_key, i]))
    const taskMap = new Map(tasks.map((t) => [t.instance_id, t]))
    for (const row of list) {
      const instance = instanceMap.get(row.id)
      if (instance) {
        const task = taskMap.get(instance.id)
        row.__flow_status = instance.status
        row.__flow_task_id = task?.id || null
      }
    }
  }

  const filteredList = await filterHiddenFields(modelCode, list, currentUser)

  return {
    list: filteredList,
    total: Number(total?.count || 0),
    page: Number(page),
    pageSize: Number(pageSize)
  }
}

export async function dynamicDetail(modelCode: string, id: number, user?: any, query: any = {}) {
  const model = await getModelByCode(modelCode)
  const row = await db(model.table_name).where({ id }).first()
  if (!row) throw new AppError('记录不存在', 404)
  const currentUser = normalizeUser(user)
  await assertDataPermissionRow(modelCode, id, currentUser)

  // 填充 expand 关联数据
  const expands = await relationService.resolveExpands(modelCode, query.expand)
  const [filledRow] = await relationService.fillAllExpands([row], expands, currentUser)

  return filterHiddenFields(modelCode, [filledRow], currentUser).then((rows) => rows[0])
}

function computeDefaultValue(field: any, data: any, user?: any) {
  const type = field.default_value_type
  const expr = field.default_value_expr
  if (!type || type === 'constant') return expr
  if (type === 'currentUser') return user?.id ?? null
  if (type === 'currentDept') return user?.deptId ?? null
  if (type === 'currentTime') {
    const now = new Date()
    if (field.type === 'date') return now.toISOString().slice(0, 10)
    if (field.type === 'datetime') return now.toISOString().slice(0, 19).replace('T', ' ')
    return now.toISOString()
  }
  if (type === 'field') return expr ? data[expr] : undefined
  if (type === 'expr') {
    try {
      const fn = new Function('ctx', `with(ctx) { return (${expr}) }`)
      return fn({ ...data, user, now: new Date() })
    } catch (error) {
      console.error(`默认值表达式执行失败: ${expr}`, error)
      return undefined
    }
  }
  return undefined
}

export async function dynamicCreate(modelCode: string, data: any, user?: any, req?: any) {
  await checkButtonPermission(modelCode, 'create', 'toolbar', user)
  const model = await getModelByCode(modelCode)

  // 读取表单配置中的编码规则，为空字段自动生成编码
  const formConfig = await getFormConfig(model.id)
  if (formConfig?.fields) {
    for (const field of formConfig.fields) {
      if (!field.codingRule) continue
      if (data[field.field] !== undefined && data[field.field] !== '' && data[field.field] !== null) continue
      data[field.field] = await generateCode(field.codingRule)
    }
  }

  // 为空字段填充默认值
  for (const field of model.fields) {
    if (!field.default_value_type) continue
    if (data[field.field_name] !== undefined && data[field.field_name] !== '' && data[field.field_name] !== null) continue
    const value = computeDefaultValue(field, data, user)
    if (value !== undefined) {
      data[field.field_name] = value
    }
  }

  const currentUser = normalizeUser(user)
  await validateDynamicData(model.fields, data)
  await assertFieldWritable(modelCode, data, currentUser)
  const pluginFieldMap = await getPluginFieldMap()
  const cleanData = await sanitizeData(model.fields, data, pluginFieldMap)
  await relationService.assertRelationValuesValid(modelCode, cleanData)
  if (user) {
    cleanData.create_by = user.id
    cleanData.update_by = user.id
    cleanData.dept_id = user.deptId || null
  }
  const [id] = await db(model.table_name).insert(cleanData)

  // 记录审计日志
  const createdRow = await db(model.table_name).where({ id }).first()
  await auditService.logAudit({
    modelCode,
    recordId: id,
    action: 'create',
    after: createdRow,
    user,
    req
  })

  // 如果模型绑定了启用状态的流程，自动启动流程实例
  try {
    const flowDef = await flowService.getFlowDefinitionByModelCode(modelCode)
    if (flowDef) {
      await flowService.startFlowInstance(flowDef.code, id, cleanData, user)
    }
  } catch (error) {
    console.error('启动流程失败', error)
  }

  return db(model.table_name).where({ id }).first()
}

export async function dynamicUpdate(modelCode: string, id: number, data: any, user?: any, req?: any) {
  await checkButtonPermission(modelCode, 'edit', 'rowAction', user)
  const model = await getModelByCode(modelCode)
  const currentUser = normalizeUser(user)
  await assertDataPermissionRow(modelCode, id, currentUser)
  const beforeRow = await db(model.table_name).where({ id }).first()
  await validateDynamicData(model.fields, data)
  await assertFieldWritable(modelCode, data, currentUser)
  const pluginFieldMap = await getPluginFieldMap()
  const cleanData = await sanitizeData(model.fields, data, pluginFieldMap)
  await relationService.assertRelationValuesValid(modelCode, cleanData)
  cleanData.update_time = db.fn.now()
  if (user) {
    cleanData.update_by = user.id
  }
  await db(model.table_name).where({ id }).update(cleanData)
  const afterRow = await db(model.table_name).where({ id }).first()

  await auditService.logAudit({
    modelCode,
    recordId: id,
    action: 'update',
    before: beforeRow,
    after: afterRow,
    user,
    req
  })

  return afterRow
}

export async function dynamicDelete(modelCode: string, id: number, user?: any, req?: any) {
  await checkButtonPermission(modelCode, 'delete', 'rowAction', user)
  const model = await getModelByCode(modelCode)
  const currentUser = normalizeUser(user)
  await assertDataPermissionRow(modelCode, id, currentUser)
  const beforeRow = await db(model.table_name).where({ id }).first()
  await db(model.table_name).where({ id }).del()

  if (beforeRow) {
    await auditService.logAudit({
      modelCode,
      recordId: id,
      action: 'delete',
      before: beforeRow,
      user,
      req
    })
  }

  return true
}

export async function dynamicBatchDelete(modelCode: string, ids: (string | number)[], user?: any, req?: any) {
  await checkButtonPermission(modelCode, 'batchDelete', 'toolbar', user)
  const model = await getModelByCode(modelCode)
  if (!ids || !ids.length) throw new AppError('未选择记录', 400)
  const currentUser = normalizeUser(user)
  for (const id of ids) {
    await assertDataPermissionRow(modelCode, Number(id), currentUser)
  }
  const rows = await db(model.table_name).whereIn('id', ids)
  await db(model.table_name).whereIn('id', ids).del()

  for (const row of rows) {
    await auditService.logAudit({
      modelCode,
      recordId: row.id,
      action: 'delete',
      before: row,
      user,
      req
    })
  }

  return true
}

export async function dynamicImport(modelCode: string, rows: any[], user?: any, req?: any) {
  await checkButtonPermission(modelCode, 'import', 'toolbar', user)
  const model = await getModelByCode(modelCode)
  const currentUser = normalizeUser(user)
  if (!rows || !rows.length) throw new AppError('导入数据不能为空', 400)
  for (const row of rows) {
    await assertFieldWritable(modelCode, row, currentUser)
  }
  const pluginFieldMap = await getPluginFieldMap()
  const cleanRows = await Promise.all(rows.map((row) => sanitizeData(model.fields, row, pluginFieldMap)))
  const insertedIds = await db(model.table_name).insert(cleanRows)

  for (let i = 0; i < cleanRows.length; i++) {
    const recordId = insertedIds[i]
    if (!recordId) continue
    const afterRow = await db(model.table_name).where({ id: recordId }).first()
    await auditService.logAudit({
      modelCode,
      recordId,
      action: 'create',
      after: afterRow,
      user,
      req
    })
  }

  return { count: cleanRows.length }
}

export async function exportDynamicExcel(modelCode: string, options: { ids?: (string | number)[]; columns?: any[] }, user?: any) {
  await checkButtonPermission(modelCode, 'export', 'toolbar', user)
  const model = await getModelByCode(modelCode)
  const fields = model.fields.filter((f: any) => f.status === 1)

  // 如果没有指定列，使用全部字段
  let exportColumns: any[] = options.columns || fields.map((f: any) => ({
    field: f.field_name,
    label: f.display_name || f.field_name,
    type: f.type,
    format: '',
    dictCode: f.dict_code,
    refModel: f.ref_model,
    refDisplayField: f.ref_display_field
  }))

  // 过滤无效列
  const fieldMap = new Map(fields.map((f: any) => [f.field_name, f]))
  exportColumns = exportColumns.filter((col: any) => fieldMap.has(col.field))

  // 查询数据
  let list: any[]
  const currentUser = normalizeUser(user)
  if (options.ids && options.ids.length) {
    for (const id of options.ids) {
      await assertDataPermissionRow(modelCode, Number(id), currentUser)
    }
    list = await db(model.table_name).whereIn('id', options.ids)
    list = await filterHiddenFields(modelCode, list, currentUser)
  } else {
    const result = await dynamicList(modelCode, { page: 1, pageSize: 10000 }, user)
    list = result.list
  }

  // 预加载字典数据
  const typedFieldMap = fieldMap as Map<string, any>
  const dictCodes = new Set<string>()
  for (const col of exportColumns) {
    const field = typedFieldMap.get(col.field)
    if (field?.dict_code) dictCodes.add(field.dict_code)
  }
  const dictData = await loadDictMap([...dictCodes])

  // 构建表头和行
  const headers = exportColumns.map((col: any) => col.label)
  const rows = list.map((row: any) => exportColumns.map((col: any) => formatExportValue(row, col, typedFieldMap, dictData)))

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, model.name || '数据')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

async function loadDictMap(dictCodes: string[]): Promise<Map<string, Map<string, string>>> {
  const result = new Map<string, Map<string, string>>()
  if (!dictCodes.length) return result

  const dicts = await db('dicts').whereIn('code', dictCodes).where('status', 1)
  if (!dicts.length) return result

  const dictIds = dicts.map((d) => d.id)
  const items = await db('dict_items')
    .whereIn('dict_id', dictIds)
    .where('status', 1)
    .orderBy('sort', 'asc')

  for (const dict of dicts) {
    const map = new Map<string, string>()
    for (const item of items.filter((i) => i.dict_id === dict.id)) {
      map.set(String(item.value), item.label)
    }
    result.set(dict.code, map)
  }
  return result
}

function formatExportValue(row: any, col: any, fieldMap: Map<string, any>, dictData: Map<string, any>) {
  const value = row[col.field]
  if (value === undefined || value === null) return ''

  const field = fieldMap.get(col.field)

  // 关联字段显示值
  if (col.type === 'ref' || col.refModel || field?.type === 'ref') {
    return row[`${col.field}_display`] ?? value
  }

  // 字典转换
  if (field?.dict_code) {
    const dict = dictData.get(field.dict_code)
    if (dict) {
      return dict.get(String(value)) ?? value
    }
    return value
  }

  // 布尔转换
  if (field?.type === 'boolean' || field?.type === 'switch' || col.format === 'boolean') {
    return value === 1 || value === true || value === '1' ? '是' : '否'
  }

  // 格式化
  switch (col.format) {
    case 'date':
      return String(value).slice(0, 10)
    case 'datetime':
      return String(value).replace('T', ' ').slice(0, 19)
    case 'money':
      return Number(value).toFixed(2)
    case 'percent':
      return (Number(value) * 100).toFixed(2) + '%'
    default:
      return value
  }
}

export async function importDynamicExcel(modelCode: string, buffer: Buffer, user?: any) {
  const model = await getModelByCode(modelCode)
  const fields = model.fields.filter((f: any) => f.status === 1)
  const fieldMap = new Map<string, any>(fields.map((f: any) => [f.display_name || f.field_name, f]))

  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

  if (json.length < 2) throw new AppError('Excel 文件为空或格式错误', 400)

  const headers = json[0].map((h: any) => String(h).trim())
  const dataRows = json.slice(1)

  const successes: any[] = []
  const failures: { row: number; reason: string }[] = []

  for (let i = 0; i < dataRows.length; i++) {
    const rowValues = dataRows[i]
    if (rowValues.every((v: any) => v === undefined || v === '' || v === null)) continue

    const row: any = {}
    headers.forEach((header: string, index: number) => {
      const field = fieldMap.get(header)
      if (!field) return
      row[field.field_name] = rowValues[index]
    })

    try {
      const created = await dynamicCreate(modelCode, row, user)
      successes.push(created)
    } catch (error: any) {
      failures.push({ row: i + 2, reason: error.message || '创建失败' })
    }
  }

  return {
    total: dataRows.length,
    success: successes.length,
    failure: failures.length,
    failures
  }
}

export async function getImportTemplate(modelCode: string) {
  const model = await getModelByCode(modelCode)
  const fields = model.fields
    .filter((f: any) => f.status === 1 && !['id', 'create_time', 'update_time'].includes(f.field_name))

  const headers = fields.map((f: any) => f.display_name || f.field_name)
  const example = fields.map((f: any) => {
    switch (f.type) {
      case 'number': return 0
      case 'boolean': return '是'
      case 'date': return '2024-01-01'
      case 'datetime': return '2024-01-01 12:00:00'
      case 'select': return '选项1'
      default: return '示例'
    }
  })

  const worksheet = XLSX.utils.aoa_to_sheet([headers, example])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '导入模板')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

async function validateDynamicData(fields: any[], data: any) {
  const ruleFields = fields.filter((f: any) => f.validation_rule && data[f.field_name] !== undefined && data[f.field_name] !== '' && data[f.field_name] !== null)
  if (!ruleFields.length) return

  const items = ruleFields.map((f: any) => ({
    code: f.validation_rule,
    value: String(data[f.field_name])
  }))

  const results = await validateBatch(items)
  const errors = results.filter((r) => !r.valid)
  if (errors.length) {
    throw new AppError(errors.map((e) => e.message).join('；'), 400)
  }
}

async function sanitizeData(fields: any[], data: any, pluginFieldMap?: Record<string, any>) {
  const result: any = {}
  const fieldMap = new Map(fields.map((f) => [f.field_name, f]))
  const pluginMap = pluginFieldMap || await getPluginFieldMap()

  Object.entries(data).forEach(([key, value]) => {
    if (RESERVED_FIELDS.includes(key)) return
    const field = fieldMap.get(key)
    if (!field) return

    const pluginMeta = pluginMap[field.type]

    // 插件字段类型按 dbType 转换
    if (pluginMeta?.dbType) {
      const dbType = pluginMeta.dbType
      if (dbType === 'integer' || dbType === 'tinyint') {
        result[key] = value === '' || value === undefined || value === null ? null : Number(value)
      } else if (dbType === 'boolean') {
        result[key] = parseBooleanValue(value) ? 1 : 0
      } else if (dbType === 'datetime') {
        result[key] = value === '' || value === undefined || value === null ? null : String(value).replace('T', ' ').slice(0, 19)
      } else if (dbType === 'date') {
        result[key] = value === '' || value === undefined || value === null ? null : String(value).slice(0, 10)
      } else {
        result[key] = value === '' ? null : value
      }
      return
    }

    // 内置类型转换
    if (field.type === 'number' || field.type === 'integer') {
      result[key] = value === '' || value === undefined || value === null ? null : Number(value)
    } else if (field.type === 'boolean' || field.type === 'switch') {
      result[key] = parseBooleanValue(value) ? 1 : 0
    } else if (field.type === 'date') {
      result[key] = value === '' || value === undefined || value === null ? null : String(value).slice(0, 10)
    } else if (field.type === 'datetime') {
      result[key] = value === '' || value === undefined || value === null ? null : String(value).replace('T', ' ').slice(0, 19)
    } else {
      result[key] = value === '' ? null : value
    }
  })

  return result
}

function parseBooleanValue(value: any): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    return v === '1' || v === '是' || v === 'yes' || v === 'true' || v === 'y'
  }
  return false
}

// ---------- 编码规则 ----------

export async function getCodingRules() {
  return db('lowcode_coding_rules').orderBy('id', 'desc')
}

export async function createCodingRule(data: any) {
  const [id] = await db('lowcode_coding_rules').insert({
    code: data.code,
    name: data.name,
    prefix: data.prefix,
    date_format: data.dateFormat,
    seq_length: data.seqLength ?? 4,
    current_seq: 0,
    status: data.status ?? 1
  })
  return db('lowcode_coding_rules').where({ id }).first()
}

export async function updateCodingRule(id: number, data: any) {
  await db('lowcode_coding_rules').where({ id }).update({
    name: data.name,
    prefix: data.prefix,
    date_format: data.dateFormat,
    seq_length: data.seqLength,
    status: data.status
  })
  return db('lowcode_coding_rules').where({ id }).first()
}

export async function deleteCodingRule(id: number) {
  await db('lowcode_coding_rules').where({ id }).del()
  return true
}

export async function generateCode(ruleCode: string) {
  const rule = await db('lowcode_coding_rules').where({ code: ruleCode }).first()
  if (!rule) throw new AppError('编码规则不存在', 404)

  const nextSeq = rule.current_seq + 1
  await db('lowcode_coding_rules').where({ id: rule.id }).update({ current_seq: nextSeq })

  const dateStr = formatDate(new Date(), rule.date_format)
  const seqStr = String(nextSeq).padStart(rule.seq_length, '0')
  return `${rule.prefix || ''}${dateStr}${seqStr}`
}

export async function executeFieldOptions(config: any, ctx: any = {}) {
  const { type } = config

  if (type === 'dict') {
    if (!config.dictCode) throw new AppError('字典编码不能为空', 400)
    const dict = await db('dicts').where({ code: config.dictCode, status: 1 }).first()
    if (!dict) throw new AppError('字典不存在', 404)
    const items = await db('dict_items')
      .where({ dict_id: dict.id, status: 1 })
      .orderBy('sort', 'asc')
    return items.map((item) => ({ label: item.label, value: item.value }))
  }

  if (type === 'external') {
    if (!config.externalDataSourceId) throw new AppError('外部数据源不能为空', 400)
    const rows = await externalDatasourceService.executeExternalDataSource(Number(config.externalDataSourceId), { ...ctx, ...(config.params || {}) })
    return externalDatasourceService.formatOptions(rows, config.labelField, config.valueField)
  }

  const dataSource: dashboardService.DataSourceConfig = {
    type,
    sql: config.sql,
    script: config.script,
    api: config.api,
    option: config.option
  }
  const result = await dashboardService.executeDataSource(dataSource, ctx)
  return normalizeOptions(result)
}

function normalizeOptions(data: any): { label: string; value: any }[] {
  if (!data) return []
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return {
          label: item.label ?? item.name ?? item.text ?? String(item.value ?? ''),
          value: item.value ?? item.id ?? item.key ?? item.label ?? item.name
        }
      }
      return { label: String(item), value: item }
    })
  }
  return []
}

function normalizeUser(user?: any): { id: number; roleId: number; deptId?: number; isAdmin?: boolean } {
  if (!user) return { id: 0, roleId: 0 }
  return {
    id: user.id,
    roleId: user.roleId,
    deptId: user.deptId,
    isAdmin: user.roleId === 1 || user.permissions?.includes('*')
  }
}

async function getChildDeptIds(parentId?: number): Promise<number[]> {
  if (!parentId) return []
  const result = new Set<number>([parentId])
  const queue = [parentId]
  while (queue.length) {
    const current = queue.shift()!
    const children = await db('depts').where({ parent_id: current, status: 1 }).select('id')
    for (const child of children) {
      if (!result.has(child.id)) {
        result.add(child.id)
        queue.push(child.id)
      }
    }
  }
  return Array.from(result)
}

function formatDate(date: Date, format: string) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const map: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds())
  }
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => map[match])
}

// ---------- 校验规则 ----------

export async function getValidationRules() {
  return db('lowcode_validation_rules').orderBy('id', 'desc')
}

export async function createValidationRule(data: any) {
  const [id] = await db('lowcode_validation_rules').insert({
    code: data.code,
    name: data.name,
    pattern: data.pattern,
    message: data.message,
    status: data.status ?? 1
  })
  return db('lowcode_validation_rules').where({ id }).first()
}

export async function updateValidationRule(id: number, data: any) {
  await db('lowcode_validation_rules').where({ id }).update({
    name: data.name,
    pattern: data.pattern,
    message: data.message,
    status: data.status
  })
  return db('lowcode_validation_rules').where({ id }).first()
}

export async function deleteValidationRule(id: number) {
  await db('lowcode_validation_rules').where({ id }).del()
  return true
}

export async function validateField(ruleCode: string, value: any) {
  const rule = await db('lowcode_validation_rules').where({ code: ruleCode }).first()
  if (!rule) throw new AppError('校验规则不存在', 404)

  const regex = new RegExp(rule.pattern)
  return regex.test(value)
}

export async function validateBatch(items: { code: string; value: any }[]) {
  if (!items.length) return []
  const rules = await db('lowcode_validation_rules').whereIn('code', items.map((i) => i.code))
  const ruleMap = new Map(rules.map((r) => [r.code, r]))

  return items.map((item) => {
    const rule = ruleMap.get(item.code)
    if (!rule) {
      return { code: item.code, valid: false, message: '校验规则不存在' }
    }
    try {
      const regex = new RegExp(rule.pattern)
      const valid = regex.test(item.value)
      return { code: item.code, valid, message: valid ? '' : rule.message }
    } catch {
      return { code: item.code, valid: false, message: '校验规则表达式错误' }
    }
  })
}

// ---------- 异步导出 ----------

const EXPORT_DIR = path.resolve(process.cwd(), 'exports')

function ensureExportDir() {
  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true })
  }
}

export async function createExportTask(modelCode: string, options: { ids?: (string | number)[]; columns?: any[] }, user?: any) {
  await checkButtonPermission(modelCode, 'export', 'toolbar', user)
  ensureExportDir()
  const [id] = await db('export_tasks').insert({
    model_code: modelCode,
    status: 'pending'
  })

  // 异步处理导出任务
  setImmediate(() => {
    processExportTask(id, modelCode, options, user).catch((error) => {
      console.error('导出任务处理失败', error)
    })
  })

  return { id }
}

export async function getExportTask(id: number) {
  return db('export_tasks').where({ id }).first()
}

async function processExportTask(id: number, modelCode: string, options: { ids?: (string | number)[]; columns?: any[] }, user?: any) {
  try {
    const model = await getModelByCode(modelCode)
    const fields = model.fields.filter((f: any) => f.status === 1)

    let exportColumns: any[] = options.columns || fields.map((f: any) => ({
      field: f.field_name,
      label: f.display_name || f.field_name,
      type: f.type,
      format: '',
      dictCode: f.dict_code,
      refModel: f.ref_model,
      refDisplayField: f.ref_display_field
    }))

    const fieldMap = new Map<string, any>(fields.map((f: any) => [f.field_name, f]))
    exportColumns = exportColumns.filter((col: any) => fieldMap.has(col.field))

    // 分批次查询数据，避免内存溢出
    const pageSize = 500
    let page = 1
    let allRows: any[] = []

    if (options.ids && options.ids.length) {
      allRows = await db(model.table_name).whereIn('id', options.ids)
    } else {
      while (true) {
        const result = await dynamicList(modelCode, { page, pageSize }, user)
        allRows = allRows.concat(result.list)
        if (result.list.length < pageSize || allRows.length >= 50000) break
        page++
      }
    }

    const dictCodes = new Set<string>()
    for (const col of exportColumns) {
      const field = fieldMap.get(col.field)
      if (field?.dict_code) dictCodes.add(field.dict_code)
    }
    const dictData = await loadDictMap([...dictCodes])

    const headers = exportColumns.map((col: any) => col.label)
    const rows = allRows.map((row: any) => exportColumns.map((col: any) => formatExportValue(row, col, fieldMap, dictData)))

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, model.name || '数据')

    const fileName = `${modelCode}_${Date.now()}.xlsx`
    const filePath = path.join(EXPORT_DIR, fileName)
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    fs.writeFileSync(filePath, buffer)

    await db('export_tasks').where({ id }).update({
      status: 'success',
      file_path: filePath,
      total: allRows.length,
      success_count: allRows.length,
      update_time: db.fn.now()
    })
  } catch (error: any) {
    await db('export_tasks').where({ id }).update({
      status: 'error',
      message: error.message || '导出失败',
      update_time: db.fn.now()
    })
  }
}

export async function downloadExportFile(id: number) {
  const task = await db('export_tasks').where({ id }).first()
  if (!task) throw new AppError('导出任务不存在', 404)
  if (task.status !== 'success') throw new AppError('导出任务未完成', 400)
  if (!task.file_path || !fs.existsSync(task.file_path)) throw new AppError('导出文件已过期', 404)

  return {
    filePath: task.file_path,
    fileName: path.basename(task.file_path)
  }
}
