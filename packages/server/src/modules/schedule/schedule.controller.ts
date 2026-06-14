import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as scheduleService from './schedule.service'
import * as scheduler from './scheduler'

export async function getScheduledTasks(_req: Request, res: Response) {
  const result = await scheduleService.getScheduledTasks()
  res.json(success(result))
}

export async function getScheduledTask(req: Request, res: Response) {
  const result = await scheduleService.getScheduledTaskById(Number(req.params.id))
  res.json(success(result))
}

export async function saveScheduledTask(req: Request, res: Response) {
  const result = await scheduleService.saveScheduledTask(req.body)
  if (result?.id && result.status === 1) {
    await scheduler.reloadTask(result.id)
  }
  res.json(success(result, '保存成功'))
}

export async function deleteScheduledTask(req: Request, res: Response) {
  const id = Number(req.params.id)
  await scheduleService.deleteScheduledTask(id)
  await scheduler.reloadTask(id)
  res.json(success(null, '删除成功'))
}

export async function getTaskLogs(req: Request, res: Response) {
  const result = await scheduleService.getTaskLogs(Number(req.params.id))
  res.json(success(result))
}

export async function runTask(req: Request, res: Response) {
  const task = await scheduleService.getScheduledTaskById(Number(req.params.id))
  const result = await scheduleService.executeTask(task)
  res.json(success(result, '执行完成'))
}
