import { db } from '../../db'
import { AppError } from '../../utils/response'

const RESERVED_FIELDS = ['id', 'create_time', 'update_time']

function safeTableName(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function safeFieldName(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

// ---------- 数据模型 ----------

export async function getModels() {
  return db('lowcode_models').orderBy('id', 'desc')
}

export async function getModelById(id: number) {
  const model = await db('lowcode_models').where({ id }).first()
  if (!model) throw new AppError('模型不存在', 404)
  const fields = await db('lowcode_fields')
    .where({ model_id: id })
    .orderBy('sort', 'asc')
  const forms = await db('lowcode_forms').where({ model_id: id })
  const tables = await db('lowcode_tables').where({ model_id: id })
  return { ...model, fields, forms, tables }
}

export async function getModelByCode(code: string) {
  const model = await db('lowcode_models').where({ code }).first()
  if (!model) throw new AppError('模型不存在', 404)
  const fields = await db('lowcode_fields')
    .where({ model_id: model.id })
    .orderBy('sort', 'asc')
  const forms = await db('lowcode_forms').where({ model_id: model.id })
  const tables = await db('lowcode_tables').where({ model_id: model.id })
  return { ...model, fields, forms, tables }
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
    status: data.status ?? 1
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
    status: data.status,
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
    options: data.options ? JSON.stringify(data.options) : null,
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
    options: data.options ? JSON.stringify(data.options) : null,
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

  // SQLite 不支持 drop column（需重建表），这里仅删除元数据
  await db('lowcode_fields').where({ id }).del()
  return true
}

// ---------- 表单/列表配置 ----------

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
    table.timestamp('create_time').defaultTo(db.fn.now())
    table.timestamp('update_time').defaultTo(db.fn.now())
  })
}

async function addPhysicalColumn(tableName: string, columnName: string, fieldData: any) {
  const exists = await db.schema.hasColumn(tableName, columnName)
  if (exists) return

  await db.schema.table(tableName, (table) => {
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

// ---------- 动态 CRUD ----------

export async function dynamicList(modelCode: string, query: any) {
  const model = await getModelByCode(modelCode)
  const { keyword, filters, page = 1, pageSize = 10 } = query

  const builder = db(model.table_name)
  const fields = model.fields.filter((f: any) => f.status === 1)

  // 关键词模糊搜索
  if (keyword && fields.length) {
    const stringFields = fields
      .filter((f: any) => ['string', 'text', 'textarea'].includes(f.type))
      .map((f: any) => f.field_name)

    if (stringFields.length) {
      builder.where((qb) => {
        stringFields.forEach((field: string, index: number) => {
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

    switch (operator) {
      case 'eq':
        builder.where(field, value)
        break
      case 'ne':
        builder.whereNot(field, value)
        break
      case 'like':
        builder.where(field, 'like', `%${value}%`)
        break
      case 'gt':
        builder.where(field, '>', value)
        break
      case 'lt':
        builder.where(field, '<', value)
        break
      case 'gte':
        builder.where(field, '>=', value)
        break
      case 'lte':
        builder.where(field, '<=', value)
        break
      default:
        builder.where(field, value)
    }
  })

  const total = await builder.clone().count({ count: '*' }).first()
  const list = await builder
    .orderBy('id', 'desc')
    .offset((Number(page) - 1) * Number(pageSize))
    .limit(Number(pageSize))

  return {
    list,
    total: Number(total?.count || 0),
    page: Number(page),
    pageSize: Number(pageSize)
  }
}

export async function dynamicDetail(modelCode: string, id: number) {
  const model = await getModelByCode(modelCode)
  const row = await db(model.table_name).where({ id }).first()
  if (!row) throw new AppError('记录不存在', 404)
  return row
}

export async function dynamicCreate(modelCode: string, data: any) {
  const model = await getModelByCode(modelCode)
  const cleanData = sanitizeData(model.fields, data)
  const [id] = await db(model.table_name).insert(cleanData)
  return db(model.table_name).where({ id }).first()
}

export async function dynamicUpdate(modelCode: string, id: number, data: any) {
  const model = await getModelByCode(modelCode)
  const cleanData = sanitizeData(model.fields, data)
  cleanData.update_time = db.fn.now()
  await db(model.table_name).where({ id }).update(cleanData)
  return db(model.table_name).where({ id }).first()
}

export async function dynamicDelete(modelCode: string, id: number) {
  const model = await getModelByCode(modelCode)
  await db(model.table_name).where({ id }).del()
  return true
}

function sanitizeData(fields: any[], data: any) {
  const result: any = {}
  const fieldMap = new Map(fields.map((f) => [f.field_name, f]))

  Object.entries(data).forEach(([key, value]) => {
    if (RESERVED_FIELDS.includes(key)) return
    const field = fieldMap.get(key)
    if (!field) return

    // 类型转换
    if (field.type === 'number' || field.type === 'integer') {
      result[key] = value === '' || value === undefined ? null : Number(value)
    } else if (field.type === 'boolean' || field.type === 'switch') {
      result[key] = value === true || value === '1' || value === 1 ? 1 : 0
    } else {
      result[key] = value
    }
  })

  return result
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
