import { db } from '../../db'
import { AppError } from '../../utils/response'
import { tenantWhere, setTenantId } from '../../utils/tenant'
import type { AuthRequest } from '../../middleware/auth'
import { executeDataSource } from '../dashboard/dashboard.service'

export interface PageForm {
  id?: number
  code?: string
  name?: string
  description?: string
  config?: any
  status?: number
  permission?: string
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function parseConfig(value: any) {
  if (!value) return {}
  try {
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch {
    return {}
  }
}

export async function getPages(req: AuthRequest) {
  return db('lowcode_pages').where(tenantWhere(req)).orderBy('id', 'desc')
}

export async function getPageByCode(req: AuthRequest, code: string) {
  const page = await db('lowcode_pages').where({ code }).where(tenantWhere(req)).first()
  if (!page) throw new AppError('页面不存在', 404)
  return { ...page, config: parseConfig(page.config) }
}

export async function getPageById(req: AuthRequest, id: number) {
  const page = await db('lowcode_pages').where({ id }).where(tenantWhere(req)).first()
  if (!page) throw new AppError('页面不存在', 404)
  return { ...page, config: parseConfig(page.config) }
}

export async function createPage(req: AuthRequest, data: PageForm) {
  const code = safeCode(data.code || data.name || '')
  if (!code) throw new AppError('页面编码不能为空', 400)

  const exists = await db('lowcode_pages').where({ code }).where(tenantWhere(req)).first()
  if (exists) throw new AppError('页面编码已存在', 400)

  const insertData = setTenantId({
    code,
    name: data.name,
    description: data.description,
    config: JSON.stringify(data.config || {}),
    status: data.status ?? 1,
    permission: data.permission || null
  }, req)
  const [id] = await db('lowcode_pages').insert(insertData)
  return getPageById(req, id)
}

export async function updatePage(req: AuthRequest, id: number, data: PageForm) {
  const page = await getPageById(req, id)
  await db('lowcode_pages').where({ id }).where(tenantWhere(req)).update({
    name: data.name ?? page.name,
    description: data.description ?? page.description,
    config: JSON.stringify(data.config || page.config),
    status: data.status ?? page.status,
    permission: data.permission !== undefined ? (data.permission || null) : page.permission,
    update_time: db.fn.now()
  })
  return getPageById(req, id)
}

export async function savePage(req: AuthRequest, data: PageForm) {
  if (data.id) {
    return updatePage(req, data.id, data)
  }
  return createPage(req, data)
}

export async function deletePage(req: AuthRequest, id: number) {
  await db('lowcode_pages').where({ id }).where(tenantWhere(req)).del()
  return true
}

export async function executePageDataSource(req: AuthRequest, code: string, dataSource: any, ctx: any = {}) {
  const page = await getPageByCode(req, code)
  return executeDataSource(dataSource || {}, { ...ctx, page: page.config })
}
