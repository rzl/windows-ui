import { db } from '../../db'
import type { AuthRequest } from '../../middleware/auth'
import { tenantWhere, setTenantId } from '../../utils/tenant'

export interface AuditLog {
  id?: number
  model_code: string
  record_id: number
  action: 'create' | 'update' | 'delete'
  operator_id?: number | null
  operator_name?: string | null
  before?: string | null
  after?: string | null
  diff?: string | null
  ip?: string | null
  create_time?: string | Date
}

export interface AuditContext {
  modelCode: string
  recordId: number
  action: 'create' | 'update' | 'delete'
  before?: any
  after?: any
  user?: any
  req?: any
}

function getClientIp(req?: any): string | null {
  if (!req) return null
  const forwarded = req.headers?.['x-forwarded-for']
  if (forwarded) return String(forwarded).split(',')[0].trim()
  return req.socket?.remoteAddress || req.connection?.remoteAddress || null
}

function computeDiff(before: any, after: any): Record<string, { before: any; after: any }> | null {
  if (!before && !after) return null
  const b = before || {}
  const a = after || {}
  const keys = new Set([...Object.keys(b), ...Object.keys(a)])
  const diff: Record<string, { before: any; after: any }> = {}
  let changed = false
  for (const key of keys) {
    if (key === 'id' || key.startsWith('__')) continue
    const bv = b[key]
    const av = a[key]
    if (JSON.stringify(bv) !== JSON.stringify(av)) {
      diff[key] = { before: bv, after: av }
      changed = true
    }
  }
  return changed ? diff : null
}

export async function isAuditEnabled(modelCode: string): Promise<boolean> {
  const model = await db('lowcode_models').where({ code: modelCode }).first()
  return model ? model.enable_audit === 1 : false
}

export async function logAudit(req: AuthRequest, ctx: AuditContext) {
  try {
    const enabled = await isAuditEnabled(ctx.modelCode)
    if (!enabled) return

    const before = ctx.before ?? null
    const after = ctx.after ?? null
    const diff = computeDiff(before, after)

    await db('data_audit_logs').insert(
      setTenantId(
        {
          model_code: ctx.modelCode,
          record_id: ctx.recordId,
          action: ctx.action,
          operator_id: ctx.user?.id || null,
          operator_name: ctx.user?.username || ctx.user?.nickname || null,
          before: before ? JSON.stringify(before) : null,
          after: after ? JSON.stringify(after) : null,
          diff: diff ? JSON.stringify(diff) : null,
          ip: getClientIp(ctx.req),
          create_time: db.fn.now()
        },
        req
      )
    )
  } catch (error) {
    // 审计失败不应影响主业务
    console.error('审计日志写入失败', error)
  }
}

export async function getAuditLogs(
  req: AuthRequest,
  query: {
    modelCode?: string
    action?: string
    recordId?: number
    operatorName?: string
    startTime?: string
    endTime?: string
    page?: number
    pageSize?: number
  }
) {
  const page = Number(query.page) || 1
  const pageSize = Number(query.pageSize) || 20
  const builder = db('data_audit_logs').where(tenantWhere(req)).orderBy('id', 'desc')

  if (query.modelCode) {
    builder.where('model_code', query.modelCode)
  }
  if (query.action) {
    builder.where('action', query.action)
  }
  if (query.recordId) {
    builder.where('record_id', query.recordId)
  }
  if (query.operatorName) {
    builder.where('operator_name', 'like', `%${query.operatorName}%`)
  }
  if (query.startTime) {
    builder.where('create_time', '>=', query.startTime)
  }
  if (query.endTime) {
    builder.where('create_time', '<=', query.endTime)
  }

  const totalResult = await builder.clone().count({ count: '*' }).first()
  const list = await builder
    .offset((page - 1) * pageSize)
    .limit(pageSize)

  return {
    list,
    total: Number(totalResult?.count || 0),
    page,
    pageSize
  }
}

export async function getAuditLogDetail(req: AuthRequest, id: number) {
  return db('data_audit_logs').where({ id }).andWhere(tenantWhere(req)).first()
}

export async function getAuditActions() {
  return ['create', 'update', 'delete']
}
