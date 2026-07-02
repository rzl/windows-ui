import axios from 'axios'
import { db } from '../../db'
import { AppError } from '../../utils/response'
import { config as appConfig } from '../../config'
import { runScript, checkSafeSql } from '../../utils/script-runner'
import type { AuthRequest } from '../../middleware/auth'
import { tenantWhere, setTenantId } from '../../utils/tenant'

// ---------- 首页配置 ----------

export async function getHomepageConfig(req: AuthRequest, code = 'default') {
  const config = await db('homepage_configs')
    .where(tenantWhere(req))
    .where({ code })
    .first()
  if (!config) {
    return getDefaultHomepageConfig()
  }
  return {
    ...config,
    widgets: config.widgets ? JSON.parse(config.widgets) : []
  }
}

export async function saveHomepageConfig(req: AuthRequest, data: any) {
  const code = data.code || 'default'
  const exists = await db('homepage_configs')
    .where(tenantWhere(req))
    .where({ code })
    .first()

  if (exists) {
    await db('homepage_configs')
      .where(tenantWhere(req))
      .where({ code })
      .update({
        name: data.name,
        widgets: JSON.stringify(data.widgets || []),
        status: data.status ?? 1,
        update_time: db.fn.now()
      })
  } else {
    await db('homepage_configs').insert(
      setTenantId(
        {
          code,
          name: data.name || '默认首页',
          widgets: JSON.stringify(data.widgets || []),
          status: data.status ?? 1
        },
        req
      )
    )
  }

  return getHomepageConfig(req, code)
}

export async function getStats(req: AuthRequest, widgets: any[] = []) {
  const [userCount, modelCount, messageCount] = await Promise.all([
    db('users').where(tenantWhere(req)).where('status', 1).count({ count: '*' }).first(),
    db('lowcode_models').where(tenantWhere(req)).where('status', 1).count({ count: '*' }).first(),
    db('messages').where(tenantWhere(req)).where('status', 1).count({ count: '*' }).first()
  ])
  const stats: Record<string, any> = {
    userCount: Number(userCount?.count || 0),
    modelCount: Number(modelCount?.count || 0),
    messageCount: Number(messageCount?.count || 0)
  }

  const statWidgets = widgets.filter((w) => w.type === 'stat' && w.dataSource)
  const dynamicEntries = await Promise.all(
    statWidgets.map(async (widget) => {
      try {
        const value = await executeDataSource(widget.dataSource)
        return { field: widget.field, value: resolveStatValue(value) }
      } catch {
        return { field: widget.field, value: 0 }
      }
    })
  )

  for (const entry of dynamicEntries) {
    if (entry.field) {
      stats[entry.field] = entry.value
    }
  }

  return stats
}

function resolveStatValue(data: any): any {
  if (data === null || data === undefined) return 0
  if (typeof data === 'number' || typeof data === 'boolean') return data
  if (typeof data === 'string') return data
  if (Array.isArray(data)) {
    if (data.length === 0) return 0
    const first = data[0]
    if (typeof first === 'object' && first !== null) {
      const values = Object.values(first)
      const numeric = values.find((v) => typeof v === 'number')
      return numeric !== undefined ? numeric : String(values[0] ?? '')
    }
    return first
  }
  if (typeof data === 'object') {
    const values = Object.values(data)
    const numeric = values.find((v) => typeof v === 'number')
    return numeric !== undefined ? numeric : String(values[0] ?? '')
  }
  return String(data)
}

function getDefaultHomepageConfig() {
  return {
    code: 'default',
    name: '默认首页',
    widgets: [
      { type: 'stat', title: '用户数量', field: 'userCount', icon: 'user', color: 'primary', dataSource: { type: '' } },
      { type: 'stat', title: '数据模型', field: 'modelCount', icon: 'model', color: 'success', dataSource: { type: '' } },
      { type: 'stat', title: '消息', field: 'messageCount', icon: 'message', color: 'warning', dataSource: { type: '' } }
    ],
    status: 1
  }
}

// ---------- 仪表盘 ----------

export async function getDashboards(req: AuthRequest) {
  return db('dashboards').where(tenantWhere(req)).orderBy('id', 'desc')
}

export async function getDashboardByCode(req: AuthRequest, code: string) {
  const dashboard = await db('dashboards').where(tenantWhere(req)).where({ code }).first()
  if (!dashboard) throw new AppError('仪表盘不存在', 404)
  return {
    ...dashboard,
    config: dashboard.config ? JSON.parse(dashboard.config) : {}
  }
}

export async function createDashboard(req: AuthRequest, data: any) {
  const [id] = await db('dashboards').insert(
    setTenantId(
      {
        code: data.code,
        name: data.name,
        config: JSON.stringify(data.config || {}),
        status: data.status ?? 1
      },
      req
    )
  )
  return db('dashboards').where(tenantWhere(req)).where({ id }).first()
}

export async function updateDashboard(req: AuthRequest, id: number, data: any) {
  await db('dashboards')
    .where(tenantWhere(req))
    .where({ id })
    .update({
      name: data.name,
      config: JSON.stringify(data.config || {}),
      status: data.status,
      update_time: db.fn.now()
    })
  return db('dashboards').where(tenantWhere(req)).where({ id }).first()
}

export async function deleteDashboard(req: AuthRequest, id: number) {
  await db('dashboards').where(tenantWhere(req)).where({ id }).del()
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
      return runScript(dataSource.transformScript, { data: rows, ctx })
    }
    return rows
  }

  if (type === 'api') {
    const data = await executeApiDataSource(dataSource.api)
    if (dataSource.transformScript) {
      return runScript(dataSource.transformScript, { data, ctx })
    }
    return data
  }

  if (type === 'script') {
    if (!dataSource.script) throw new AppError('脚本不能为空', 400)
    return runScript(dataSource.script, { ctx })
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


