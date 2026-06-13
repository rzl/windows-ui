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

  if (err instanceof AppError) {
    return res.status(200).json(error(err.message, err.code))
  }

  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    return res.status(200).json(error(err.message, 400))
  }

  res.status(200).json(error(err.message || '服务器内部错误', 500))
}
