import { db } from '../../db'
import { AppError } from '../../utils/response'
import { tenantWhere, setTenantId } from '../../utils/tenant'
import type { AuthRequest } from '../../middleware/auth'
import { getModelByCode, getModelById, createField, updateField, deleteField, updateModel } from './lowcode.service'
import * as relationService from './relation.service'

export async function getModelVersions(req: AuthRequest, modelId: number) {
  const model = await getModelById(req, modelId)
  return db('lowcode_model_versions')
    .where({ model_id: modelId, ...tenantWhere(req) })
    .orderBy('id', 'desc')
}

export async function createModelVersion(req: AuthRequest, modelId: number, data: any) {
  const model = await getModelById(req, modelId)
  const relations = await relationService.getRelations(req, {
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

  await db('lowcode_model_versions')
    .where({ model_id: modelId, ...tenantWhere(req) })
    .update({ is_published: 0 })

  const [id] = await db('lowcode_model_versions').insert(
    setTenantId({
      model_id: modelId,
      version: data.version || generateVersion(),
      description: data.description || '',
      snapshot: JSON.stringify(snapshot),
      is_published: 1
    }, req)
  )

  return db('lowcode_model_versions')
    .where({ id, ...tenantWhere(req) })
    .first()
}

export async function deleteModelVersion(req: AuthRequest, modelId: number, versionId: number) {
  const version = await db('lowcode_model_versions')
    .where({ id: versionId, model_id: modelId, ...tenantWhere(req) })
    .first()
  if (!version) throw new AppError('版本不存在', 404)
  await db('lowcode_model_versions')
    .where({ id: versionId, model_id: modelId, ...tenantWhere(req) })
    .del()
  return true
}

export async function rollbackModelVersion(req: AuthRequest, modelId: number, versionId: number) {
  const version = await db('lowcode_model_versions')
    .where({ id: versionId, model_id: modelId, ...tenantWhere(req) })
    .first()
  if (!version) throw new AppError('版本不存在', 404)

  const snapshot = parseJson(version.snapshot)
  if (!snapshot) throw new AppError('快照数据无效', 400)

  // 1. 回滚模型基础信息
  await updateModel(req, modelId, {
    name: snapshot.model?.name,
    description: snapshot.model?.description,
    status: snapshot.model?.status,
    enableAudit: snapshot.model?.enable_audit,
    dataPermission: snapshot.model?.data_permission
  })

  // 2. 回滚字段
  await rollbackFields(req, modelId, snapshot.fields || [])

  // 3. 回滚表单/列表配置
  await rollbackForms(req, modelId, snapshot.forms || [])
  await rollbackTables(req, modelId, snapshot.tables || [])

  // 4. 回滚关联关系（更新或创建，不删除）
  await rollbackRelations(req, snapshot.relations || [])

  // 5. 标记当前版本
  await db('lowcode_model_versions')
    .where({ model_id: modelId, ...tenantWhere(req) })
    .update({ is_published: 0 })
  await db('lowcode_model_versions')
    .where({ id: versionId, ...tenantWhere(req) })
    .update({ is_published: 1 })

  return getModelById(req, modelId)
}

async function rollbackFields(req: AuthRequest, modelId: number, snapshotFields: any[]) {
  const currentFields = await db('lowcode_fields').where({ model_id: modelId }).where(tenantWhere(req))
  const currentMap = new Map(currentFields.map((f) => [f.field_name, f]))
  const snapshotMap = new Map(snapshotFields.map((f) => [f.field_name, f]))

  // 删除快照中不存在的字段（仅元数据）
  for (const [name, field] of currentMap) {
    if (!snapshotMap.has(name)) {
      await deleteField(req, field.id)
    }
  }

  // 新增或更新字段
  for (const field of snapshotFields) {
    const current = currentMap.get(field.field_name)
    const input = fieldSnapshotToInput(modelId, field)
    if (!current) {
      await createField(req, input)
    } else {
      await updateField(req, current.id, input)
    }
  }
}

async function rollbackForms(req: AuthRequest, modelId: number, snapshotForms: any[]) {
  await db('lowcode_forms').where({ model_id: modelId }).where(tenantWhere(req)).del()
  for (const form of snapshotForms) {
    await db('lowcode_forms').insert({
      ...tenantWhere(req),
      model_id: modelId,
      name: form.name,
      config: form.config ? JSON.stringify(form.config) : '{}',
      status: form.status ?? 1
    })
  }
}

async function rollbackTables(req: AuthRequest, modelId: number, snapshotTables: any[]) {
  await db('lowcode_tables').where({ model_id: modelId }).where(tenantWhere(req)).del()
  for (const table of snapshotTables) {
    await db('lowcode_tables').insert({
      ...tenantWhere(req),
      model_id: modelId,
      name: table.name,
      config: table.config ? JSON.stringify(table.config) : '{}',
      status: table.status ?? 1
    })
  }
}

async function rollbackRelations(req: AuthRequest, snapshotRelations: any[]) {
  for (const relation of snapshotRelations) {
    const existing = await relationService.getRelationByCode(req, relation.code)
    if (existing) {
      await relationService.updateRelation(req, existing.id, {
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
      await relationService.createRelation(req, {
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
