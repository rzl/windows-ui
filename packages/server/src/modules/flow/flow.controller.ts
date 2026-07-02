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

export async function transferTask(req: Request, res: Response) {
  const { targetUserId } = req.body
  await flowService.transferTask(Number(req.params.id), Number(targetUserId), (req as AuthRequest).user)
  res.json(success(null, '转办成功'))
}

export async function getFlowVersions(req: Request, res: Response) {
  const result = await flowService.getFlowVersions(req.params.code)
  res.json(success(result))
}

export async function rollbackFlowDefinition(req: Request, res: Response) {
  const { version } = req.body
  const result = await flowService.rollbackFlowDefinition(req.params.code, Number(version))
  res.json(success(result, '回滚成功'))
}

export async function getFlowDelegations(req: Request, res: Response) {
  const result = await flowService.getFlowDelegations(req.query)
  res.json(success(result))
}

export async function createFlowDelegation(req: Request, res: Response) {
  const result = await flowService.createFlowDelegation(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateFlowDelegation(req: Request, res: Response) {
  const result = await flowService.updateFlowDelegation(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteFlowDelegation(req: Request, res: Response) {
  await flowService.deleteFlowDelegation(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function checkTimeoutTasks(_req: Request, res: Response) {
  const count = await flowService.checkTimeoutTasks()
  res.json(success({ count }, '检查完成'))
}

export async function getFlowPerformanceByDefinition(req: Request, res: Response) {
  const result = await flowService.getFlowPerformanceByDefinition(req.query)
  res.json(success(result))
}

export async function getFlowPerformanceByNode(req: Request, res: Response) {
  const result = await flowService.getFlowPerformanceByNode(req.query)
  res.json(success(result))
}

export async function urgeTask(req: Request, res: Response) {
  await flowService.urgeTask(Number(req.params.id), (req as AuthRequest).user)
  res.json(success(null, '催办成功'))
}

export async function urgeInstance(req: Request, res: Response) {
  const count = await flowService.urgeInstance(Number(req.params.id), (req as AuthRequest).user)
  res.json(success({ count }, '催办成功'))
}

export async function terminateInstance(req: Request, res: Response) {
  const { reason } = req.body
  await flowService.terminateInstance(Number(req.params.id), reason || '', (req as AuthRequest).user)
  res.json(success(null, '流程已强制终止'))
}
