import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { error, AppError } from '../utils/response'
import { getProfile } from '../modules/auth/auth.service'

// 内存 token 黑名单（生产环境建议 Redis）
export const tokenBlacklist = new Set<string>()

export interface AuthRequest extends Request {
  user?: {
    id: number
    username: string
    roleId: number
    tenantId: number
    deptId?: number
    permissions?: string[]
  }
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // 仪表盘服务内部调用放行（仅限本机）
  const clientIp = req.ip || req.socket.remoteAddress || ''
  if (req.headers['x-dashboard-service'] && (clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.includes('127.0.0.1'))) {
    return next()
  }

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
    if (!decoded?.id) {
      return res.status(200).json(error('令牌无效或已过期', 401))
    }
    const profile = await getProfile(decoded.id)
    req.user = {
      id: profile.id,
      username: profile.username,
      roleId: profile.roleId,
      tenantId: decoded.tenantId || profile.tenantId || 0,
      deptId: profile.deptId,
      permissions: profile.permissions || []
    }
    next()
  } catch (err) {
    // 仅 JWT 验证失败返回 401，业务错误（如用户不存在、数据库查询失败）透传给错误处理中间件
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError || err instanceof jwt.NotBeforeError) {
      return res.status(200).json(error('令牌无效或已过期', 401))
    }
    if (err instanceof AppError) {
      return next(err)
    }
    return next(err)
  }
}

export async function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    if (!tokenBlacklist.has(token)) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret as jwt.Secret) as AuthRequest['user']
        if (!decoded?.id) {
          next()
          return
        }
        const profile = await getProfile(decoded.id)
        req.user = {
          id: profile.id,
          username: profile.username,
          roleId: profile.roleId,
          tenantId: decoded.tenantId || profile.tenantId || 0,
          deptId: profile.deptId,
          permissions: profile.permissions || []
        }
      } catch {
        // ignore invalid token
      }
    }
  }
  next()
}
