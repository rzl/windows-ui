import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as systemService from './system.service'

// 字典
export async function getDicts(_req: Request, res: Response) {
  const result = await systemService.getDicts()
  res.json(success(result))
}

export async function getDict(req: Request, res: Response) {
  const result = await systemService.getDictById(Number(req.params.id))
  res.json(success(result))
}

export async function getDictByCode(req: Request, res: Response) {
  const result = await systemService.getDictByCode(req.params.code)
  res.json(success(result))
}

export async function createDict(req: Request, res: Response) {
  const result = await systemService.createDict(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDict(req: Request, res: Response) {
  const result = await systemService.updateDict(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDict(req: Request, res: Response) {
  await systemService.deleteDict(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 字典项
export async function createDictItem(req: Request, res: Response) {
  const result = await systemService.createDictItem(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDictItem(req: Request, res: Response) {
  const result = await systemService.updateDictItem(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDictItem(req: Request, res: Response) {
  await systemService.deleteDictItem(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 字典分类
export async function getDictCategories(_req: Request, res: Response) {
  const result = await systemService.getDictCategories()
  res.json(success(result))
}

export async function createDictCategory(req: Request, res: Response) {
  const result = await systemService.createDictCategory(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDictCategory(req: Request, res: Response) {
  const result = await systemService.updateDictCategory(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDictCategory(req: Request, res: Response) {
  await systemService.deleteDictCategory(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 公告
export async function getNotices(_req: Request, res: Response) {
  const result = await systemService.getNotices()
  res.json(success(result))
}

export async function createNotice(req: Request, res: Response) {
  const result = await systemService.createNotice(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateNotice(req: Request, res: Response) {
  const result = await systemService.updateNotice(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteNotice(req: Request, res: Response) {
  await systemService.deleteNotice(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 职务
export async function getPositions(_req: Request, res: Response) {
  const result = await systemService.getPositions()
  res.json(success(result))
}

export async function createPosition(req: Request, res: Response) {
  const result = await systemService.createPosition(req.body)
  res.json(success(result, '创建成功'))
}

export async function updatePosition(req: Request, res: Response) {
  const result = await systemService.updatePosition(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deletePosition(req: Request, res: Response) {
  await systemService.deletePosition(Number(req.params.id))
  res.json(success(null, '删除成功'))
}
