import { db } from '../../db'
import { createRateLimitStore, type RateLimitStore } from '../../utils/rate-limit-store'
import { tenantWhere, setTenantId } from '../../utils/tenant'
import type { AuthRequest } from '../../middleware/auth'

export interface SecurityConfig {
  rateLimit?: number
  rateLimitWindow?: 'second' | 'minute' | 'hour' | 'day'
  ipWhitelist?: string[]
  ipBlacklist?: string[]
  timeout?: number
}

const WINDOW_SECONDS: Record<string, number> = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 24 * 60 * 60
}

let rateLimitStore: RateLimitStore | null = null

async function getRateLimitStore(): Promise<RateLimitStore> {
  if (!rateLimitStore) {
    rateLimitStore = await createRateLimitStore()
  }
  return rateLimitStore
}

export async function checkRateLimit(apiId: number, identifier: string, limit: number, window: string): Promise<boolean> {
  if (!limit || limit <= 0) return true

  const store = await getRateLimitStore()
  const windowSeconds = WINDOW_SECONDS[window] || WINDOW_SECONDS.minute
  const key = `rate_limit:${apiId}:${identifier}`
  const now = Date.now()
  const record = await store.get(key)

  if (!record || now > record.resetTime) {
    await store.set(key, { count: 1, resetTime: now + windowSeconds * 1000 })
    return true
  }

  if (record.count >= limit) return false
  record.count++
  await store.set(key, record)
  return true
}

export function checkIpAccess(ip: string, whitelist?: string[], blacklist?: string[]): { allowed: boolean; reason?: string } {
  if (blacklist?.length && matchIp(ip, blacklist)) {
    return { allowed: false, reason: 'IP 已被列入黑名单' }
  }
  if (whitelist?.length && !matchIp(ip, whitelist)) {
    return { allowed: false, reason: 'IP 不在白名单内' }
  }
  return { allowed: true }
}

function matchIp(ip: string, list: string[]): boolean {
  return list.some((item) => {
    const trimmed = item.trim()
    if (!trimmed) return false
    if (trimmed.includes('/')) {
      // 简单 CIDR 匹配
      return matchCidr(ip, trimmed)
    }
    return trimmed === ip
  })
}

function matchCidr(ip: string, cidr: string): boolean {
  try {
    const [subnet, prefixStr] = cidr.split('/')
    const prefix = parseInt(prefixStr, 10)
    if (!subnet || isNaN(prefix)) return false

    const ipNum = ipToLong(ip)
    const subnetNum = ipToLong(subnet)
    const mask = -1 << (32 - prefix)
    return (ipNum & mask) === (subnetNum & mask)
  } catch {
    return false
  }
}

function ipToLong(ip: string): number {
  const parts = ip.split('.').map(Number)
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

export function parseIpList(text?: string | string[] | null): string[] {
  if (!text) return []
  if (Array.isArray(text)) return text.map((s) => s.trim()).filter(Boolean)
  if (typeof text === 'string') {
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim()).filter(Boolean)
    } catch {
      // 非 JSON 时按逗号或换行分隔
    }
    return text.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
  }
  return []
}

export async function logExecution(
  req: AuthRequest,
  data: {
    apiId: number
    apiCode: string
    apiPath?: string
    userId?: number
    username?: string
    ip?: string
    method?: string
    params?: any
    response?: any
    duration?: number
    status: 0 | 1
    errorMessage?: string
  }
) {
  const snapshot = data.response ? JSON.stringify(data.response).slice(0, 2000) : null
  return db('custom_api_logs').insert(
    setTenantId(
      {
        api_id: data.apiId,
        api_code: data.apiCode,
        api_path: data.apiPath || data.apiCode,
        user_id: data.userId || null,
        username: data.username || null,
        ip: data.ip || 'unknown',
        method: data.method || 'GET',
        params: data.params ? JSON.stringify(data.params) : null,
        response_snapshot: snapshot,
        duration: data.duration ?? 0,
        status: data.status,
        error_message: data.errorMessage || null,
        create_time: new Date().toISOString()
      },
      req
    )
  )
}

export async function getApiLogs(req: AuthRequest, query: any) {
  const { apiId, status, page = 1, pageSize = 20 } = query
  const builder = db('custom_api_logs').where(tenantWhere(req)).orderBy('id', 'desc')

  if (apiId) builder.where('api_id', Number(apiId))
  if (status !== undefined && status !== '') builder.where('status', Number(status))

  const total = await builder.clone().count({ count: '*' }).first()
  const list = await builder
    .offset((Number(page) - 1) * Number(pageSize))
    .limit(Number(pageSize))

  return {
    list,
    total: Number(total?.count || 0),
    page: Number(page),
    pageSize: Number(pageSize)
  }
}
