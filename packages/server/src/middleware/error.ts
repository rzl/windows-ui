import type { Request, Response, NextFunction } from 'express'
import { AppError, error } from '../utils/response'
import { logger } from '../utils/logger'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(err.message, { stack: err.stack })

  // 业务错误：返回真实 HTTP 状态码与业务信息
  if (err instanceof AppError) {
    const code = err.code >= 400 && err.code < 600 ? err.code : 500
    return res.status(code).json(error(err.message, err.code))
  }

  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    return res.status(400).json(error(err.message, 400))
  }

  // multer 错误（文件超限、类型不符等）
  if (err.name === 'MulterError') {
    return res.status(400).json(error(`上传失败: ${err.message}`, 400))
  }

  // 未知错误：详情只写日志，不泄露给客户端（避免暴露 SQL / 内部路径等信息）
  res.status(500).json(error('服务器内部错误', 500))
}
