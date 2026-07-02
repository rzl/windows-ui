import type { Response, NextFunction } from 'express'
import type { AuthRequest } from '../../middleware/auth'
import * as service from './field-permission.service'
import { success } from '../../utils/response'

export async function getRules(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.getFieldPermissionRules(req, req.query)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function getRuleById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.getFieldPermissionRuleById(req, Number(req.params.id))
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function createRule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.createFieldPermissionRule(req, req.body)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function updateRule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await service.updateFieldPermissionRule(req, Number(req.params.id), req.body)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function deleteRule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await service.deleteFieldPermissionRule(req, Number(req.params.id))
    res.json(success(true))
  } catch (err) {
    next(err)
  }
}
