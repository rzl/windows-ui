import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { error } from '../utils/response'

// 内存 token 黑名单（生产环境建议 Redis）
export const tokenBlacklist = new Set<string>()

export interface AuthRequest extends Request {
  user?: {
    id: number
    username: string
    roleId: number
  }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(200).json(error('未提供访问令牌', 401))
  }

  const token = authHeader.substring(7)

  if (tokenBlacklist.has(token)) {
    return res.status(200).json(error('令牌已失效', 401))
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret as jwt.Secret) as AuthRequest['user']
    req.user = decoded
    next()
  } catch (err) {
    return res.status(200).json(error('令牌无效或已过期', 401))
  }
}

export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    if (!tokenBlacklist.has(token)) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret as jwt.Secret) as AuthRequest['user']
        req.user = decoded
      } catch {
        // ignore invalid token
      }
    }
  }
  next()
}
