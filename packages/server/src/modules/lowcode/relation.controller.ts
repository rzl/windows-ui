import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as relationService from './relation.service'

export async function getRelations(req: Request, res: Response) {
  const result = await relationService.getRelations(req.query)
  res.json(success(result))
}

export async function getRelationById(req: Request, res: Response) {
  const result = await relationService.getRelationById(Number(req.params.id))
  res.json(success(result))
}

export async function createRelation(req: Request, res: Response) {
  const result = await relationService.createRelation(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateRelation(req: Request, res: Response) {
  const result = await relationService.updateRelation(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteRelation(req: Request, res: Response) {
  await relationService.deleteRelation(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function getRelationOptions(req: Request, res: Response) {
  const result = await relationService.getRelationOptions(req.params.code, req.query)
  res.json(success(result))
}
