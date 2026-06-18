import { db } from '../../db'
import { AppError } from '../../utils/response'
import { executeDataSource } from '../dashboard/dashboard.service'

export interface PageForm {
  id?: number
  code?: string
  name?: string
  description?: string
  config?: any
  status?: number
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

export async function getPages() {
  return db('lowcode_pages').orderBy('id', 'desc')
}

export async function getPageByCode(code: string) {
  const page = await db('lowcode_pages').where({ code }).first()
  if (!page) throw new AppError('页面不存在', 404)
  return { ...page, config: parseConfig(page.config) }
}

export async function getPageById(id: number) {
  const page = await db('lowcode_pages').where({ id }).first()
  if (!page) throw new AppError('页面不存在', 404)
  return { ...page, config: parseConfig(page.config) }
}

export async function createPage(data: PageForm) {
  const code = safeCode(data.code || data.name || '')
  if (!code) throw new AppError('页面编码不能为空', 400)

  const exists = await db('lowcode_pages').where({ code }).first()
  if (exists) throw new AppError('页面编码已存在', 400)

  const [id] = await db('lowcode_pages').insert({
    code,
    name: data.name,
    description: data.description,
    config: JSON.stringify(data.config || {}),
    status: data.status ?? 1
  })
  return getPageById(id)
}

export async function updatePage(id: number, data: PageForm) {
  const page = await getPageById(id)
  await db('lowcode_pages').where({ id }).update({
    name: data.name ?? page.name,
    description: data.description ?? page.description,
    config: JSON.stringify(data.config || page.config),
    status: data.status ?? page.status,
    update_time: db.fn.now()
  })
  return getPageById(id)
}

export async function savePage(data: PageForm) {
  if (data.id) {
    return updatePage(data.id, data)
  }
  return createPage(data)
}

export async function deletePage(id: number) {
  await db('lowcode_pages').where({ id }).del()
  return true
}

export async function executePageDataSource(code: string, dataSource: any, ctx: any = {}) {
  const page = await getPageByCode(code)
  return executeDataSource(dataSource || {}, { ...ctx, page: page.config })
}
