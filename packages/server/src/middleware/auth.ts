import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { config } from '../config'
import { error, AppError } from '../utils/response'
import { getProfile } from '../modules/auth/auth.service'

/**
 * 内存 token 黑名单（带过期时间，自动清理）
 * 重启即失效的固有限制仍在；生产多实例部署建议切换 Redis（config.redis.url 已预留）
 */
const blacklist = new Map<string, number>()
const BLACKLIST_MAX = 10000

function pruneBlacklist() {
  const now = Date.now()
  for (const [token, expiresAt] of blacklist) {
    if (expiresAt <= now) blacklist.delete(token)
  }
}

export const tokenBlacklist = {
  add(token: string, expiresAt: number) {
    if (blacklist.size >= BLACKLIST_MAX) pruneBlacklist()
    blacklist.set(token, expiresAt)
  },
  has(token: string): boolean {
    const expiresAt = blacklist.get(token)
    if (expiresAt === undefined) return false
    if (expiresAt <= Date.now()) {
      blacklist.delete(token)
      return false
    }
    return true
  }
}

/** 判断请求是否来自本机回环地址 */
function isLoopback(ip: string): boolean {
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1'
}

/** 定时常数比较，避免时序攻击 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * 内部服务调用鉴权：携带正确共享密钥且来源为本机才放行。
 * 密钥默认每次启动随机生成，仅进程内代码（脚本沙箱、仪表盘数据源）持有。
 */
export function isInternalRequest(req: Request): boolean {
  const token = req.headers['x-internal-token']
  if (typeof token !== 'string' || !token) return false
  const clientIp = req.ip || req.socket.remoteAddress || ''
  return isLoopback(clientIp) && safeEqual(token, config.internalSecret)
}

export interface AuthRequest extends Request {
  user?: {
    id: string
    username: string
    roleId: string
    tenantId: string
    deptId?: string
    permissions?: string[]
  }
}

function unauthorized(res: Response, message: string) {
  return res.status(401).json(error(message, 401))
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // 内部服务调用（脚本沙箱 / 仪表盘数据源）凭共享密钥放行
  if (isInternalRequest(req)) {
    return next()
  }

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, '未提供访问令牌')
  }

  const token = authHeader.substring(7)

  if (tokenBlacklist.has(token)) {
    return unauthorized(res, '令牌已失效')
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret as jwt.Secret) as AuthRequest['user'] & { tokenType?: string }
    if (!decoded?.id) {
      return unauthorized(res, '令牌无效或已过期')
    }
    // refresh 令牌不允许当访问令牌使用
    if (decoded.tokenType && decoded.tokenType !== 'access') {
      return unauthorized(res, '请使用访问令牌')
    }
    const profile = await getProfile(decoded.id)
    req.user = {
      id: profile.id,
      username: profile.username,
      roleId: profile.roleId,
      tenantId: decoded.tenantId || profile.tenantId || '',
      deptId: profile.deptId,
      permissions: profile.permissions || []
    }
    next()
  } catch (err) {
    // 仅 JWT 验证失败返回 401，业务错误（如用户不存在、数据库查询失败）透传给错误处理中间件
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError || err instanceof jwt.NotBeforeError) {
      return unauthorized(res, '令牌无效或已过期')
    }
    next(err)
  }
}

export async function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    if (!tokenBlacklist.has(token)) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret as jwt.Secret) as AuthRequest['user'] & { tokenType?: string }
        if (decoded?.id && (!decoded.tokenType || decoded.tokenType === 'access')) {
          const profile = await getProfile(decoded.id)
          req.user = {
            id: profile.id,
            username: profile.username,
            roleId: profile.roleId,
            tenantId: decoded.tenantId || profile.tenantId || '',
            deptId: profile.deptId,
            permissions: profile.permissions || []
          }
        }
      } catch {
        // ignore invalid token
      }
    }
  }
  next()
}
