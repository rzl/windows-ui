import type { Request, Response, NextFunction } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as service from './saved-query.service'

function getUserId(req: AuthRequest) {
  return Number(req.user?.id || 0)
}

export async function getSavedQueries(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.getSavedQueries(req, req.params.modelCode, getUserId(req))
    res.json(success(result))
  } catch (error) {
    next(error)
  }
}

export async function createSavedQuery(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.createSavedQuery(req, req.params.modelCode, getUserId(req), req.body)
    res.json(success(result, '保存成功'))
  } catch (error) {
    next(error)
  }
}

export async function updateSavedQuery(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.updateSavedQuery(req, req.params.modelCode, Number(req.params.id), getUserId(req), req.body)
    res.json(success(result, '更新成功'))
  } catch (error) {
    next(error)
  }
}

export async function deleteSavedQuery(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await service.deleteSavedQuery(req, req.params.modelCode, Number(req.params.id), getUserId(req))
    res.json(success(null, '删除成功'))
  } catch (error) {
    next(error)
  }
}

export async function setDefaultSavedQuery(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.setDefaultSavedQuery(req, req.params.modelCode, Number(req.params.id), getUserId(req))
    res.json(success(result, '设置成功'))
  } catch (error) {
    next(error)
  }
}
