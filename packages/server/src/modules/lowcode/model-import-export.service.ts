import { db } from '../../db'
import { AppError } from '../../utils/response'
import { getModelById, createModel, createField } from './lowcode.service'
import * as relationService from './relation.service'

const EXPORT_VERSION = '1.0'

export async function exportModel(modelId: number) {
  const model = await getModelById(modelId)
  const relations = await relationService.getRelations({
    sourceModel: model.code,
    targetModel: model.code
  })

  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    model: {
      code: model.code,
      name: model.name,
      table_name: model.table_name,
      description: model.description,
      data_permission: model.data_permission,
      enable_audit: model.enable_audit,
      status: model.status
    },
    fields: (model.fields || []).map((f: any) => ({
      field_name: f.field_name,
      display_name: f.display_name,
      type: f.type,
      length: f.length,
      required: f.required,
      default_value: f.default_value,
      default_value_type: f.default_value_type,
      default_value_expr: f.default_value_expr,
      options: parseJson(f.options),
      validation_rule: f.validation_rule,
      dict_code: f.dict_code,
      ref_model: f.ref_model,
      ref_display_field: f.ref_display_field,
      ref_relation: f.ref_relation,
      ref_filter: parseJson(f.ref_filter),
      sort: f.sort,
      status: f.status
    })),
    forms: (model.forms || []).map((f: any) => ({
      name: f.name,
      config: parseJson(f.config),
      status: f.status
    })),
    tables: (model.tables || []).map((t: any) => ({
      name: t.name,
      config: parseJson(t.config),
      status: t.status
    })),
    relations: relations.map((r: any) => ({
      code: r.code,
      name: r.name,
      source_model: r.source_model,
      target_model: r.target_model,
      relation_type: r.relation_type,
      source_field: r.source_field,
      target_field: r.target_field,
      junction_table: r.junction_table,
      status: r.status
    }))
  }
}

export async function importModel(fileBuffer: Buffer, conflict: string = 'skip') {
  let data: any
  try {
    data = JSON.parse(fileBuffer.toString('utf-8'))
  } catch {
    throw new AppError('无效的 JSON 文件', 400)
  }

  if (!data.model?.code || !data.model?.table_name) {
    throw new AppError('JSON 缺少模型编码或表名', 400)
  }

  const modelCode = data.model.code
  const existing = await db('lowcode_models').where({ code: modelCode }).first()

  let action = 'created'

  if (existing) {
    if (conflict === 'error') {
      throw new AppError(`模型编码 "${modelCode}" 已存在`, 400)
    }
    if (conflict === 'skip') {
      return { modelCode, action: 'skipped' }
    }
    if (conflict === 'overwrite') {
      // 删除旧模型级联删除字段/表单/列表，物理表也删除
      await db.schema.dropTableIfExists(existing.table_name)
      await db('lowcode_models').where({ id: existing.id }).del()
      action = 'overwritten'
    }
  }

  // 检查表名是否已被其他模型使用
  const tableExists = await db('lowcode_models').where({ table_name: data.model.table_name }).first()
  if (tableExists) {
    throw new AppError(`表名 "${data.model.table_name}" 已被其他模型使用`, 400)
  }

  const model = await createModel({
    code: data.model.code,
    name: data.model.name,
    tableName: data.model.table_name,
    description: data.model.description,
    dataPermission: data.model.data_permission,
    enableAudit: data.model.enable_audit === 1,
    status: data.model.status ?? 1
  })

  const fieldMap = new Map<string, number>()

  // 创建字段
  for (const field of data.fields || []) {
    const created = await createField({
      modelId: model.id,
      fieldName: field.field_name,
      displayName: field.display_name,
      type: field.type,
      length: field.length,
      required: field.required === 1,
      defaultValue: field.default_value,
      defaultValueType: field.default_value_type || 'constant',
      defaultValueExpr: field.default_value_expr,
      options: field.options,
      validationRule: field.validation_rule,
      dictCode: field.dict_code,
      refModel: field.ref_model,
      refDisplayField: field.ref_display_field,
      refRelation: field.ref_relation,
      refFilter: field.ref_filter,
      sort: field.sort ?? 0,
      status: field.status ?? 1
    })
    fieldMap.set(field.field_name, created.id)
  }

  // 创建表单配置
  for (const form of data.forms || []) {
    await db('lowcode_forms').insert({
      model_id: model.id,
      name: form.name || '默认表单',
      config: form.config ? JSON.stringify(form.config) : '{}',
      status: form.status ?? 1
    })
  }

  // 创建列表配置
  for (const table of data.tables || []) {
    await db('lowcode_tables').insert({
      model_id: model.id,
      name: table.name || '默认列表',
      config: table.config ? JSON.stringify(table.config) : '{}',
      status: table.status ?? 1
    })
  }

  // 创建关联关系（目标模型必须存在）
  const relationResults: { code: string; status: string; reason?: string }[] = []
  for (const relation of data.relations || []) {
    const targetModel = await db('lowcode_models').where({ code: relation.target_model }).first()
    const sourceModel = await db('lowcode_models').where({ code: relation.source_model }).first()
    if (!targetModel || !sourceModel) {
      relationResults.push({
        code: relation.code,
        status: 'skipped',
        reason: `源模型或目标模型不存在`
      })
      continue
    }

    const existingRelation = await relationService.getRelationByCode(relation.code)
    if (existingRelation) {
      relationResults.push({
        code: relation.code,
        status: 'skipped',
        reason: '关系编码已存在'
      })
      continue
    }

    try {
      await relationService.createRelation({
        code: relation.code,
        name: relation.name,
        sourceModel: relation.source_model,
        targetModel: relation.target_model,
        relationType: relation.relation_type,
        sourceField: relation.source_field,
        targetField: relation.target_field,
        junctionTable: relation.junction_table,
        status: relation.status ?? 1
      })
      relationResults.push({ code: relation.code, status: 'created' })
    } catch (error: any) {
      relationResults.push({
        code: relation.code,
        status: 'failed',
        reason: error.message || '创建失败'
      })
    }
  }

  return {
    modelCode,
    action,
    relations: relationResults
  }
}

function parseJson(value: any) {
  if (value === null || value === undefined) return null
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}
