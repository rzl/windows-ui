import { db } from '../../db'
import { AppError } from '../../utils/response'

export interface TenantForm {
  id?: number
  name?: string
  code?: string
  description?: string
  status?: number
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

export async function getTenants() {
  return db('tenants').orderBy('id', 'desc')
}

export async function getTenantById(id: number) {
  const tenant = await db('tenants').where({ id }).first()
  if (!tenant) throw new AppError('租户不存在', 404)
  return tenant
}

export async function createTenant(data: TenantForm) {
  const code = safeCode(data.code || data.name || '')
  if (!code) throw new AppError('租户编码不能为空', 400)

  const exists = await db('tenants').where({ code }).first()
  if (exists) throw new AppError('租户编码已存在', 400)

  const [id] = await db('tenants').insert({
    name: data.name,
    code,
    description: data.description,
    status: data.status ?? 1
  })
  return getTenantById(id)
}

export async function updateTenant(id: number, data: TenantForm) {
  const tenant = await getTenantById(id)

  const exists = await db('tenants')
    .where({ code: data.code })
    .whereNot('id', id)
    .first()
  if (exists) throw new AppError('租户编码已存在', 400)

  await db('tenants').where({ id }).update({
    name: data.name ?? tenant.name,
    code: data.code ?? tenant.code,
    description: data.description,
    status: data.status ?? tenant.status,
    update_time: db.fn.now()
  })
  return getTenantById(id)
}

export async function deleteTenant(id: number) {
  if (id === 1) {
    throw new AppError('默认租户不可删除', 400)
  }
  await db('tenants').where({ id }).del()
  return true
}
