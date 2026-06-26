import { db } from '../../db'
import { AppError } from '../../utils/response'
import { wsManager } from '../../utils/websocket'
import os from 'os'

// ---------- 消息模板 ----------

export async function getMessageTemplates() {
  return db('message_templates').orderBy('id', 'desc')
}

export async function createMessageTemplate(data: any) {
  const [id] = await db('message_templates').insert({
    code: data.code,
    name: data.name,
    title: data.title,
    content: data.content,
    channel: data.channel || 'site',
    status: data.status ?? 1
  })
  return db('message_templates').where({ id }).first()
}

export async function updateMessageTemplate(id: number, data: any) {
  await db('message_templates').where({ id }).update({
    name: data.name,
    title: data.title,
    content: data.content,
    channel: data.channel,
    status: data.status
  })
  return db('message_templates').where({ id }).first()
}

export async function deleteMessageTemplate(id: number) {
  await db('message_templates').where({ id }).del()
  return true
}

// ---------- 消息 ----------

export async function getMessages(query: any) {
  const { receiverId, isRead, type, businessType, page = 1, pageSize = 10 } = query
  const builder = db('messages').orderBy('id', 'desc')

  if (receiverId) builder.where('receiver_id', Number(receiverId))
  if (isRead !== undefined && isRead !== '') builder.where('is_read', Number(isRead))
  if (type) builder.where('type', type)
  if (businessType) builder.where('business_type', businessType)

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

export async function createMessage(data: any) {
  const [id] = await db('messages').insert({
    sender_id: data.senderId,
    receiver_id: data.receiverId,
    title: data.title,
    content: data.content,
    channel: data.channel || 'site',
    type: data.type || 'system',
    business_type: data.businessType || null,
    business_key: data.businessKey || null,
    link: data.link || null,
    sender_name: data.senderName || null,
    is_read: 0,
    status: 1
  })
  const message = await db('messages').where({ id }).first()

  // WebSocket 实时推送给接收人
  wsManager.sendToUser(data.receiverId, {
    type: 'new_message',
    data: message
  })

  return message
}

export async function markMessageRead(id: number) {
  await db('messages').where({ id }).update({ is_read: 1 })
  return db('messages').where({ id }).first()
}

export async function readAllMessages(receiverId: number) {
  await db('messages').where({ receiver_id: receiverId, is_read: 0 }).update({ is_read: 1 })
  return true
}

export async function markMessageReadByBusinessKey(businessType: string, businessKey: string, receiverId: number) {
  await db('messages')
    .where({
      receiver_id: receiverId,
      business_type: businessType,
      business_key: businessKey,
      is_read: 0
    })
    .update({ is_read: 1 })
  return true
}

export async function deleteMessage(id: number) {
  await db('messages').where({ id }).del()
  return true
}

export async function getUnreadCount(receiverId: number) {
  const result = await db('messages')
    .where({ receiver_id: receiverId, is_read: 0, status: 1 })
    .count({ count: '*' })
    .first()
  return Number(result?.count || 0)
}

// ---------- 操作日志 ----------

export async function getOperationLogs(query: any) {
  const { keyword, page = 1, pageSize = 10 } = query
  const builder = db('operation_logs').orderBy('id', 'desc')

  if (keyword) {
    builder.where((qb) => {
      qb.where('username', 'like', `%${keyword}%`)
        .orWhere('module', 'like', `%${keyword}%`)
        .orWhere('action', 'like', `%${keyword}%`)
    })
  }

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

export async function createOperationLog(data: any) {
  const [id] = await db('operation_logs').insert({
    user_id: data.userId,
    username: data.username,
    module: data.module,
    action: data.action,
    method: data.method,
    path: data.path,
    params: data.params ? JSON.stringify(data.params) : null,
    ip: data.ip,
    duration: data.duration,
    status: data.status
  })
  return db('operation_logs').where({ id }).first()
}

// ---------- 数据日志（快照） ----------

export async function getDataLogs(query: any) {
  const { modelCode, rowId, page = 1, pageSize = 10 } = query
  const builder = db('data_logs').orderBy('id', 'desc')

  if (modelCode) builder.where('model_code', modelCode)
  if (rowId) builder.where('row_id', rowId)

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

export async function createDataLog(data: any) {
  const [id] = await db('data_logs').insert({
    user_id: data.userId,
    model_code: data.modelCode,
    row_id: data.rowId,
    action: data.action,
    before_snapshot: data.beforeSnapshot ? JSON.stringify(data.beforeSnapshot) : null,
    after_snapshot: data.afterSnapshot ? JSON.stringify(data.afterSnapshot) : null
  })
  return db('data_logs').where({ id }).first()
}

// ---------- API 性能指标 ----------

export async function createApiMetric(data: {
  method: string
  path: string
  statusCode: number
  duration: number
  userId?: number
  username?: string
  ip?: string
  params?: any
}) {
  return db('api_metrics').insert({
    method: data.method,
    path: data.path,
    status_code: data.statusCode,
    duration: data.duration,
    user_id: data.userId || null,
    username: data.username || null,
    ip: data.ip || 'unknown',
    params: data.params ? JSON.stringify(data.params) : null,
    created_at: new Date().toISOString()
  })
}

export async function getApiMetrics(query: any) {
  const { path, startTime, endTime, page = 1, pageSize = 10 } = query
  const builder = db('api_metrics').orderBy('id', 'desc')

  if (path) builder.where('path', 'like', `%${path}%`)
  if (startTime) builder.where('created_at', '>=', startTime)
  if (endTime) builder.where('created_at', '<=', endTime)

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

export async function getApiPerformanceStats(query: any) {
  const { startTime, endTime, topN = 10 } = query
  const builder = db('api_metrics')

  if (startTime) builder.where('created_at', '>=', startTime)
  if (endTime) builder.where('created_at', '<=', endTime)

  const totalCount = await builder.clone().count({ count: '*' }).first()
  const slowCount = await builder.clone().where('duration', '>', 1000).count({ count: '*' }).first()
  const errorCount = await builder.clone().where('status_code', '>=', 500).count({ count: '*' }).first()

  const topSlow = await builder
    .clone()
    .select('path')
    .max('duration as maxDuration')
    .avg('duration as avgDuration')
    .count('* as count')
    .groupBy('path')
    .orderBy('maxDuration', 'desc')
    .limit(Number(topN))

  return {
    totalCount: Number(totalCount?.count || 0),
    slowCount: Number(slowCount?.count || 0),
    errorCount: Number(errorCount?.count || 0),
    topSlow
  }
}

export async function getApiTrend(query: any) {
  const { startTime, endTime, interval = 60 } = query
  const start = startTime ? new Date(startTime).toISOString() : new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const end = endTime ? new Date(endTime).toISOString() : new Date().toISOString()

  // SQLite 不支持 DATE_TRUNC，按分钟字符串聚合
  const rows = await db('api_metrics')
    .select(db.raw(`substr(created_at, 1, 16) as time`))
    .count('* as count')
    .avg('duration as avgDuration')
    .where('created_at', '>=', start)
    .where('created_at', '<=', end)
    .groupBy('time')
    .orderBy('time')

  return rows.map((r) => ({
    time: r.time,
    count: Number(r.count),
    avgDuration: Number(r.avgDuration || 0).toFixed(2)
  }))
}

// ---------- 慢 SQL 指标 ----------

export async function createSqlMetric(data: { sql: string; bindings?: string | null; duration: number }) {
  return db('sql_metrics').insert({
    sql: data.sql,
    bindings: data.bindings || null,
    duration: data.duration,
    created_at: new Date().toISOString()
  })
}

export async function getSlowSqls(query: any) {
  const { keyword, minDuration = 100, startTime, endTime, page = 1, pageSize = 10 } = query
  const builder = db('sql_metrics').where('duration', '>=', Number(minDuration)).orderBy('id', 'desc')

  if (keyword) builder.where('sql', 'like', `%${keyword}%`)
  if (startTime) builder.where('created_at', '>=', startTime)
  if (endTime) builder.where('created_at', '<=', endTime)

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

export async function getSqlPerformanceStats(query: any) {
  const { startTime, endTime } = query
  const builder = db('sql_metrics')

  if (startTime) builder.where('created_at', '>=', startTime)
  if (endTime) builder.where('created_at', '<=', endTime)

  const totalCount = await builder.clone().count({ count: '*' }).first()
  const slowCount = await builder.clone().where('duration', '>', 1000).count({ count: '*' }).first()
  const maxDuration = await builder.clone().max('duration as maxDuration').first()

  return {
    totalCount: Number(totalCount?.count || 0),
    slowCount: Number(slowCount?.count || 0),
    maxDuration: Number(maxDuration?.maxDuration || 0)
  }
}

// ---------- 服务器信息 ----------

export function getServerInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    nodeVersion: process.version,
    uptime: process.uptime(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpus: os.cpus().length,
    loadavg: os.loadavg()
  }
}

// ---------- 在线用户（基于活跃 token 估算） ----------

// 简单实现：提供示例在线用户列表
export async function getOnlineUsers() {
  // 实际生产环境应基于 Redis/session 存储
  const users = await db('users')
    .where('status', 1)
    .select('id', 'username', 'nickname')
    .limit(10)
  return users.map((u) => ({
    ...u,
    loginTime: new Date().toISOString(),
    ip: '127.0.0.1'
  }))
}
