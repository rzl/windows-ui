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
  const { receiverId, isRead, page = 1, pageSize = 10 } = query
  const builder = db('messages').orderBy('id', 'desc')

  if (receiverId) builder.where('receiver_id', Number(receiverId))
  if (isRead !== undefined && isRead !== '') builder.where('is_read', Number(isRead))

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
