import { db } from '../../db'
import { AppError } from '../../utils/response'
import { tenantWhere, setTenantId } from '../../utils/tenant'
import type { AuthRequest } from '../../middleware/auth'
import { newId } from '../../utils/id'

export async function getSavedQueries(req: AuthRequest, modelCode: string, userId: string) {
  return db('lowcode_saved_queries')
    .where({ model_code: modelCode, user_id: userId })
    .where(tenantWhere(req))
    .orderBy('is_default', 'desc')
    .orderBy('id', 'desc')
}

export async function getSavedQueryById(req: AuthRequest, modelCode: string, id: string, userId: string) {
  return db('lowcode_saved_queries')
    .where({ id, model_code: modelCode, user_id: userId })
    .where(tenantWhere(req))
    .first()
}

export async function createSavedQuery(req: AuthRequest, modelCode: string, userId: string, data: any) {
  if (!data.name) throw new AppError('查询名称不能为空', 400)
  const insertData = setTenantId({
    model_code: modelCode,
    user_id: userId,
    name: data.name,
    config: JSON.stringify(data.config || {}),
    is_default: data.isDefault ? 1 : 0,
    create_time: db.fn.now(),
    update_time: db.fn.now()
  }, req)
  const id = newId()
  await db('lowcode_saved_queries').insert({ id, ...insertData })
  if (data.isDefault) {
    await clearOtherDefaults(req, modelCode, userId, id)
  }
  return getSavedQueryById(req, modelCode, id, userId)
}

export async function updateSavedQuery(req: AuthRequest, modelCode: string, id: string, userId: string, data: any) {
  const query = await getSavedQueryById(req, modelCode, id, userId)
  if (!query) throw new AppError('查询不存在', 404)

  const updateData: any = setTenantId({
    update_time: db.fn.now()
  }, req)
  if (data.name !== undefined) updateData.name = data.name
  if (data.config !== undefined) updateData.config = JSON.stringify(data.config)
  if (data.isDefault !== undefined) updateData.is_default = data.isDefault ? 1 : 0

  await db('lowcode_saved_queries')
    .where({ id })
    .where(tenantWhere(req))
    .update(updateData)

  if (data.isDefault) {
    await clearOtherDefaults(req, modelCode, userId, id)
  }

  return getSavedQueryById(req, modelCode, id, userId)
}

export async function deleteSavedQuery(req: AuthRequest, modelCode: string, id: string, userId: string) {
  const query = await getSavedQueryById(req, modelCode, id, userId)
  if (!query) throw new AppError('查询不存在', 404)
  await db('lowcode_saved_queries')
    .where({ id })
    .where(tenantWhere(req))
    .del()
  return true
}

export async function setDefaultSavedQuery(req: AuthRequest, modelCode: string, id: string, userId: string) {
  const query = await getSavedQueryById(req, modelCode, id, userId)
  if (!query) throw new AppError('查询不存在', 404)
  await db('lowcode_saved_queries')
    .where({ id })
    .where(tenantWhere(req))
    .update(setTenantId({ is_default: 1, update_time: db.fn.now() }, req))
  await clearOtherDefaults(req, modelCode, userId, id)
  return getSavedQueryById(req, modelCode, id, userId)
}

async function clearOtherDefaults(req: AuthRequest, modelCode: string, userId: string, exceptId: string) {
  await db('lowcode_saved_queries')
    .where({ model_code: modelCode, user_id: userId })
    .where(tenantWhere(req))
    .whereNot('id', exceptId)
    .update({ is_default: 0 })
}
