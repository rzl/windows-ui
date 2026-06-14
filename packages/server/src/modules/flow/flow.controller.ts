import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as flowService from './flow.service'

export async function getFlowDefinitions(_req: Request, res: Response) {
  const result = await flowService.getFlowDefinitions()
  res.json(success(result))
}

export async function getFlowDefinition(req: Request, res: Response) {
  const result = await flowService.getFlowDefinitionByCode(req.params.code)
  res.json(success(result))
}

export async function getFlowDefinitionByModel(req: Request, res: Response) {
  const result = await flowService.getFlowDefinitionByModelCode(req.params.modelCode)
  res.json(success(result))
}

export async function saveFlowDefinition(req: Request, res: Response) {
  const result = await flowService.saveFlowDefinition(req.body)
  res.json(success(result, '保存成功'))
}

export async function deleteFlowDefinition(req: Request, res: Response) {
  await flowService.deleteFlowDefinition(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function startFlowInstance(req: Request, res: Response) {
  const { flowCode, businessKey } = req.body
  const result = await flowService.startFlowInstance(flowCode, Number(businessKey), (req as AuthRequest).user)
  res.json(success(result, '流程已启动'))
}

export async function getInstanceStatus(req: Request, res: Response) {
  const result = await flowService.getInstanceStatus(Number(req.params.businessKey))
  res.json(success(result))
}

export async function getFlowTrace(req: Request, res: Response) {
  const result = await flowService.getFlowTrace(Number(req.params.businessKey))
  res.json(success(result))
}

export async function getPendingTasks(req: Request, res: Response) {
  const result = await flowService.getPendingTasks((req as AuthRequest).user)
  res.json(success(result))
}

export async function approveTask(req: Request, res: Response) {
  const { comment } = req.body
  await flowService.approveTask(Number(req.params.id), comment || '', (req as AuthRequest).user)
  res.json(success(null, '审批通过'))
}

export async function rejectTask(req: Request, res: Response) {
  const { comment } = req.body
  await flowService.rejectTask(Number(req.params.id), comment || '', (req as AuthRequest).user)
  res.json(success(null, '审批已驳回'))
}
