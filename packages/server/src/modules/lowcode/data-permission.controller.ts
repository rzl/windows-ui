import type { Response, NextFunction } from 'express'
import * as service from './data-permission.service'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'

export async function getRules(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.getDataPermissionRules(req, req.query)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function getRuleById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.getDataPermissionRuleById(req, Number(req.params.id))
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function createRule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.createDataPermissionRule(req, req.body)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function updateRule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.updateDataPermissionRule(req, Number(req.params.id), req.body)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function deleteRule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await service.deleteDataPermissionRule(req, Number(req.params.id))
    res.json(success(true))
  } catch (err) {
    next(err)
  }
}
