import { db } from '../../db'
import { AppError } from '../../utils/response'

// ---------- 首页配置 ----------

export async function getHomepageConfig(code = 'default') {
  const config = await db('homepage_configs').where({ code }).first()
  if (!config) {
    return getDefaultHomepageConfig()
  }
  return {
    ...config,
    widgets: config.widgets ? JSON.parse(config.widgets) : []
  }
}

export async function saveHomepageConfig(data: any) {
  const code = data.code || 'default'
  const exists = await db('homepage_configs').where({ code }).first()

  if (exists) {
    await db('homepage_configs').where({ code }).update({
      name: data.name,
      widgets: JSON.stringify(data.widgets || []),
      status: data.status ?? 1,
      update_time: db.fn.now()
    })
  } else {
    await db('homepage_configs').insert({
      code,
      name: data.name || '默认首页',
      widgets: JSON.stringify(data.widgets || []),
      status: data.status ?? 1
    })
  }

  return getHomepageConfig(code)
}

export async function getStats() {
  const [userCount, modelCount, messageCount] = await Promise.all([
    db('users').where('status', 1).count({ count: '*' }).first(),
    db('lowcode_models').where('status', 1).count({ count: '*' }).first(),
    db('messages').where('status', 1).count({ count: '*' }).first()
  ])
  return {
    userCount: Number(userCount?.count || 0),
    modelCount: Number(modelCount?.count || 0),
    messageCount: Number(messageCount?.count || 0)
  }
}

function getDefaultHomepageConfig() {
  return {
    code: 'default',
    name: '默认首页',
    widgets: [
      { type: 'stat', title: '用户数量', value: 0, icon: 'user', color: 'primary' },
      { type: 'stat', title: '数据模型', value: 0, icon: 'model', color: 'success' },
      { type: 'stat', title: '消息', value: 0, icon: 'message', color: 'warning' }
    ],
    status: 1
  }
}

// ---------- 仪表盘 ----------

export async function getDashboards() {
  return db('dashboards').orderBy('id', 'desc')
}

export async function getDashboardByCode(code: string) {
  const dashboard = await db('dashboards').where({ code }).first()
  if (!dashboard) throw new AppError('仪表盘不存在', 404)
  return {
    ...dashboard,
    config: dashboard.config ? JSON.parse(dashboard.config) : {}
  }
}

export async function createDashboard(data: any) {
  const [id] = await db('dashboards').insert({
    code: data.code,
    name: data.name,
    config: JSON.stringify(data.config || {}),
    status: data.status ?? 1
  })
  return db('dashboards').where({ id }).first()
}

export async function updateDashboard(id: number, data: any) {
  await db('dashboards').where({ id }).update({
    name: data.name,
    config: JSON.stringify(data.config || {}),
    status: data.status,
    update_time: db.fn.now()
  })
  return db('dashboards').where({ id }).first()
}

export async function deleteDashboard(id: number) {
  await db('dashboards').where({ id }).del()
  return true
}
