import type { Request, Response, NextFunction } from 'express'
import * as monitorService from '../modules/monitor/monitor.service'
import type { AuthRequest } from './auth'

/** 敏感字段名（密码、令牌、密钥）不入日志 */
const SENSITIVE_KEY_PATTERN = /password|passwd|secret|token|credential|authorization/i

function sanitizeParams(params: any): any {
  if (!params || typeof params !== 'object') return params
  if (Array.isArray(params)) return params
  const cleaned: Record<string, any> = {}
  for (const [key, value] of Object.entries(params)) {
    cleaned[key] = SENSITIVE_KEY_PATTERN.test(key) ? '******' : value
  }
  return cleaned
}

export function requestLogMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const start = Date.now()
  const originalEnd = res.end.bind(res)

  res.end = function (...args: any[]) {
    originalEnd(...args)
    const duration = Date.now() - start

    // 忽略健康检查与静态资源
    if (req.path === '/health' || req.path.startsWith('/public/')) return

    const logData = {
      userId: req.user?.id,
      username: req.user?.username,
      module: req.path.split('/')[2] || 'unknown',
      action: req.method + ' ' + req.path,
      method: req.method,
      path: req.path,
      params: sanitizeParams(req.method === 'GET' ? req.query : req.body),
      ip: req.ip || 'unknown',
      duration,
      status: res.statusCode < 400 ? 1 : 0
    }

    monitorService.createOperationLog(req, logData).catch(() => {
      // ignore log error
    })

    monitorService.createApiMetric(req, {
      method: logData.method,
      path: logData.path,
      statusCode: res.statusCode,
      duration: logData.duration,
      userId: logData.userId,
      username: logData.username,
      ip: logData.ip,
      params: logData.params
    }).catch(() => {
      // ignore metric error
    })
  } as any

  next()
}
