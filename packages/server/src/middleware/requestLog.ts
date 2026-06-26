import type { Request, Response, NextFunction } from 'express'
import * as monitorService from '../modules/monitor/monitor.service'
import type { AuthRequest } from './auth'

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
      params: req.method === 'GET' ? req.query : req.body,
      ip: req.ip || 'unknown',
      duration,
      status: res.statusCode < 400 ? 1 : 0
    }

    monitorService.createOperationLog(logData).catch(() => {
      // ignore log error
    })

    monitorService.createApiMetric({
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
