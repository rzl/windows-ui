import { db } from '../../db'
import { AppError } from '../../utils/response'
import axios from 'axios'

export interface ExternalDataSourceConfig {
  // REST
  url?: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  params?: Record<string, any>
  body?: any
  resultPath?: string // 响应数据解析路径，如 data.list
  labelField?: string
  valueField?: string

  // Database
  host?: string
  port?: number
  database?: string
  user?: string
  password?: string
  sql?: string
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function parseConfig(data: any): ExternalDataSourceConfig {
  if (!data?.config) return {}
  try {
    return typeof data.config === 'string' ? JSON.parse(data.config) : data.config
  } catch {
    return {}
  }
}

export async function getExternalDataSources() {
  return db('external_data_sources').orderBy('id', 'desc')
}

export async function getExternalDataSource(id: number) {
  const ds = await db('external_data_sources').where({ id }).first()
  if (!ds) throw new AppError('外部数据源不存在', 404)
  return { ...ds, config: parseConfig(ds) }
}

export async function getExternalDataSourceByCode(code: string) {
  const ds = await db('external_data_sources').where({ code }).first()
  if (!ds) throw new AppError('外部数据源不存在', 404)
  return { ...ds, config: parseConfig(ds) }
}

export async function createExternalDataSource(data: any) {
  const code = safeCode(data.code || data.name)
  const exists = await db('external_data_sources').where({ code }).first()
  if (exists) throw new AppError('数据源编码已存在', 400)

  const config = typeof data.config === 'string' ? data.config : JSON.stringify(data.config || {})
  const [id] = await db('external_data_sources').insert({
    code,
    name: data.name,
    type: data.type,
    config,
    description: data.description || '',
    status: data.status ?? 1
  })
  return db('external_data_sources').where({ id }).first()
}

export async function updateExternalDataSource(id: number, data: any) {
  const ds = await db('external_data_sources').where({ id }).first()
  if (!ds) throw new AppError('外部数据源不存在', 404)

  const config = typeof data.config === 'string' ? data.config : JSON.stringify(data.config || {})
  await db('external_data_sources').where({ id }).update({
    name: data.name,
    type: data.type,
    config,
    description: data.description || '',
    status: data.status ?? 1,
    update_time: db.fn.now()
  })
  return db('external_data_sources').where({ id }).first()
}

export async function deleteExternalDataSource(id: number) {
  await db('external_data_sources').where({ id }).del()
  return true
}

export async function testExternalDataSource(id: number) {
  try {
    const result = await executeExternalDataSource(id, {})
    return { success: true, sample: Array.isArray(result) ? result.slice(0, 3) : result }
  } catch (error: any) {
    return { success: false, message: error.message || '测试失败' }
  }
}

export async function executeExternalDataSource(id: number, ctx: Record<string, any> = {}) {
  const ds = await getExternalDataSource(id)
  const config = ds.config as ExternalDataSourceConfig

  if (ds.type === 'rest') {
    return executeRestDataSource(config, ctx)
  }

  if (ds.type === 'mysql' || ds.type === 'postgresql') {
    return executeDatabaseDataSource(ds.type, config, ctx)
  }

  throw new AppError('不支持的数据源类型', 400)
}

async function executeRestDataSource(config: ExternalDataSourceConfig, ctx: Record<string, any>) {
  if (!config.url) throw new AppError('REST 数据源缺少 URL', 400)

  const url = renderTemplate(config.url, ctx)
  const method = config.method || 'GET'
  const headers = config.headers || {}
  const params = renderObject(config.params || {}, ctx)
  const body = config.body ? renderObject(config.body, ctx) : undefined

  const response = await axios({ url, method, headers, params, data: body, timeout: 30000 })
  const data = response.data
  return extractResult(data, config.resultPath)
}

async function executeDatabaseDataSource(type: string, config: ExternalDataSourceConfig, ctx: Record<string, any>) {
  if (!config.sql) throw new AppError('数据库数据源缺少 SQL', 400)

  let client: any
  try {
    if (type === 'mysql') {
      const mysql = require('mysql2/promise')
      client = await mysql.createConnection({
        host: config.host,
        port: config.port || 3306,
        database: config.database,
        user: config.user,
        password: config.password
      })
    } else if (type === 'postgresql') {
      const { Client } = require('pg')
      client = new Client({
        host: config.host,
        port: config.port || 5432,
        database: config.database,
        user: config.user,
        password: config.password
      })
      await client.connect()
    } else {
      throw new AppError('不支持的数据库类型', 400)
    }

    const sql = renderTemplate(config.sql, ctx)
    const [rows] = type === 'mysql' ? await client.execute(sql) : [await client.query(sql).then((r: any) => r.rows)]
    return rows
  } finally {
    if (client) {
      try {
        if (type === 'postgresql') await client.end()
        else await client.end()
      } catch {}
    }
  }
}

function extractResult(data: any, resultPath?: string): any {
  if (!resultPath) return data
  const parts = resultPath.split('.')
  let current = data
  for (const part of parts) {
    if (current === undefined || current === null) return undefined
    current = current[part]
  }
  return current
}

function renderTemplate(template: string, ctx: Record<string, any>): string {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => {
    const value = ctx[key]
    return value !== undefined ? String(value) : ''
  })
}

function renderObject(obj: any, ctx: Record<string, any>): any {
  if (typeof obj === 'string') return renderTemplate(obj, ctx)
  if (Array.isArray(obj)) return obj.map((item) => renderObject(item, ctx))
  if (obj && typeof obj === 'object') {
    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = renderObject(value, ctx)
    }
    return result
  }
  return obj
}

export function formatOptions(rows: any[], labelField?: string, valueField?: string) {
  if (!Array.isArray(rows)) return []
  const labelKey = labelField || 'label'
  const valueKey = valueField || 'value'
  return rows.map((row) => ({
    label: row[labelKey],
    value: row[valueKey]
  }))
}
