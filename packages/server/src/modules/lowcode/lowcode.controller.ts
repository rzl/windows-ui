import type { Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as lowcodeService from './lowcode.service'
import * as importExportService from './model-import-export.service'

// 模型
export async function getModels(req: AuthRequest, res: Response) {
  const result = await lowcodeService.getModels(req)
  res.json(success(result))
}

export async function getModel(req: AuthRequest, res: Response) {
  const result = await lowcodeService.getModelById(req, Number(req.params.id))
  res.json(success(result))
}

export async function getModelByCode(req: AuthRequest, res: Response) {
  const result = await lowcodeService.getModelByCode(req, req.params.code)
  res.json(success(result))
}

export async function getModelPermission(req: AuthRequest, res: Response) {
  const result = await lowcodeService.getModelPermission(req, req.params.code, req.user)
  res.json(success(result))
}

export async function createModel(req: AuthRequest, res: Response) {
  const result = await lowcodeService.createModel(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateModel(req: AuthRequest, res: Response) {
  const result = await lowcodeService.updateModel(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteModel(req: AuthRequest, res: Response) {
  await lowcodeService.deleteModel(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function exportModel(req: AuthRequest, res: Response) {
  const data = await importExportService.exportModel(req, Number(req.params.id))
  const fileName = `model_${data.model.code}_${Date.now()}.json`
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  res.send(JSON.stringify(data, null, 2))
}

export async function importModel(req: AuthRequest, res: Response) {
  if (!req.file) {
    res.status(400).json(success(null, '请上传 JSON 文件'))
    return
  }
  const conflict = String(req.query.conflict || 'skip')
  const result = await importExportService.importModel(req, req.file.buffer, conflict as any)
  res.json(success(result, '导入成功'))
}

// 字段
export async function createField(req: AuthRequest, res: Response) {
  const result = await lowcodeService.createField(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateField(req: AuthRequest, res: Response) {
  const result = await lowcodeService.updateField(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteField(req: AuthRequest, res: Response) {
  await lowcodeService.deleteField(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function batchDeleteFields(req: AuthRequest, res: Response) {
  await lowcodeService.batchDeleteFields(req, req.body.ids || [])
  res.json(success(null, '批量删除成功'))
}

// 表单/列表配置
export async function saveForm(req: AuthRequest, res: Response) {
  const result = await lowcodeService.saveForm(req, req.body)
  res.json(success(result, '保存成功'))
}

export async function saveTable(req: AuthRequest, res: Response) {
  const result = await lowcodeService.saveTable(req, req.body)
  res.json(success(result, '保存成功'))
}

// 动态 CRUD
export async function dynamicList(req: AuthRequest, res: Response) {
  const result = await lowcodeService.dynamicList(req, req.params.modelCode, req.query, req.user)
  res.json(success(result))
}

export async function dynamicDetail(req: AuthRequest, res: Response) {
  const result = await lowcodeService.dynamicDetail(req, req.params.modelCode, Number(req.params.id), req.user, req.query)
  res.json(success(result))
}

export async function dynamicCreate(req: AuthRequest, res: Response) {
  const result = await lowcodeService.dynamicCreate(req, req.params.modelCode, req.body, req.user)
  res.json(success(result, '创建成功'))
}

export async function dynamicUpdate(req: AuthRequest, res: Response) {
  const result = await lowcodeService.dynamicUpdate(req, req.params.modelCode, Number(req.params.id), req.body, req.user)
  res.json(success(result, '更新成功'))
}

export async function dynamicDelete(req: AuthRequest, res: Response) {
  await lowcodeService.dynamicDelete(req, req.params.modelCode, Number(req.params.id), req.user)
  res.json(success(null, '删除成功'))
}

export async function dynamicBatchDelete(req: AuthRequest, res: Response) {
  await lowcodeService.dynamicBatchDelete(req, req.params.modelCode, req.body.ids || [], req.user)
  res.json(success(null, '批量删除成功'))
}

export async function dynamicImport(req: AuthRequest, res: Response) {
  const result = await lowcodeService.dynamicImport(req, req.params.modelCode, req.body.rows || [], req.user)
  res.json(success(result, '导入成功'))
}

export async function exportDynamicExcel(req: AuthRequest, res: Response) {
  const { ids, columns } = req.body
  const buffer = await lowcodeService.exportDynamicExcel(req, req.params.modelCode, { ids, columns }, req.user)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.modelCode}.xlsx`)
  res.send(buffer)
}

export async function importDynamicExcel(req: AuthRequest, res: Response) {
  if (!req.file?.buffer) {
    res.status(400).json(success(null, '请上传 Excel 文件'))
    return
  }
  const result = await lowcodeService.importDynamicExcel(req, req.params.modelCode, req.file.buffer, req.user)
  res.json(success(result))
}

export async function getImportTemplate(req: AuthRequest, res: Response) {
  const buffer = await lowcodeService.getImportTemplate(req, req.params.modelCode)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.modelCode}_template.xlsx`)
  res.send(buffer)
}

export async function createExportTask(req: AuthRequest, res: Response) {
  const { ids, columns } = req.body
  const result = await lowcodeService.createExportTask(req, req.params.modelCode, { ids, columns }, req.user)
  res.json(success(result, '导出任务已创建'))
}

export async function getExportTask(req: AuthRequest, res: Response) {
  const result = await lowcodeService.getExportTask(req, Number(req.params.id))
  res.json(success(result))
}

export async function downloadExportFile(req: AuthRequest, res: Response) {
  const { filePath, fileName } = await lowcodeService.downloadExportFile(req, Number(req.params.id))
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  res.sendFile(filePath)
}

// 编码规则
export async function getCodingRules(req: AuthRequest, res: Response) {
  const result = await lowcodeService.getCodingRules(req)
  res.json(success(result))
}

export async function createCodingRule(req: AuthRequest, res: Response) {
  const result = await lowcodeService.createCodingRule(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateCodingRule(req: AuthRequest, res: Response) {
  const result = await lowcodeService.updateCodingRule(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteCodingRule(req: AuthRequest, res: Response) {
  await lowcodeService.deleteCodingRule(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function generateCode(req: AuthRequest, res: Response) {
  const result = await lowcodeService.generateCode(req, req.params.ruleCode)
  res.json(success(result))
}

// 校验规则
export async function getValidationRules(req: AuthRequest, res: Response) {
  const result = await lowcodeService.getValidationRules(req)
  res.json(success(result))
}

export async function createValidationRule(req: AuthRequest, res: Response) {
  const result = await lowcodeService.createValidationRule(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateValidationRule(req: AuthRequest, res: Response) {
  const result = await lowcodeService.updateValidationRule(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteValidationRule(req: AuthRequest, res: Response) {
  await lowcodeService.deleteValidationRule(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function validateField(req: AuthRequest, res: Response) {
  const result = await lowcodeService.validateField(req, req.params.ruleCode, req.body.value)
  res.json(success(result))
}

export async function validateBatch(req: AuthRequest, res: Response) {
  const result = await lowcodeService.validateBatch(req, req.body.items || [])
  res.json(success(result))
}

export async function executeFieldOptions(req: AuthRequest, res: Response) {
  const result = await lowcodeService.executeFieldOptions(req, req.body.config || {}, req.body.ctx || {})
  res.json(success(result))
}
