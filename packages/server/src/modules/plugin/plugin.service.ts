import { db } from '../../db'
import { AppError } from '../../utils/response'

export interface PluginForm {
  id?: number
  code?: string
  name?: string
  version?: string
  description?: string
  type?: string
  contributions?: any
  runtimeCode?: string
  runtimeUrl?: string
  configSchema?: any
  status?: number
  icon?: string
  author?: string
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()
}

function parseJson<T>(value: any): T | undefined {
  if (!value) return undefined
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return undefined
    }
  }
  return value as T
}

export async function getPlugins() {
  return db('lowcode_plugins').orderBy('id', 'desc')
}

export async function getActivePlugins() {
  return db('lowcode_plugins').where({ status: 1 }).orderBy('id', 'asc')
}

export async function getPluginById(id: number) {
  const plugin = await db('lowcode_plugins').where({ id }).first()
  if (!plugin) throw new AppError('插件不存在', 404)
  return plugin
}

export async function createPlugin(data: PluginForm) {
  const code = safeCode(data.code || '')
  if (!code) throw new AppError('插件编码不能为空', 400)

  const exists = await db('lowcode_plugins').where({ code }).first()
  if (exists) throw new AppError('插件编码已存在', 400)

  const [id] = await db('lowcode_plugins').insert({
    code,
    name: data.name || code,
    version: data.version || '1.0.0',
    description: data.description || '',
    type: data.type || 'mixed',
    contributions: data.contributions ? JSON.stringify(data.contributions) : '{}',
    runtime_code: data.runtimeCode || '',
    runtime_url: data.runtimeUrl || '',
    config_schema: data.configSchema ? JSON.stringify(data.configSchema) : '{}',
    status: data.status ?? 1,
    icon: data.icon || '',
    author: data.author || '',
    create_time: db.fn.now(),
    update_time: db.fn.now()
  })
  return getPluginById(id)
}

export async function updatePlugin(id: number, data: PluginForm) {
  const plugin = await getPluginById(id)

  await db('lowcode_plugins').where({ id }).update({
    name: data.name ?? plugin.name,
    version: data.version ?? plugin.version,
    description: data.description ?? plugin.description,
    type: data.type ?? plugin.type,
    contributions: data.contributions !== undefined ? JSON.stringify(data.contributions) : plugin.contributions,
    runtime_code: data.runtimeCode !== undefined ? data.runtimeCode : plugin.runtime_code,
    runtime_url: data.runtimeUrl !== undefined ? data.runtimeUrl : plugin.runtime_url,
    config_schema: data.configSchema !== undefined ? JSON.stringify(data.configSchema) : plugin.config_schema,
    status: data.status ?? plugin.status,
    icon: data.icon ?? plugin.icon,
    author: data.author ?? plugin.author,
    update_time: db.fn.now()
  })
  return getPluginById(id)
}

export async function deletePlugin(id: number) {
  const plugin = await getPluginById(id)
  await db('lowcode_plugins').where({ id }).del()
  return plugin
}

export async function setPluginStatus(id: number, status: number) {
  const plugin = await getPluginById(id)
  await db('lowcode_plugins').where({ id }).update({ status, update_time: db.fn.now() })
  return getPluginById(id)
}

export async function getFieldDbType(type: string): Promise<string | undefined> {
  const plugins = await getActivePlugins()
  for (const plugin of plugins) {
    const contributions = parseJson<any>(plugin.contributions)
    const fieldTypes = contributions?.fieldTypes || []
    const found = fieldTypes.find((f: any) => f.type === type)
    if (found?.dbType) return found.dbType
  }
  return undefined
}

export async function getFieldTypeMeta(type: string): Promise<any | undefined> {
  const plugins = await getActivePlugins()
  for (const plugin of plugins) {
    const contributions = parseJson<any>(plugin.contributions)
    const fieldTypes = contributions?.fieldTypes || []
    const found = fieldTypes.find((f: any) => f.type === type)
    if (found) return found
  }
  return undefined
}
