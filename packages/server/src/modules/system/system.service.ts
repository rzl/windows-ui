import { db } from '../../db'
import { AppError } from '../../utils/response'

// 字典 CRUD
export async function getDicts() {
  return db('dicts').orderBy('id', 'desc')
}

export async function getDictById(id: number) {
  const dict = await db('dicts').where({ id }).first()
  if (!dict) throw new AppError('字典不存在', 404)
  const items = await db('dict_items')
    .where({ dict_id: id })
    .where('status', 1)
    .orderBy('sort', 'asc')
  return { ...dict, items }
}

export async function getDictByCode(code: string) {
  const dict = await db('dicts').where({ code }).first()
  if (!dict) throw new AppError('字典不存在', 404)
  const items = await db('dict_items')
    .where({ dict_id: dict.id })
    .where('status', 1)
    .orderBy('sort', 'asc')
  return { ...dict, items }
}

export async function createDict(data: any) {
  const exists = await db('dicts').where({ code: data.code }).first()
  if (exists) throw new AppError('字典编码已存在', 400)

  const [id] = await db('dicts').insert({
    name: data.name,
    code: data.code,
    description: data.description,
    status: data.status ?? 1
  })
  return db('dicts').where({ id }).first()
}

export async function updateDict(id: number, data: any) {
  const dict = await db('dicts').where({ id }).first()
  if (!dict) throw new AppError('字典不存在', 404)

  const exists = await db('dicts')
    .where({ code: data.code })
    .whereNot('id', id)
    .first()
  if (exists) throw new AppError('字典编码已存在', 400)

  await db('dicts').where({ id }).update({
    name: data.name,
    code: data.code,
    description: data.description,
    status: data.status
  })
  return db('dicts').where({ id }).first()
}

export async function deleteDict(id: number) {
  await db('dict_items').where({ dict_id: id }).del()
  await db('dicts').where({ id }).del()
  return true
}

// 字典项 CRUD
export async function createDictItem(data: any) {
  const dict = await db('dicts').where({ id: data.dictId }).first()
  if (!dict) throw new AppError('字典不存在', 404)

  const [id] = await db('dict_items').insert({
    dict_id: data.dictId,
    label: data.label,
    value: data.value,
    sort: data.sort ?? 0,
    status: data.status ?? 1
  })
  return db('dict_items').where({ id }).first()
}

export async function updateDictItem(id: number, data: any) {
  const item = await db('dict_items').where({ id }).first()
  if (!item) throw new AppError('字典项不存在', 404)

  await db('dict_items').where({ id }).update({
    label: data.label,
    value: data.value,
    sort: data.sort,
    status: data.status
  })
  return db('dict_items').where({ id }).first()
}

export async function deleteDictItem(id: number) {
  await db('dict_items').where({ id }).del()
  return true
}
