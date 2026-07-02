import type { Request, Response } from 'express'
import { success, error } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as customApiService from './custom-api.service'
import * as securityService from './custom-api-security.service'

export async function getCustomApis(req: AuthRequest, res: Response) {
  const result = await customApiService.getCustomApis(req)
  res.json(success(result))
}

export async function getCustomApi(req: AuthRequest, res: Response) {
  const result = await customApiService.getCustomApiById(req, Number(req.params.id))
  res.json(success(result))
}

export async function createCustomApi(req: AuthRequest, res: Response) {
  const result = await customApiService.createCustomApi(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateCustomApi(req: AuthRequest, res: Response) {
  const result = await customApiService.updateCustomApi(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteCustomApi(req: AuthRequest, res: Response) {
  await customApiService.deleteCustomApi(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function testCustomApi(req: AuthRequest, res: Response) {
  const ctx = buildContext(req)
  const result = await customApiService.executeApiById(req, Number(req.params.id), ctx)
  res.json(success(result))
}

export async function getApiLogs(req: AuthRequest, res: Response) {
  const result = await securityService.getApiLogs(req, req.query)
  res.json(success(result))
}

export async function executeCustomApi(req: Request, res: Response) {
  const path = (req.params[0] || '').replace(/^\//, '')
  const authReq = req as AuthRequest

  try {
    const api = await customApiService.getCustomApiByPath(authReq, path)
    if (!api) {
      return res.status(404).json(error('接口不存在或已禁用', 404))
    }

    // 非公开接口需要登录用户
    if (!api.is_public && !authReq.user?.id) {
      return res.status(401).json(error('该接口需要登录后访问', 401))
    }

    const ctx = buildContext(req)
    const result = await customApiService.executeApiByPath(authReq, path, ctx)
    res.json(result)
  } catch (err: any) {
    const message = err instanceof Error ? err.message : '接口执行失败'
    const code = err instanceof Error && (err as any).status ? (err as any).status : 400
    res.status(typeof code === 'number' ? code : 400).json(error(message, code))
  }
}

function buildContext(req: Request) {
  return {
    params: req.params,
    query: req.query,
    body: req.body,
    headers: req.headers,
    method: req.method,
    ip: req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown',
    user: (req as AuthRequest).user
  }
}
