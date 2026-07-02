import { db } from '../../db'
import { AppError } from '../../utils/response'
import { tenantWhere, setTenantId } from '../../utils/tenant'
import type { AuthRequest } from '../../middleware/auth'

// 字典 CRUD
export async function getDicts(req: AuthRequest) {
  return db('dicts')
    .leftJoin('dict_categories', 'dicts.category_id', 'dict_categories.id')
    .where(tenantWhere(req))
    .select('dicts.*', 'dict_categories.name as category_name')
    .orderBy('dicts.id', 'desc')
}

export async function getDictById(req: AuthRequest, id: number) {
  const dict = await db('dicts').where({ id }).where(tenantWhere(req)).first()
  if (!dict) throw new AppError('字典不存在', 404)
  const items = await db('dict_items')
    .where({ dict_id: id })
    .where(tenantWhere(req))
    .where('status', 1)
    .orderBy('sort', 'asc')
  return { ...dict, items }
}

export async function getDictByCode(req: AuthRequest, code: string) {
  const dict = await db('dicts').where({ code }).where(tenantWhere(req)).first()
  if (!dict) throw new AppError('字典不存在', 404)
  const items = await db('dict_items')
    .where({ dict_id: dict.id })
    .where(tenantWhere(req))
    .where('status', 1)
    .orderBy('sort', 'asc')
  return { ...dict, items }
}

export async function createDict(req: AuthRequest, data: any) {
  const exists = await db('dicts').where({ code: data.code }).where(tenantWhere(req)).first()
  if (exists) throw new AppError('字典编码已存在', 400)

  const insertData = setTenantId({
    name: data.name,
    code: data.code,
    description: data.description,
    category_id: data.categoryId || null,
    status: data.status ?? 1
  }, req)
  const [id] = await db('dicts').insert(insertData)
  return db('dicts').where({ id }).first()
}

export async function updateDict(req: AuthRequest, id: number, data: any) {
  const dict = await db('dicts').where({ id }).where(tenantWhere(req)).first()
  if (!dict) throw new AppError('字典不存在', 404)

  const exists = await db('dicts')
    .where({ code: data.code })
    .whereNot('id', id)
    .where(tenantWhere(req))
    .first()
  if (exists) throw new AppError('字典编码已存在', 400)

  await db('dicts').where({ id }).where(tenantWhere(req)).update({
    name: data.name,
    code: data.code,
    description: data.description,
    category_id: data.categoryId || null,
    status: data.status
  })
  return db('dicts').where({ id }).first()
}

export async function deleteDict(req: AuthRequest, id: number) {
  await db('dict_items').where({ dict_id: id }).where(tenantWhere(req)).del()
  await db('dicts').where({ id }).where(tenantWhere(req)).del()
  return true
}

// 字典项 CRUD
export async function createDictItem(req: AuthRequest, data: any) {
  const dict = await db('dicts').where({ id: data.dictId }).where(tenantWhere(req)).first()
  if (!dict) throw new AppError('字典不存在', 404)

  const insertData = setTenantId({
    dict_id: data.dictId,
    label: data.label,
    value: data.value,
    sort: data.sort ?? 0,
    status: data.status ?? 1
  }, req)
  const [id] = await db('dict_items').insert(insertData)
  return db('dict_items').where({ id }).first()
}

export async function updateDictItem(req: AuthRequest, id: number, data: any) {
  const item = await db('dict_items').where({ id }).where(tenantWhere(req)).first()
  if (!item) throw new AppError('字典项不存在', 404)

  await db('dict_items').where({ id }).where(tenantWhere(req)).update({
    label: data.label,
    value: data.value,
    sort: data.sort,
    status: data.status
  })
  return db('dict_items').where({ id }).first()
}

export async function deleteDictItem(req: AuthRequest, id: number) {
  await db('dict_items').where({ id }).where(tenantWhere(req)).del()
  return true
}

// 字典分类 CRUD
export async function getDictCategories() {
  return db('dict_categories').where('status', 1).orderBy('sort', 'asc')
}

export async function createDictCategory(data: any) {
  const exists = await db('dict_categories').where({ code: data.code }).first()
  if (exists) throw new AppError('分类编码已存在', 400)
  const [id] = await db('dict_categories').insert({
    code: data.code,
    name: data.name,
    sort: data.sort ?? 0,
    status: data.status ?? 1
  })
  return db('dict_categories').where({ id }).first()
}

export async function updateDictCategory(id: number, data: any) {
  const category = await db('dict_categories').where({ id }).first()
  if (!category) throw new AppError('字典分类不存在', 404)
  await db('dict_categories').where({ id }).update({
    code: data.code,
    name: data.name,
    sort: data.sort,
    status: data.status
  })
  return db('dict_categories').where({ id }).first()
}

export async function deleteDictCategory(id: number) {
  await db('dict_categories').where({ id }).del()
  return true
}

// 公告 CRUD
export async function getNotices() {
  return db('notices').orderBy('sort', 'asc').orderBy('id', 'desc')
}

export async function createNotice(data: any) {
  const [id] = await db('notices').insert({
    title: data.title,
    content: data.content,
    type: data.type || 'notice',
    status: data.status ?? 1,
    sort: data.sort ?? 0,
    publish_time: data.publishTime || null
  })
  return db('notices').where({ id }).first()
}

export async function updateNotice(id: number, data: any) {
  const notice = await db('notices').where({ id }).first()
  if (!notice) throw new AppError('公告不存在', 404)
  await db('notices').where({ id }).update({
    title: data.title,
    content: data.content,
    type: data.type || 'notice',
    status: data.status,
    sort: data.sort,
    publish_time: data.publishTime || null,
    update_time: db.fn.now()
  })
  return db('notices').where({ id }).first()
}

export async function deleteNotice(id: number) {
  await db('notices').where({ id }).del()
  return true
}

// 职务 CRUD
export async function getPositions() {
  return db('positions').orderBy('sort', 'asc').orderBy('id', 'desc')
}

export async function createPosition(data: any) {
  const exists = await db('positions').where({ code: data.code }).first()
  if (exists) throw new AppError('职务编码已存在', 400)
  const [id] = await db('positions').insert({
    code: data.code,
    name: data.name,
    sort: data.sort ?? 0,
    status: data.status ?? 1
  })
  return db('positions').where({ id }).first()
}

export async function updatePosition(id: number, data: any) {
  const position = await db('positions').where({ id }).first()
  if (!position) throw new AppError('职务不存在', 404)
  await db('positions').where({ id }).update({
    code: data.code,
    name: data.name,
    sort: data.sort,
    status: data.status,
    update_time: db.fn.now()
  })
  return db('positions').where({ id }).first()
}

export async function deletePosition(id: number) {
  await db('positions').where({ id }).del()
  return true
}
