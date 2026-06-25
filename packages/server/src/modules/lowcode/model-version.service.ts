import { db } from '../../db'
import { AppError } from '../../utils/response'
import { getModelByCode, getModelById, createField, updateField, deleteField, updateModel } from './lowcode.service'
import * as relationService from './relation.service'

export async function getModelVersions(modelId: number) {
  const model = await getModelById(modelId)
  return db('lowcode_model_versions')
    .where({ model_id: modelId })
    .orderBy('id', 'desc')
}

export async function createModelVersion(modelId: number, data: any) {
  const model = await getModelById(modelId)
  const relations = await relationService.getRelations({
    sourceModel: model.code,
    targetModel: model.code
  })

  const snapshot = {
    model: {
      name: model.name,
      description: model.description,
      status: model.status,
      enable_audit: model.enable_audit,
      data_permission: model.data_permission
    },
    fields: model.fields.map((f: any) => ({
      field_name: f.field_name,
      display_name: f.display_name,
      type: f.type,
      length: f.length,
      required: f.required,
      default_value: f.default_value,
      default_value_type: f.default_value_type,
      default_value_expr: f.default_value_expr,
      options: f.options,
      validation_rule: f.validation_rule,
      dict_code: f.dict_code,
      ref_model: f.ref_model,
      ref_display_field: f.ref_display_field,
      ref_relation: f.ref_relation,
      ref_filter: f.ref_filter,
      sort: f.sort,
      status: f.status
    })),
    forms: model.forms.map((f: any) => ({
      name: f.name,
      config: parseJson(f.config),
      status: f.status
    })),
    tables: model.tables.map((t: any) => ({
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

  await db('lowcode_model_versions').where({ model_id: modelId }).update({ is_published: 0 })

  const [id] = await db('lowcode_model_versions').insert({
    model_id: modelId,
    version: data.version || generateVersion(),
    description: data.description || '',
    snapshot: JSON.stringify(snapshot),
    is_published: 1
  })

  return db('lowcode_model_versions').where({ id }).first()
}

export async function deleteModelVersion(modelId: number, versionId: number) {
  const version = await db('lowcode_model_versions').where({ id: versionId, model_id: modelId }).first()
  if (!version) throw new AppError('版本不存在', 404)
  await db('lowcode_model_versions').where({ id: versionId }).del()
  return true
}

export async function rollbackModelVersion(modelId: number, versionId: number) {
  const version = await db('lowcode_model_versions').where({ id: versionId, model_id: modelId }).first()
  if (!version) throw new AppError('版本不存在', 404)

  const snapshot = parseJson(version.snapshot)
  if (!snapshot) throw new AppError('快照数据无效', 400)

  // 1. 回滚模型基础信息
  await updateModel(modelId, {
    name: snapshot.model?.name,
    description: snapshot.model?.description,
    status: snapshot.model?.status,
    enableAudit: snapshot.model?.enable_audit,
    dataPermission: snapshot.model?.data_permission
  })

  // 2. 回滚字段
  await rollbackFields(modelId, snapshot.fields || [])

  // 3. 回滚表单/列表配置
  await rollbackForms(modelId, snapshot.forms || [])
  await rollbackTables(modelId, snapshot.tables || [])

  // 4. 回滚关联关系（更新或创建，不删除）
  await rollbackRelations(snapshot.relations || [])

  // 5. 标记当前版本
  await db('lowcode_model_versions').where({ model_id: modelId }).update({ is_published: 0 })
  await db('lowcode_model_versions').where({ id: versionId }).update({ is_published: 1 })

  return getModelById(modelId)
}

async function rollbackFields(modelId: number, snapshotFields: any[]) {
  const currentFields = await db('lowcode_fields').where({ model_id: modelId })
  const currentMap = new Map(currentFields.map((f) => [f.field_name, f]))
  const snapshotMap = new Map(snapshotFields.map((f) => [f.field_name, f]))

  // 删除快照中不存在的字段（仅元数据）
  for (const [name, field] of currentMap) {
    if (!snapshotMap.has(name)) {
      await deleteField(field.id)
    }
  }

  // 新增或更新字段
  for (const field of snapshotFields) {
    const current = currentMap.get(field.field_name)
    const input = fieldSnapshotToInput(modelId, field)
    if (!current) {
      await createField(input)
    } else {
      await updateField(current.id, input)
    }
  }
}

async function rollbackForms(modelId: number, snapshotForms: any[]) {
  await db('lowcode_forms').where({ model_id: modelId }).del()
  for (const form of snapshotForms) {
    await db('lowcode_forms').insert({
      model_id: modelId,
      name: form.name,
      config: form.config ? JSON.stringify(form.config) : '{}',
      status: form.status ?? 1
    })
  }
}

async function rollbackTables(modelId: number, snapshotTables: any[]) {
  await db('lowcode_tables').where({ model_id: modelId }).del()
  for (const table of snapshotTables) {
    await db('lowcode_tables').insert({
      model_id: modelId,
      name: table.name,
      config: table.config ? JSON.stringify(table.config) : '{}',
      status: table.status ?? 1
    })
  }
}

async function rollbackRelations(snapshotRelations: any[]) {
  for (const relation of snapshotRelations) {
    const existing = await relationService.getRelationByCode(relation.code)
    if (existing) {
      await relationService.updateRelation(existing.id, {
        name: relation.name,
        sourceModel: relation.source_model,
        targetModel: relation.target_model,
        relationType: relation.relation_type,
        sourceField: relation.source_field,
        targetField: relation.target_field,
        junctionTable: relation.junction_table,
        status: relation.status
      })
    } else {
      await relationService.createRelation({
        code: relation.code,
        name: relation.name,
        sourceModel: relation.source_model,
        targetModel: relation.target_model,
        relationType: relation.relation_type,
        sourceField: relation.source_field,
        targetField: relation.target_field,
        junctionTable: relation.junction_table,
        status: relation.status
      })
    }
  }
}

function fieldSnapshotToInput(modelId: number, field: any) {
  return {
    modelId,
    fieldName: field.field_name,
    displayName: field.display_name,
    type: field.type,
    length: field.length,
    required: field.required,
    defaultValue: field.default_value,
    defaultValueType: field.default_value_type,
    defaultValueExpr: field.default_value_expr,
    options: field.options,
    validationRule: field.validation_rule,
    dictCode: field.dict_code,
    refModel: field.ref_model,
    refDisplayField: field.ref_display_field,
    refRelation: field.ref_relation,
    refFilter: field.ref_filter,
    sort: field.sort,
    status: field.status
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

function generateVersion() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0')
  return `v${date}.${time}`
}
