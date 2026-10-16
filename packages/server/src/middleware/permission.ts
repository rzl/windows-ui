import type { Request, Response, NextFunction } from 'express'
import { error } from '../utils/response'
import { ADMIN_ROLE_ID } from '../utils/id'
import type { AuthRequest } from './auth'

/**
 * 设计时/管理端接口权限校验：
 * - 超级管理员角色（ADMIN_ROLE_ID）或持有 '*' 权限码直接放行
 * - 其他用户必须在角色权限中包含任一指定权限码
 * 权限码约定：<模块>:<操作域>，如 lowcode:design、custom-api:design、plugin:manage
 */
export function requirePermission(...codes: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) {
      return res.status(401).json(error('未提供访问令牌', 401))
    }
    if (user.roleId === ADMIN_ROLE_ID || user.permissions?.includes('*')) {
      return next()
    }
    const permissions = user.permissions || []
    if (codes.some((code) => permissions.includes(code))) {
      return next()
    }
    return res.status(403).json(error('没有执行该操作的权限', 403))
  }
}
