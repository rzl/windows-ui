import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as monitorService from './monitor.service'
import * as alertService from './alert.service'
import * as dataGovernanceService from './data-governance.service'

// 消息模板
export async function getMessageTemplates(_req: Request, res: Response) {
  const result = await monitorService.getMessageTemplates()
  res.json(success(result))
}

export async function createMessageTemplate(req: Request, res: Response) {
  const result = await monitorService.createMessageTemplate(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateMessageTemplate(req: Request, res: Response) {
  const result = await monitorService.updateMessageTemplate(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteMessageTemplate(req: Request, res: Response) {
  await monitorService.deleteMessageTemplate(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 消息
export async function getMessages(req: Request, res: Response) {
  const result = await monitorService.getMessages(req.query)
  res.json(success(result))
}

export async function createMessage(req: Request, res: Response) {
  const result = await monitorService.createMessage(req.body)
  res.json(success(result, '发送成功'))
}

export async function markMessageRead(req: Request, res: Response) {
  const result = await monitorService.markMessageRead(Number(req.params.id))
  res.json(success(result))
}

export async function readAllMessages(req: AuthRequest, res: Response) {
  await monitorService.readAllMessages(Number(req.user?.id))
  res.json(success(null, '全部已读'))
}

export async function markMessageReadByBusinessKey(req: AuthRequest, res: Response) {
  await monitorService.markMessageReadByBusinessKey(
    req.params.businessType,
    req.params.businessKey,
    Number(req.user?.id)
  )
  res.json(success(null, '已标为已读'))
}

export async function deleteMessage(req: Request, res: Response) {
  await monitorService.deleteMessage(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function getUnreadCount(req: Request, res: Response) {
  const result = await monitorService.getUnreadCount(Number(req.query.receiverId))
  res.json(success(result))
}

// 操作日志
export async function getOperationLogs(req: Request, res: Response) {
  const result = await monitorService.getOperationLogs(req.query)
  res.json(success(result))
}

// 数据日志
export async function getDataLogs(req: Request, res: Response) {
  const result = await monitorService.getDataLogs(req.query)
  res.json(success(result))
}

// API 性能指标
export async function getApiMetrics(req: Request, res: Response) {
  const result = await monitorService.getApiMetrics(req.query)
  res.json(success(result))
}

export async function getApiPerformanceStats(req: Request, res: Response) {
  const result = await monitorService.getApiPerformanceStats(req.query)
  res.json(success(result))
}

export async function getApiTrend(req: Request, res: Response) {
  const result = await monitorService.getApiTrend(req.query)
  res.json(success(result))
}

// 慢 SQL
export async function getSlowSqls(req: Request, res: Response) {
  const result = await monitorService.getSlowSqls(req.query)
  res.json(success(result))
}

export async function getSqlPerformanceStats(req: Request, res: Response) {
  const result = await monitorService.getSqlPerformanceStats(req.query)
  res.json(success(result))
}

// 服务器信息
export function getServerInfo(_req: Request, res: Response) {
  res.json(success(monitorService.getServerInfo()))
}

// 在线用户
export async function getOnlineUsers(_req: Request, res: Response) {
  const result = await monitorService.getOnlineUsers()
  res.json(success(result))
}

// ---------- 告警规则 ----------

export async function getAlertRules(req: Request, res: Response) {
  const result = await alertService.getAlertRules(req.query)
  res.json(success(result))
}

export async function createAlertRule(req: Request, res: Response) {
  const result = await alertService.createAlertRule(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateAlertRule(req: Request, res: Response) {
  const result = await alertService.updateAlertRule(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteAlertRule(req: Request, res: Response) {
  await alertService.deleteAlertRule(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// ---------- 告警记录 ----------

export async function getAlertRecords(req: Request, res: Response) {
  const result = await alertService.getAlertRecords(req.query)
  res.json(success(result))
}

export async function markAlertRecordRead(req: Request, res: Response) {
  const result = await alertService.markAlertRecordRead(Number(req.params.id))
  res.json(success(result))
}

export async function resolveAlertRecord(req: Request, res: Response) {
  const result = await alertService.resolveAlertRecord(Number(req.params.id))
  res.json(success(result))
}

export async function getUnreadAlertCount(_req: Request, res: Response) {
  const result = await alertService.getUnreadAlertCount()
  res.json(success(result))
}

export async function checkAlerts(_req: Request, res: Response) {
  const result = await alertService.checkAlerts()
  res.json(success(result))
}

// ---------- 数据治理 ----------

export async function getRetentionPolicies(_req: Request, res: Response) {
  const result = await dataGovernanceService.getRetentionPolicies()
  res.json(success(result))
}

export async function updateRetentionPolicy(req: Request, res: Response) {
  const result = await dataGovernanceService.updateRetentionPolicy(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function runCleanup(_req: Request, res: Response) {
  const total = await dataGovernanceService.runCleanup()
  const customApiTotal = await dataGovernanceService.cleanupCustomApiLogs()
  res.json(success({ total, customApiTotal }, '清理完成'))
}
