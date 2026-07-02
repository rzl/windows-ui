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
export async function getDictCategories(req: AuthRequest, res: Response) {
  const result = await systemService.getDictCategories(req)
  res.json(success(result))
}

export async function createDictCategory(req: AuthRequest, res: Response) {
  const result = await systemService.createDictCategory(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDictCategory(req: AuthRequest, res: Response) {
  const result = await systemService.updateDictCategory(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDictCategory(req: AuthRequest, res: Response) {
  await systemService.deleteDictCategory(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 公告
export async function getNotices(req: AuthRequest, res: Response) {
  const result = await systemService.getNotices(req)
  res.json(success(result))
}

export async function createNotice(req: AuthRequest, res: Response) {
  const result = await systemService.createNotice(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateNotice(req: AuthRequest, res: Response) {
  const result = await systemService.updateNotice(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteNotice(req: AuthRequest, res: Response) {
  await systemService.deleteNotice(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

// 职务
export async function getPositions(req: AuthRequest, res: Response) {
  const result = await systemService.getPositions(req)
  res.json(success(result))
}

export async function createPosition(req: AuthRequest, res: Response) {
  const result = await systemService.createPosition(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updatePosition(req: AuthRequest, res: Response) {
  const result = await systemService.updatePosition(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deletePosition(req: AuthRequest, res: Response) {
  await systemService.deletePosition(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}
