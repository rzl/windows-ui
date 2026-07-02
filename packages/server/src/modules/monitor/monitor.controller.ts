import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as monitorService from './monitor.service'
import * as alertService from './alert.service'
import * as dataGovernanceService from './data-governance.service'

// 消息模板
export async function getMessageTemplates(req: AuthRequest, res: Response) {
  const result = await monitorService.getMessageTemplates(req)
  res.json(success(result))
}

export async function createMessageTemplate(req: AuthRequest, res: Response) {
  const result = await monitorService.createMessageTemplate(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateMessageTemplate(req: AuthRequest, res: Response) {
  const result = await monitorService.updateMessageTemplate(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteMessageTemplate(req: AuthRequest, res: Response) {
  await monitorService.deleteMessageTemplate(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 消息
export async function getMessages(req: AuthRequest, res: Response) {
  const result = await monitorService.getMessages(req, req.query)
  res.json(success(result))
}

export async function createMessage(req: AuthRequest, res: Response) {
  const result = await monitorService.createMessage(req, req.body)
  res.json(success(result, '发送成功'))
}

export async function markMessageRead(req: AuthRequest, res: Response) {
  const result = await monitorService.markMessageRead(req, Number(req.params.id))
  res.json(success(result))
}

export async function readAllMessages(req: AuthRequest, res: Response) {
  await monitorService.readAllMessages(req, Number(req.user?.id))
  res.json(success(null, '全部已读'))
}

export async function markMessageReadByBusinessKey(req: AuthRequest, res: Response) {
  await monitorService.markMessageReadByBusinessKey(
    req,
    req.params.businessType,
    req.params.businessKey,
    Number(req.user?.id)
  )
  res.json(success(null, '已标为已读'))
}

export async function deleteMessage(req: AuthRequest, res: Response) {
  await monitorService.deleteMessage(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function getUnreadCount(req: AuthRequest, res: Response) {
  const result = await monitorService.getUnreadCount(req, Number(req.query.receiverId))
  res.json(success(result))
}

// 操作日志
export async function getOperationLogs(req: AuthRequest, res: Response) {
  const result = await monitorService.getOperationLogs(req, req.query)
  res.json(success(result))
}

// 数据日志
export async function getDataLogs(req: AuthRequest, res: Response) {
  const result = await monitorService.getDataLogs(req, req.query)
  res.json(success(result))
}

// API 性能指标
export async function getApiMetrics(req: AuthRequest, res: Response) {
  const result = await monitorService.getApiMetrics(req, req.query)
  res.json(success(result))
}

export async function getApiPerformanceStats(req: AuthRequest, res: Response) {
  const result = await monitorService.getApiPerformanceStats(req, req.query)
  res.json(success(result))
}

export async function getApiTrend(req: AuthRequest, res: Response) {
  const result = await monitorService.getApiTrend(req, req.query)
  res.json(success(result))
}

// 慢 SQL
export async function getSlowSqls(req: AuthRequest, res: Response) {
  const result = await monitorService.getSlowSqls(req, req.query)
  res.json(success(result))
}

export async function getSqlPerformanceStats(req: AuthRequest, res: Response) {
  const result = await monitorService.getSqlPerformanceStats(req, req.query)
  res.json(success(result))
}

// 服务器信息
export function getServerInfo(_req: Request, res: Response) {
  res.json(success(monitorService.getServerInfo()))
}

// 在线用户
export async function getOnlineUsers(req: AuthRequest, res: Response) {
  const result = await monitorService.getOnlineUsers(req)
  res.json(success(result))
}

// ---------- 告警规则 ----------

export async function getAlertRules(req: AuthRequest, res: Response) {
  const result = await alertService.getAlertRules(req, req.query)
  res.json(success(result))
}

export async function createAlertRule(req: AuthRequest, res: Response) {
  const result = await alertService.createAlertRule(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateAlertRule(req: AuthRequest, res: Response) {
  const result = await alertService.updateAlertRule(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteAlertRule(req: AuthRequest, res: Response) {
  await alertService.deleteAlertRule(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// ---------- 告警记录 ----------

export async function getAlertRecords(req: AuthRequest, res: Response) {
  const result = await alertService.getAlertRecords(req, req.query)
  res.json(success(result))
}

export async function markAlertRecordRead(req: AuthRequest, res: Response) {
  const result = await alertService.markAlertRecordRead(req, Number(req.params.id))
  res.json(success(result))
}

export async function resolveAlertRecord(req: AuthRequest, res: Response) {
  const result = await alertService.resolveAlertRecord(req, Number(req.params.id))
  res.json(success(result))
}

export async function getUnreadAlertCount(req: AuthRequest, res: Response) {
  const result = await alertService.getUnreadAlertCount(req)
  res.json(success(result))
}

export async function checkAlerts(req: AuthRequest, res: Response) {
  const result = await alertService.checkAlerts(req)
  res.json(success(result))
}

// ---------- 数据治理 ----------

export async function getRetentionPolicies(req: AuthRequest, res: Response) {
  const result = await dataGovernanceService.getRetentionPolicies(req)
  res.json(success(result))
}

export async function updateRetentionPolicy(req: AuthRequest, res: Response) {
  const result = await dataGovernanceService.updateRetentionPolicy(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function runCleanup(req: AuthRequest, res: Response) {
  const total = await dataGovernanceService.runCleanup(req)
  const customApiTotal = await dataGovernanceService.cleanupCustomApiLogs(req)
  res.json(success({ total, customApiTotal }, '清理完成'))
}
