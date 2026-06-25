import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as lowcodeService from './lowcode.service'
import * as importExportService from './model-import-export.service'

// 模型
export async function getModels(req: Request, res: Response) {
  const result = await lowcodeService.getModels((req as AuthRequest).user)
  res.json(success(result))
}

export async function getModel(req: Request, res: Response) {
  const result = await lowcodeService.getModelById(Number(req.params.id))
  res.json(success(result))
}

export async function getModelByCode(req: Request, res: Response) {
  const result = await lowcodeService.getModelByCode(req.params.code)
  res.json(success(result))
}

export async function getModelPermission(req: Request, res: Response) {
  const result = await lowcodeService.getModelPermission(req.params.code, (req as AuthRequest).user)
  res.json(success(result))
}

export async function createModel(req: Request, res: Response) {
  const result = await lowcodeService.createModel(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateModel(req: Request, res: Response) {
  const result = await lowcodeService.updateModel(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteModel(req: Request, res: Response) {
  await lowcodeService.deleteModel(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function exportModel(req: Request, res: Response) {
  const data = await importExportService.exportModel(Number(req.params.id))
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
  const result = await importExportService.importModel(req.file.buffer, conflict as any)
  res.json(success(result, '导入成功'))
}

// 字段
export async function createField(req: Request, res: Response) {
  const result = await lowcodeService.createField(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateField(req: Request, res: Response) {
  const result = await lowcodeService.updateField(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteField(req: Request, res: Response) {
  await lowcodeService.deleteField(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function batchDeleteFields(req: Request, res: Response) {
  await lowcodeService.batchDeleteFields(req.body.ids || [])
  res.json(success(null, '批量删除成功'))
}

// 表单/列表配置
export async function saveForm(req: Request, res: Response) {
  const result = await lowcodeService.saveForm(req.body)
  res.json(success(result, '保存成功'))
}

export async function saveTable(req: Request, res: Response) {
  const result = await lowcodeService.saveTable(req.body)
  res.json(success(result, '保存成功'))
}

// 动态 CRUD
export async function dynamicList(req: Request, res: Response) {
  const result = await lowcodeService.dynamicList(req.params.modelCode, req.query, (req as AuthRequest).user)
  res.json(success(result))
}

export async function dynamicDetail(req: Request, res: Response) {
  const result = await lowcodeService.dynamicDetail(req.params.modelCode, Number(req.params.id), (req as AuthRequest).user, req.query)
  res.json(success(result))
}

export async function dynamicCreate(req: Request, res: Response) {
  const result = await lowcodeService.dynamicCreate(req.params.modelCode, req.body, (req as AuthRequest).user, req)
  res.json(success(result, '创建成功'))
}

export async function dynamicUpdate(req: Request, res: Response) {
  const result = await lowcodeService.dynamicUpdate(req.params.modelCode, Number(req.params.id), req.body, (req as AuthRequest).user, req)
  res.json(success(result, '更新成功'))
}

export async function dynamicDelete(req: Request, res: Response) {
  await lowcodeService.dynamicDelete(req.params.modelCode, Number(req.params.id), (req as AuthRequest).user, req)
  res.json(success(null, '删除成功'))
}

export async function dynamicBatchDelete(req: Request, res: Response) {
  await lowcodeService.dynamicBatchDelete(req.params.modelCode, req.body.ids || [], (req as AuthRequest).user, req)
  res.json(success(null, '批量删除成功'))
}

export async function dynamicImport(req: Request, res: Response) {
  const result = await lowcodeService.dynamicImport(req.params.modelCode, req.body.rows || [], (req as AuthRequest).user, req)
  res.json(success(result, '导入成功'))
}

export async function exportDynamicExcel(req: Request, res: Response) {
  const { ids, columns } = req.body
  const buffer = await lowcodeService.exportDynamicExcel(req.params.modelCode, { ids, columns }, (req as AuthRequest).user)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.modelCode}.xlsx`)
  res.send(buffer)
}

export async function importDynamicExcel(req: Request, res: Response) {
  if (!req.file?.buffer) {
    res.status(400).json(success(null, '请上传 Excel 文件'))
    return
  }
  const result = await lowcodeService.importDynamicExcel(req.params.modelCode, req.file.buffer, (req as AuthRequest).user)
  res.json(success(result))
}

export async function getImportTemplate(req: Request, res: Response) {
  const buffer = await lowcodeService.getImportTemplate(req.params.modelCode)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.modelCode}_template.xlsx`)
  res.send(buffer)
}

export async function createExportTask(req: Request, res: Response) {
  const { ids, columns } = req.body
  const result = await lowcodeService.createExportTask(req.params.modelCode, { ids, columns }, (req as AuthRequest).user)
  res.json(success(result, '导出任务已创建'))
}

export async function getExportTask(req: Request, res: Response) {
  const result = await lowcodeService.getExportTask(Number(req.params.id))
  res.json(success(result))
}

export async function downloadExportFile(req: Request, res: Response) {
  const { filePath, fileName } = await lowcodeService.downloadExportFile(Number(req.params.id))
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  res.sendFile(filePath)
}

// 编码规则
export async function getCodingRules(_req: Request, res: Response) {
  const result = await lowcodeService.getCodingRules()
  res.json(success(result))
}

export async function createCodingRule(req: Request, res: Response) {
  const result = await lowcodeService.createCodingRule(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateCodingRule(req: Request, res: Response) {
  const result = await lowcodeService.updateCodingRule(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteCodingRule(req: Request, res: Response) {
  await lowcodeService.deleteCodingRule(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function generateCode(req: Request, res: Response) {
  const result = await lowcodeService.generateCode(req.params.ruleCode)
  res.json(success(result))
}

// 校验规则
export async function getValidationRules(_req: Request, res: Response) {
  const result = await lowcodeService.getValidationRules()
  res.json(success(result))
}

export async function createValidationRule(req: Request, res: Response) {
  const result = await lowcodeService.createValidationRule(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateValidationRule(req: Request, res: Response) {
  const result = await lowcodeService.updateValidationRule(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteValidationRule(req: Request, res: Response) {
  await lowcodeService.deleteValidationRule(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function validateField(req: Request, res: Response) {
  const result = await lowcodeService.validateField(req.params.ruleCode, req.body.value)
  res.json(success(result))
}

export async function validateBatch(req: Request, res: Response) {
  const result = await lowcodeService.validateBatch(req.body.items || [])
  res.json(success(result))
}

export async function executeFieldOptions(req: Request, res: Response) {
  const result = await lowcodeService.executeFieldOptions(req.body.config || {}, req.body.ctx || {})
  res.json(success(result))
}
