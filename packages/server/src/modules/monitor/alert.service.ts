import { db } from '../../db'
import { wsManager } from '../../utils/websocket'
import { createMessage } from './monitor.service'

export interface AlertRule {
  id?: number
  name: string
  type: 'api_slow' | 'sql_slow' | 'error_rate' | 'server_load'
  threshold: number
  windowMinutes: number
  enabled?: number
  notifyChannel?: string
  receiverIds?: number[]
}

export async function getAlertRules(query: any = {}) {
  const { type, enabled, page = 1, pageSize = 50 } = query
  const builder = db('alert_rules').orderBy('id', 'desc')

  if (type) builder.where('type', type)
  if (enabled !== undefined && enabled !== '') builder.where('enabled', Number(enabled))

  const total = await builder.clone().count({ count: '*' }).first()
  const list = await builder
    .offset((Number(page) - 1) * Number(pageSize))
    .limit(Number(pageSize))

  return {
    list: list.map((item) => parseRule(item)),
    total: Number(total?.count || 0),
    page: Number(page),
    pageSize: Number(pageSize)
  }
}

export async function getAlertRule(id: number) {
  const item = await db('alert_rules').where({ id }).first()
  return item ? parseRule(item) : null
}

export async function createAlertRule(data: AlertRule) {
  const [id] = await db('alert_rules').insert(formatRule(data))
  return getAlertRule(id)
}

export async function updateAlertRule(id: number, data: AlertRule) {
  await db('alert_rules').where({ id }).update(formatRule(data))
  return getAlertRule(id)
}

export async function deleteAlertRule(id: number) {
  await db('alert_rules').where({ id }).del()
  return true
}

export async function getAlertRecords(query: any = {}) {
  const { type, isRead, status, page = 1, pageSize = 10 } = query
  const builder = db('alert_records').orderBy('id', 'desc')

  if (type) builder.where('type', type)
  if (isRead !== undefined && isRead !== '') builder.where('is_read', Number(isRead))
  if (status) builder.where('status', status)

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

export async function createAlertRecord(data: {
  ruleId?: number
  ruleName: string
  type: string
  message: string
  snapshot?: any
}) {
  const [id] = await db('alert_records').insert({
    rule_id: data.ruleId || null,
    rule_name: data.ruleName,
    type: data.type,
    message: data.message,
    snapshot: data.snapshot ? JSON.stringify(data.snapshot) : null,
    is_read: 0,
    status: 'pending',
    create_time: new Date().toISOString(),
    update_time: new Date().toISOString()
  })
  return db('alert_records').where({ id }).first()
}

export async function markAlertRecordRead(id: number) {
  await db('alert_records').where({ id }).update({ is_read: 1, update_time: new Date().toISOString() })
  return db('alert_records').where({ id }).first()
}

export async function resolveAlertRecord(id: number) {
  await db('alert_records').where({ id }).update({ status: 'resolved', update_time: new Date().toISOString() })
  return db('alert_records').where({ id }).first()
}

export async function getUnreadAlertCount() {
  const result = await db('alert_records').where({ is_read: 0 }).count({ count: '*' }).first()
  return Number(result?.count || 0)
}

export async function checkAlerts() {
  const rules = await db('alert_rules').where('enabled', 1)
  const now = new Date()
  const records: any[] = []

  for (const rule of rules) {
    const windowStart = new Date(now.getTime() - rule.window_minutes * 60 * 1000).toISOString()

    if (rule.type === 'api_slow') {
      const slow = await db('api_metrics')
        .where('created_at', '>=', windowStart)
        .where('duration', '>', rule.threshold)
        .orderBy('duration', 'desc')
        .first()
      if (slow) {
        const record = await createAlertRecord({
          ruleId: rule.id,
          ruleName: rule.name,
          type: rule.type,
          message: `检测到慢接口：${slow.method} ${slow.path}，耗时 ${slow.duration}ms，超过阈值 ${rule.threshold}ms`,
          snapshot: slow
        })
        records.push(record)
      }
    }

    if (rule.type === 'sql_slow') {
      const slow = await db('sql_metrics')
        .where('created_at', '>=', windowStart)
        .where('duration', '>', rule.threshold)
        .orderBy('duration', 'desc')
        .first()
      if (slow) {
        const record = await createAlertRecord({
          ruleId: rule.id,
          ruleName: rule.name,
          type: rule.type,
          message: `检测到慢 SQL，耗时 ${slow.duration}ms，超过阈值 ${rule.threshold}ms`,
          snapshot: { sql: slow.sql?.slice(0, 500), duration: slow.duration }
        })
        records.push(record)
      }
    }

    if (rule.type === 'error_rate') {
      const total = await db('api_metrics').where('created_at', '>=', windowStart).count({ count: '*' }).first()
      const errors = await db('api_metrics')
        .where('created_at', '>=', windowStart)
        .where('status_code', '>=', 500)
        .count({ count: '*' })
        .first()
      const totalCount = Number(total?.count || 0)
      const errorCount = Number(errors?.count || 0)
      const rate = totalCount > 0 ? (errorCount / totalCount) * 100 : 0
      if (rate > rule.threshold) {
        const record = await createAlertRecord({
          ruleId: rule.id,
          ruleName: rule.name,
          type: rule.type,
          message: `错误率 ${rate.toFixed(2)}%（${errorCount}/${totalCount}），超过阈值 ${rule.threshold}%`,
          snapshot: { totalCount, errorCount, rate }
        })
        records.push(record)
      }
    }

    if (rule.type === 'server_load') {
      const os = await import('os')
      const loadavg = os.loadavg()
      const cpus = os.cpus().length || 1
      const load = loadavg[0] / cpus * 100
      if (load > rule.threshold) {
        const record = await createAlertRecord({
          ruleId: rule.id,
          ruleName: rule.name,
          type: rule.type,
          message: `服务器 1 分钟平均负载 ${load.toFixed(2)}%，超过阈值 ${rule.threshold}%`,
          snapshot: { loadavg }
        })
        records.push(record)
      }
    }
  }

  // 推送告警通知
  for (const record of records) {
    await pushAlertNotification(record)
  }

  return records
}

async function pushAlertNotification(record: any) {
  const ruleId = record.rule_id
  let receiverIds: number[] = []

  if (ruleId) {
    const rule = await db('alert_rules').where({ id: ruleId }).first()
    if (rule?.receiver_ids) {
      try {
        receiverIds = JSON.parse(rule.receiver_ids)
      } catch {
        receiverIds = []
      }
    }
  }

  const payload = {
    type: 'new_alert',
    data: record
  }

  if (receiverIds.length > 0) {
    for (const userId of receiverIds) {
      wsManager.sendToUser(userId, payload)
      await createMessage({
        receiverId: userId,
        title: '系统告警',
        content: record.message,
        type: 'alert',
        businessType: 'alert_record',
        businessKey: String(record.id)
      })
    }
  } else {
    // 未配置接收人时广播给所有在线用户
    wsManager.broadcast(payload)
  }
}

function parseRule(item: any): AlertRule {
  return {
    id: item.id,
    name: item.name,
    type: item.type,
    threshold: item.threshold,
    windowMinutes: item.window_minutes,
    enabled: item.enabled,
    notifyChannel: item.notify_channel,
    receiverIds: item.receiver_ids ? JSON.parse(item.receiver_ids) : []
  }
}

function formatRule(data: AlertRule) {
  return {
    name: data.name,
    type: data.type,
    threshold: data.threshold,
    window_minutes: data.windowMinutes,
    enabled: data.enabled ?? 1,
    notify_channel: data.notifyChannel || 'site',
    receiver_ids: data.receiverIds ? JSON.stringify(data.receiverIds) : null,
    update_time: new Date().toISOString()
  }
}
