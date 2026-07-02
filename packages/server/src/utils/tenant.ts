import type { AuthRequest } from '../middleware/auth'

export const SUPER_ADMIN_ROLE_ID = 1
export const GLOBAL_TENANT_ID = 0

/**
 * 判断当前用户是否为超级管理员
 */
export function isSuperAdmin(user?: AuthRequest['user']): boolean {
  if (!user) return false
  return user.roleId === SUPER_ADMIN_ROLE_ID || user.tenantId === GLOBAL_TENANT_ID
}

/**
 * 获取当前请求应隔离的租户 ID。
 * 超级管理员返回 null，表示不过滤租户。
 */
export function getTenantId(req: AuthRequest): number | null {
  const user = req.user
  if (!user) return null
  if (isSuperAdmin(user)) return null
  return user.tenantId ?? null
}

/**
 * 生成租户过滤条件对象
 */
export function tenantWhere(req: AuthRequest): { tenant_id: number } | Record<string, never> {
  const tenantId = getTenantId(req)
  if (tenantId === null) return {}
  return { tenant_id: tenantId }
}

/**
 * 为写入数据自动设置 tenant_id
 */
export function setTenantId<T extends Record<string, any>>(data: T, req: AuthRequest): T {
  const tenantId = getTenantId(req)
  if (tenantId === null) return data
  return { ...data, tenant_id: tenantId }
}

/**
 * 合并租户过滤条件到现有 where 对象
 */
export function withTenantWhere<T extends Record<string, any>>(req: AuthRequest, where: T): T & { tenant_id?: number } {
  const tw = tenantWhere(req)
  return { ...where, ...tw }
}
