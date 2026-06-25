import type { Request, Response, NextFunction } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as service from './model-version.service'

export async function getVersions(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.getModelVersions(Number(req.params.id))
    res.json(success(result))
  } catch (error) {
    next(error)
  }
}

export async function createVersion(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.createModelVersion(Number(req.params.id), req.body)
    res.json(success(result, '快照创建成功'))
  } catch (error) {
    next(error)
  }
}

export async function rollbackVersion(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.rollbackModelVersion(Number(req.params.id), Number(req.params.versionId))
    res.json(success(result, '回滚成功'))
  } catch (error) {
    next(error)
  }
}

export async function deleteVersion(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await service.deleteModelVersion(Number(req.params.id), Number(req.params.versionId))
    res.json(success(null, '删除成功'))
  } catch (error) {
    next(error)
  }
}
