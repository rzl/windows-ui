import { db } from '../../db'
import { AppError } from '../../utils/response'

export async function getSavedQueries(modelCode: string, userId: number) {
  return db('lowcode_saved_queries')
    .where({ model_code: modelCode, user_id: userId })
    .orderBy('is_default', 'desc')
    .orderBy('id', 'desc')
}

export async function getSavedQueryById(modelCode: string, id: number, userId: number) {
  return db('lowcode_saved_queries').where({ id, model_code: modelCode, user_id: userId }).first()
}

export async function createSavedQuery(modelCode: string, userId: number, data: any) {
  if (!data.name) throw new AppError('查询名称不能为空', 400)
  const [id] = await db('lowcode_saved_queries').insert({
    model_code: modelCode,
    user_id: userId,
    name: data.name,
    config: JSON.stringify(data.config || {}),
    is_default: data.isDefault ? 1 : 0,
    create_time: db.fn.now(),
    update_time: db.fn.now()
  })
  if (data.isDefault) {
    await clearOtherDefaults(modelCode, userId, id)
  }
  return getSavedQueryById(modelCode, id, userId)
}

export async function updateSavedQuery(modelCode: string, id: number, userId: number, data: any) {
  const query = await getSavedQueryById(modelCode, id, userId)
  if (!query) throw new AppError('查询不存在', 404)

  const updateData: any = { update_time: db.fn.now() }
  if (data.name !== undefined) updateData.name = data.name
  if (data.config !== undefined) updateData.config = JSON.stringify(data.config)
  if (data.isDefault !== undefined) updateData.is_default = data.isDefault ? 1 : 0

  await db('lowcode_saved_queries').where({ id }).update(updateData)

  if (data.isDefault) {
    await clearOtherDefaults(modelCode, userId, id)
  }

  return getSavedQueryById(modelCode, id, userId)
}

export async function deleteSavedQuery(modelCode: string, id: number, userId: number) {
  const query = await getSavedQueryById(modelCode, id, userId)
  if (!query) throw new AppError('查询不存在', 404)
  await db('lowcode_saved_queries').where({ id }).del()
  return true
}

export async function setDefaultSavedQuery(modelCode: string, id: number, userId: number) {
  const query = await getSavedQueryById(modelCode, id, userId)
  if (!query) throw new AppError('查询不存在', 404)
  await db('lowcode_saved_queries').where({ id }).update({ is_default: 1, update_time: db.fn.now() })
  await clearOtherDefaults(modelCode, userId, id)
  return getSavedQueryById(modelCode, id, userId)
}

async function clearOtherDefaults(modelCode: string, userId: number, exceptId: number) {
  await db('lowcode_saved_queries')
    .where({ model_code: modelCode, user_id: userId })
    .whereNot('id', exceptId)
    .update({ is_default: 0 })
}
