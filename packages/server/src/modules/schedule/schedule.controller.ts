import type { Response } from 'express'
import type { AuthRequest } from '../../middleware/auth'
import { success } from '../../utils/response'
import * as scheduleService from './schedule.service'
import * as scheduler from './scheduler'

export async function getScheduledTasks(req: AuthRequest, res: Response) {
  const result = await scheduleService.getScheduledTasks(req)
  res.json(success(result))
}

export async function getScheduledTask(req: AuthRequest, res: Response) {
  const result = await scheduleService.getScheduledTaskById(req, Number(req.params.id))
  res.json(success(result))
}

export async function saveScheduledTask(req: AuthRequest, res: Response) {
  const result = await scheduleService.saveScheduledTask(req, req.body)
  if (result?.id && result.status === 1) {
    await scheduler.reloadTask(result.id)
  }
  res.json(success(result, '保存成功'))
}

export async function deleteScheduledTask(req: AuthRequest, res: Response) {
  const id = Number(req.params.id)
  await scheduleService.deleteScheduledTask(req, id)
  await scheduler.reloadTask(id)
  res.json(success(null, '删除成功'))
}

export async function getTaskLogs(req: AuthRequest, res: Response) {
  const result = await scheduleService.getTaskLogs(req, Number(req.params.id))
  res.json(success(result))
}

export async function runTask(req: AuthRequest, res: Response) {
  const task = await scheduleService.getScheduledTaskById(req, Number(req.params.id))
  const result = await scheduleService.executeTask(task)
  res.json(success(result, '执行完成'))
}
