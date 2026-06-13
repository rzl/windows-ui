import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as lowcodeService from './lowcode.service'

// 模型
export async function getModels(_req: Request, res: Response) {
  const result = await lowcodeService.getModels()
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
  const result = await lowcodeService.dynamicList(req.params.modelCode, req.query)
  res.json(success(result))
}

export async function dynamicDetail(req: Request, res: Response) {
  const result = await lowcodeService.dynamicDetail(req.params.modelCode, Number(req.params.id))
  res.json(success(result))
}

export async function dynamicCreate(req: Request, res: Response) {
  const result = await lowcodeService.dynamicCreate(req.params.modelCode, req.body)
  res.json(success(result, '创建成功'))
}

export async function dynamicUpdate(req: Request, res: Response) {
  const result = await lowcodeService.dynamicUpdate(req.params.modelCode, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function dynamicDelete(req: Request, res: Response) {
  await lowcodeService.dynamicDelete(req.params.modelCode, Number(req.params.id))
  res.json(success(null, '删除成功'))
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
