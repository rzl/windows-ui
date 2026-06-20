import { db } from '../../db'
import { AppError } from '../../utils/response'
import { runScript } from '../../utils/script-runner'

export interface CustomApiForm {
  id?: number
  code?: string
  name?: string
  method?: string
  path?: string
  description?: string
  script?: string
  status?: number
  isPublic?: number
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

export async function getCustomApis() {
  return db('lowcode_custom_apis').orderBy('id', 'desc')
}

export async function getCustomApiById(id: number) {
  const api = await db('lowcode_custom_apis').where({ id }).first()
  if (!api) throw new AppError('接口不存在', 404)
  return api
}

export async function getCustomApiByCode(code: string) {
  return db('lowcode_custom_apis').where({ code }).first()
}

export async function createCustomApi(data: CustomApiForm) {
  const code = safeCode(data.code || '')
  if (!code) throw new AppError('接口编码不能为空', 400)

  const exists = await db('lowcode_custom_apis').where({ code }).first()
  if (exists) throw new AppError('接口编码已存在', 400)

  const path = data.path ? data.path.trim() : code

  const [id] = await db('lowcode_custom_apis').insert({
    code,
    name: data.name || code,
    method: (data.method || 'ALL').toUpperCase(),
    path,
    description: data.description || '',
    script: data.script || '',
    status: data.status ?? 1,
    is_public: data.isPublic ?? 0
  })
  return getCustomApiById(id)
}

export async function updateCustomApi(id: number, data: CustomApiForm) {
  const api = await getCustomApiById(id)
  const path = data.path ? data.path.trim() : api.path

  await db('lowcode_custom_apis').where({ id }).update({
    name: data.name ?? api.name,
    method: (data.method || api.method).toUpperCase(),
    path,
    description: data.description ?? api.description,
    script: data.script ?? api.script,
    status: data.status ?? api.status,
    is_public: data.isPublic ?? api.is_public,
    update_time: db.fn.now()
  })
  return getCustomApiById(id)
}

export async function deleteCustomApi(id: number) {
  const api = await getCustomApiById(id)
  await db('lowcode_custom_apis').where({ id }).del()
  return api
}

export async function executeApiById(id: number, ctx: any = {}) {
  const api = await getCustomApiById(id)
  if (api.status !== 1) throw new AppError('接口已禁用', 403)
  return runScript(api.script, { ctx })
}

export async function executeApiByPath(path: string, ctx: any = {}) {
  const api = await db('lowcode_custom_apis')
    .where(function () {
      this.where({ path }).orWhere({ code: path })
    })
    .andWhere('status', 1)
    .first()

  if (!api) throw new AppError('接口不存在或已禁用', 404)

  // 校验请求方法
  const method = (ctx.method || 'GET').toUpperCase()
  const apiMethod = (api.method || 'ALL').toUpperCase()
  if (apiMethod !== 'ALL' && apiMethod !== method) {
    throw new AppError(`请求方法不匹配，只允许 ${apiMethod}`, 405)
  }

  return runScript(api.script, { ctx })
}

export async function getCustomApiByPath(path: string) {
  return db('lowcode_custom_apis')
    .where(function () {
      this.where({ path }).orWhere({ code: path })
    })
    .first()
}
