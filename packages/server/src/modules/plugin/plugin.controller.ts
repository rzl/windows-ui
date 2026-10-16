import type { Response } from 'express'
import type { AuthRequest } from '../../middleware/auth'
import { success } from '../../utils/response'
import * as pluginService from './plugin.service'

export async function getPlugins(req: AuthRequest, res: Response) {
  const result = await pluginService.getPlugins(req)
  res.json(success(result))
}

export async function getActivePlugins(req: AuthRequest, res: Response) {
  const result = await pluginService.getActivePlugins(req)
  // 未登录请求只返回插件元信息，不暴露运行时脚本源码
  if (!req.user) {
    const sanitized = (Array.isArray(result) ? result : []).map((plugin: any) => {
      const { runtime_code, runtime_url, ...meta } = plugin
      return meta
    })
    res.json(success(sanitized))
    return
  }
  res.json(success(result))
}

export async function getPlugin(req: AuthRequest, res: Response) {
  const result = await pluginService.getPluginById(req, req.params.id)
  res.json(success(result))
}

export async function createPlugin(req: AuthRequest, res: Response) {
  const result = await pluginService.createPlugin(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updatePlugin(req: AuthRequest, res: Response) {
  const result = await pluginService.updatePlugin(req, req.params.id, req.body)
  res.json(success(result, '更新成功'))
}

export async function deletePlugin(req: AuthRequest, res: Response) {
  await pluginService.deletePlugin(req, req.params.id)
  res.json(success(null, '删除成功'))
}

export async function enablePlugin(req: AuthRequest, res: Response) {
  const result = await pluginService.setPluginStatus(req, req.params.id, 1)
  res.json(success(result, '已启用'))
}

export async function disablePlugin(req: AuthRequest, res: Response) {
  const result = await pluginService.setPluginStatus(req, req.params.id, 0)
  res.json(success(result, '已禁用'))
}
