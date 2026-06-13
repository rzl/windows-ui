import axios from 'axios'
import { db } from '../../db'
import { AppError } from '../../utils/response'
import { config as appConfig } from '../../config'

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

// ---------- 数据源执行 ----------

export interface DataSourceConfig {
  type: 'static' | 'sql' | 'script' | 'api'
  option?: any
  sql?: string
  script?: string
  transformScript?: string
  api?: {
    method?: string
    url?: string
    params?: Record<string, any>
    body?: Record<string, any>
  }
}

export async function executeDataSource(dataSource: DataSourceConfig, ctx: any = {}) {
  const { type } = dataSource

  if (type === 'static') {
    return dataSource.option || {}
  }

  if (type === 'sql') {
    const rows = await executeSqlDataSource(dataSource.sql)
    if (dataSource.transformScript) {
      return executeTransformScript(dataSource.transformScript, rows, ctx)
    }
    return rows
  }

  if (type === 'api') {
    const data = await executeApiDataSource(dataSource.api)
    if (dataSource.transformScript) {
      return executeTransformScript(dataSource.transformScript, data, ctx)
    }
    return data
  }

  if (type === 'script') {
    if (!dataSource.script) throw new AppError('脚本不能为空', 400)
    return executeScriptDataSource(dataSource.script, ctx)
  }

  throw new AppError('不支持的数据源类型', 400)
}

async function executeSqlDataSource(sql?: string) {
  if (!sql) throw new AppError('SQL 不能为空', 400)
  checkSafeSql(sql)
  const result = await db.raw(sql)
  return Array.isArray(result) ? result : []
}

async function executeApiDataSource(apiConfig?: DataSourceConfig['api']) {
  if (!apiConfig || !apiConfig.url) throw new AppError('API 地址不能为空', 400)

  const method = (apiConfig.method || 'GET').toUpperCase()
  const baseUrl = `http://127.0.0.1:${appConfig.port}`
  const response = await axios({
    method,
    url: `${baseUrl}${apiConfig.url}`,
    params: apiConfig.params,
    data: apiConfig.body,
    headers: {
      'x-dashboard-service': '1'
    }
  })
  return response.data?.data
}

async function executeTransformScript(script: string, data: any, ctx: any) {
  return runScript(script, { data, ctx })
}

async function executeScriptDataSource(script: string, ctx: any) {
  return runScript(script, { ctx })
}

async function runScript(script: string, context: { data?: any; ctx?: any }) {
  if (!script) throw new AppError('脚本不能为空', 400)

  const http = async (cfg: any) => {
    const res = await axios({
      ...cfg,
      url: cfg.url?.startsWith('http') ? cfg.url : `http://127.0.0.1:${appConfig.port}${cfg.url}`,
      headers: {
        ...(cfg.headers || {}),
        'x-dashboard-service': '1'
      }
    })
    return res.data?.data
  }

  const dbProxy = {
    raw: async (sql: string) => {
      checkSafeSql(sql)
      const result = await db.raw(sql)
      return Array.isArray(result) ? result : []
    }
  }

  const fn = new Function('ctx', 'data', 'db', 'http', `
    return (async () => {
      "use strict";
      ${script}
    })();
  `)

  try {
    return await fn(context.ctx, context.data, dbProxy, http)
  } catch (error: any) {
    throw new AppError(`脚本执行失败: ${error.message}`, 400)
  }
}

function checkSafeSql(sql: string) {
  const upper = sql.trim().toUpperCase()
  if (!upper.startsWith('SELECT')) {
    throw new AppError('只允许执行 SELECT 查询', 400)
  }
  const forbidden = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE']
  if (forbidden.some((k) => upper.includes(k))) {
    throw new AppError('SQL 包含非法关键字', 400)
  }
}
