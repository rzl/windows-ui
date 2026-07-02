import type { Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as relationService from './relation.service'

export async function getRelations(req: AuthRequest, res: Response) {
  const result = await relationService.getRelations(req, req.query)
  res.json(success(result))
}

export async function getRelationById(req: AuthRequest, res: Response) {
  const result = await relationService.getRelationById(req, Number(req.params.id))
  res.json(success(result))
}

export async function createRelation(req: AuthRequest, res: Response) {
  const result = await relationService.createRelation(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateRelation(req: AuthRequest, res: Response) {
  const result = await relationService.updateRelation(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteRelation(req: AuthRequest, res: Response) {
  await relationService.deleteRelation(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function getRelationOptions(req: AuthRequest, res: Response) {
  const result = await relationService.getRelationOptions(req, req.params.code, req.query)
  res.json(success(result))
}
