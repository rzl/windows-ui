import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as flowService from './flow.service'

export async function getFlowDefinitions(req: AuthRequest, res: Response) {
  const result = await flowService.getFlowDefinitions(req)
  res.json(success(result))
}

export async function getFlowDefinition(req: AuthRequest, res: Response) {
  const result = await flowService.getFlowDefinitionByCode(req, req.params.code)
  res.json(success(result))
}

export async function getFlowDefinitionByModel(req: AuthRequest, res: Response) {
  const result = await flowService.getFlowDefinitionByModelCode(req, req.params.modelCode)
  res.json(success(result))
}

export async function saveFlowDefinition(req: AuthRequest, res: Response) {
  const result = await flowService.saveFlowDefinition(req, req.body)
  res.json(success(result, '保存成功'))
}

export async function deleteFlowDefinition(req: AuthRequest, res: Response) {
  await flowService.deleteFlowDefinition(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function startFlowInstance(req: AuthRequest, res: Response) {
  const { flowCode, businessKey, businessData } = req.body
  const result = await flowService.startFlowInstance(req, flowCode, Number(businessKey), businessData || {}, req.user)
  res.json(success(result, '流程已启动'))
}

export async function getInstanceStatus(req: AuthRequest, res: Response) {
  const result = await flowService.getInstanceStatus(req, Number(req.params.businessKey))
  res.json(success(result))
}

export async function getFlowTrace(req: AuthRequest, res: Response) {
  const result = await flowService.getFlowTrace(req, Number(req.params.businessKey))
  res.json(success(result))
}

export async function getPendingTasks(req: AuthRequest, res: Response) {
  const result = await flowService.getPendingTasks(req, req.user)
  res.json(success(result))
}

export async function approveTask(req: AuthRequest, res: Response) {
  const { comment } = req.body
  await flowService.approveTask(req, Number(req.params.id), comment || '', req.user)
  res.json(success(null, '审批通过'))
}

export async function rejectTask(req: AuthRequest, res: Response) {
  const { comment } = req.body
  await flowService.rejectTask(req, Number(req.params.id), comment || '', req.user)
  res.json(success(null, '审批已驳回'))
}

export async function transferTask(req: AuthRequest, res: Response) {
  const { targetUserId } = req.body
  await flowService.transferTask(req, Number(req.params.id), Number(targetUserId), req.user)
  res.json(success(null, '转办成功'))
}

export async function getFlowVersions(req: AuthRequest, res: Response) {
  const result = await flowService.getFlowVersions(req, req.params.code)
  res.json(success(result))
}

export async function rollbackFlowDefinition(req: AuthRequest, res: Response) {
  const { version } = req.body
  const result = await flowService.rollbackFlowDefinition(req, req.params.code, Number(version))
  res.json(success(result, '回滚成功'))
}

export async function getFlowDelegations(req: AuthRequest, res: Response) {
  const result = await flowService.getFlowDelegations(req, req.query)
  res.json(success(result))
}

export async function createFlowDelegation(req: AuthRequest, res: Response) {
  const result = await flowService.createFlowDelegation(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateFlowDelegation(req: AuthRequest, res: Response) {
  const result = await flowService.updateFlowDelegation(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteFlowDelegation(req: AuthRequest, res: Response) {
  await flowService.deleteFlowDelegation(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function checkTimeoutTasks(req: AuthRequest, res: Response) {
  const count = await flowService.checkTimeoutTasks(req)
  res.json(success({ count }, '检查完成'))
}

export async function getFlowPerformanceByDefinition(req: AuthRequest, res: Response) {
  const result = await flowService.getFlowPerformanceByDefinition(req, req.query)
  res.json(success(result))
}

export async function getFlowPerformanceByNode(req: AuthRequest, res: Response) {
  const result = await flowService.getFlowPerformanceByNode(req, req.query)
  res.json(success(result))
}

export async function urgeTask(req: AuthRequest, res: Response) {
  await flowService.urgeTask(req, Number(req.params.id), req.user)
  res.json(success(null, '催办成功'))
}

export async function urgeInstance(req: AuthRequest, res: Response) {
  const count = await flowService.urgeInstance(req, Number(req.params.id), req.user)
  res.json(success({ count }, '催办成功'))
}

export async function terminateInstance(req: AuthRequest, res: Response) {
  const { reason } = req.body
  await flowService.terminateInstance(req, Number(req.params.id), reason || '', req.user)
  res.json(success(null, '流程已强制终止'))
}
