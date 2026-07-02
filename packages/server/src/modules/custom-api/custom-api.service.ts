import { db } from '../../db'
import { AppError } from '../../utils/response'
import { runScript } from '../../utils/script-runner'
import { tenantWhere, setTenantId } from '../../utils/tenant'
import type { AuthRequest } from '../../middleware/auth'
import * as securityService from './custom-api-security.service'

export interface CustomApiForm {
  id?: number
  code?: string
  name?: string
  method?: string
  path?: string
  description?: string
  script?: string
  status?: number
  isPublic?: number
  rateLimit?: number
  rateLimitWindow?: string
  ipWhitelist?: string | string[]
  ipBlacklist?: string | string[]
  timeout?: number
  logRetentionDays?: number
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

export async function getCustomApis(req: AuthRequest) {
  return db('lowcode_custom_apis').where(tenantWhere(req)).orderBy('id', 'desc')
}

export async function getCustomApiById(req: AuthRequest, id: number) {
  const api = await db('lowcode_custom_apis').where({ id }).where(tenantWhere(req)).first()
  if (!api) throw new AppError('接口不存在', 404)
  return api
}

export async function getCustomApiByCode(req: AuthRequest, code: string) {
  return db('lowcode_custom_apis').where({ code }).where(tenantWhere(req)).first()
}

export async function createCustomApi(req: AuthRequest, data: CustomApiForm) {
  const code = safeCode(data.code || '')
  if (!code) throw new AppError('接口编码不能为空', 400)

  const exists = await db('lowcode_custom_apis').where({ code }).where(tenantWhere(req)).first()
  if (exists) throw new AppError('接口编码已存在', 400)

  const path = data.path ? data.path.trim() : code

  const [id] = await db('lowcode_custom_apis').insert(
    setTenantId(
      {
        code,
        name: data.name || code,
        method: (data.method || 'ALL').toUpperCase(),
        path,
        description: data.description || '',
        script: data.script || '',
        status: data.status ?? 1,
        is_public: data.isPublic ?? 0,
        rate_limit: data.rateLimit ?? 0,
        rate_limit_window: data.rateLimitWindow || 'minute',
        ip_whitelist: data.ipWhitelist ? JSON.stringify(securityService.parseIpList(data.ipWhitelist)) : null,
        ip_blacklist: data.ipBlacklist ? JSON.stringify(securityService.parseIpList(data.ipBlacklist)) : null,
        timeout: data.timeout ?? 5000,
        log_retention_days: data.logRetentionDays ?? 30
      },
      req
    )
  )
  return getCustomApiById(req, id)
}

export async function updateCustomApi(req: AuthRequest, id: number, data: CustomApiForm) {
  const api = await getCustomApiById(req, id)
  const path = data.path ? data.path.trim() : api.path

  await db('lowcode_custom_apis')
    .where({ id })
    .where(tenantWhere(req))
    .update({
      name: data.name ?? api.name,
      method: (data.method || api.method).toUpperCase(),
      path,
      description: data.description ?? api.description,
      script: data.script ?? api.script,
      status: data.status ?? api.status,
      is_public: data.isPublic ?? api.is_public,
      rate_limit: data.rateLimit ?? api.rate_limit ?? 0,
      rate_limit_window: data.rateLimitWindow || api.rate_limit_window || 'minute',
      ip_whitelist: data.ipWhitelist !== undefined
        ? (data.ipWhitelist ? JSON.stringify(securityService.parseIpList(data.ipWhitelist)) : null)
        : api.ip_whitelist,
      ip_blacklist: data.ipBlacklist !== undefined
        ? (data.ipBlacklist ? JSON.stringify(securityService.parseIpList(data.ipBlacklist)) : null)
        : api.ip_blacklist,
      timeout: data.timeout ?? api.timeout ?? 5000,
      log_retention_days: data.logRetentionDays ?? api.log_retention_days ?? 30,
      update_time: db.fn.now()
    })
  return getCustomApiById(req, id)
}

export async function deleteCustomApi(req: AuthRequest, id: number) {
  const api = await getCustomApiById(req, id)
  await db('lowcode_custom_apis').where({ id }).where(tenantWhere(req)).del()
  return api
}

export async function executeApiById(req: AuthRequest, id: number, ctx: any = {}) {
  const api = await getCustomApiById(req, id)
  if (api.status !== 1) throw new AppError('接口已禁用', 403)
  const timeout = api.timeout ?? 5000
  return runScript(api.script, { ctx }, timeout)
}

export async function executeApiByPath(req: AuthRequest, path: string, ctx: any = {}) {
  const api = await db('lowcode_custom_apis')
    .where(function () {
      this.where({ path }).orWhere({ code: path })
    })
    .where(tenantWhere(req))
    .andWhere('status', 1)
    .first()

  if (!api) throw new AppError('接口不存在或已禁用', 404)

  // 校验请求方法
  const method = (ctx.method || 'GET').toUpperCase()
  const apiMethod = (api.method || 'ALL').toUpperCase()
  if (apiMethod !== 'ALL' && apiMethod !== method) {
    throw new AppError(`请求方法不匹配，只允许 ${apiMethod}`, 405)
  }

  // IP 访问控制
  const ip = ctx.ip || 'unknown'
  const whitelist = securityService.parseIpList(api.ip_whitelist)
  const blacklist = securityService.parseIpList(api.ip_blacklist)
  const ipCheck = securityService.checkIpAccess(ip, whitelist, blacklist)
  if (!ipCheck.allowed) {
    throw new AppError(ipCheck.reason || 'IP 访问受限', 403)
  }

  // 频率限制（按 IP + 用户维度）
  const rateLimit = api.rate_limit ?? 0
  const rateLimitWindow = api.rate_limit_window || 'minute'
  const rateLimitKey = ctx.user?.id ? `user:${ctx.user.id}` : `ip:${ip}`
  const allowed = await securityService.checkRateLimit(api.id, rateLimitKey, rateLimit, rateLimitWindow)
  if (!allowed) {
    throw new AppError('请求过于频繁，请稍后重试', 429)
  }

  const start = Date.now()
  const timeout = api.timeout ?? 5000

  try {
    const result = await runScript(api.script, { ctx }, timeout)
    await securityService.logExecution(req, {
      apiId: api.id,
      apiCode: api.code,
      apiPath: api.path,
      userId: ctx.user?.id,
      username: ctx.user?.username,
      ip: ctx.ip,
      method,
      params: { params: ctx.params, query: ctx.query, body: ctx.body },
      response: result,
      duration: Date.now() - start,
      status: 1
    })
    return result
  } catch (err: any) {
    await securityService.logExecution(req, {
      apiId: api.id,
      apiCode: api.code,
      apiPath: api.path,
      userId: ctx.user?.id,
      username: ctx.user?.username,
      ip: ctx.ip,
      method,
      params: { params: ctx.params, query: ctx.query, body: ctx.body },
      duration: Date.now() - start,
      status: 0,
      errorMessage: err.message
    })
    throw err
  }
}

export async function getCustomApiByPath(req: AuthRequest, path: string) {
  return db('lowcode_custom_apis')
    .where(function () {
      this.where({ path }).orWhere({ code: path })
    })
    .where(tenantWhere(req))
    .first()
}
