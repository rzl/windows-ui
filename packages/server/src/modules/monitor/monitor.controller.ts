import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as monitorService from './monitor.service'

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

// 服务器信息
export function getServerInfo(_req: Request, res: Response) {
  res.json(success(monitorService.getServerInfo()))
}

// 在线用户
export async function getOnlineUsers(_req: Request, res: Response) {
  const result = await monitorService.getOnlineUsers()
  res.json(success(result))
}
