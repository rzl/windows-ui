import type { Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as systemService from './system.service'

// 字典
export async function getDicts(req: AuthRequest, res: Response) {
  const result = await systemService.getDicts(req)
  res.json(success(result))
}

export async function getDict(req: AuthRequest, res: Response) {
  const result = await systemService.getDictById(req, Number(req.params.id))
  res.json(success(result))
}

export async function getDictByCode(req: AuthRequest, res: Response) {
  const result = await systemService.getDictByCode(req, req.params.code)
  res.json(success(result))
}

export async function createDict(req: AuthRequest, res: Response) {
  const result = await systemService.createDict(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDict(req: AuthRequest, res: Response) {
  const result = await systemService.updateDict(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDict(req: AuthRequest, res: Response) {
  await systemService.deleteDict(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 字典项
export async function createDictItem(req: AuthRequest, res: Response) {
  const result = await systemService.createDictItem(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDictItem(req: AuthRequest, res: Response) {
  const result = await systemService.updateDictItem(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDictItem(req: AuthRequest, res: Response) {
  await systemService.deleteDictItem(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 字典分类
export async function getDictCategories(_req: AuthRequest, res: Response) {
  const result = await systemService.getDictCategories()
  res.json(success(result))
}

export async function createDictCategory(req: AuthRequest, res: Response) {
  const result = await systemService.createDictCategory(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDictCategory(req: AuthRequest, res: Response) {
  const result = await systemService.updateDictCategory(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDictCategory(req: AuthRequest, res: Response) {
  await systemService.deleteDictCategory(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 公告
export async function getNotices(_req: AuthRequest, res: Response) {
  const result = await systemService.getNotices()
  res.json(success(result))
}

export async function createNotice(req: AuthRequest, res: Response) {
  const result = await systemService.createNotice(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateNotice(req: AuthRequest, res: Response) {
  const result = await systemService.updateNotice(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteNotice(req: AuthRequest, res: Response) {
  await systemService.deleteNotice(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 职务
export async function getPositions(_req: AuthRequest, res: Response) {
  const result = await systemService.getPositions()
  res.json(success(result))
}

export async function createPosition(req: AuthRequest, res: Response) {
  const result = await systemService.createPosition(req.body)
  res.json(success(result, '创建成功'))
}

export async function updatePosition(req: AuthRequest, res: Response) {
  const result = await systemService.updatePosition(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deletePosition(req: AuthRequest, res: Response) {
  await systemService.deletePosition(Number(req.params.id))
  res.json(success(null, '删除成功'))
}
