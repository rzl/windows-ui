import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as pluginService from './plugin.service'

export async function getPlugins(_req: Request, res: Response) {
  const result = await pluginService.getPlugins()
  res.json(success(result))
}

export async function getActivePlugins(_req: Request, res: Response) {
  const result = await pluginService.getActivePlugins()
  res.json(success(result))
}

export async function getPlugin(req: Request, res: Response) {
  const result = await pluginService.getPluginById(Number(req.params.id))
  res.json(success(result))
}

export async function createPlugin(req: Request, res: Response) {
  const result = await pluginService.createPlugin(req.body)
  res.json(success(result, '创建成功'))
}

export async function updatePlugin(req: Request, res: Response) {
  const result = await pluginService.updatePlugin(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deletePlugin(req: Request, res: Response) {
  await pluginService.deletePlugin(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function enablePlugin(req: Request, res: Response) {
  const result = await pluginService.setPluginStatus(Number(req.params.id), 1)
  res.json(success(result, '已启用'))
}

export async function disablePlugin(req: Request, res: Response) {
  const result = await pluginService.setPluginStatus(Number(req.params.id), 0)
  res.json(success(result, '已禁用'))
}
