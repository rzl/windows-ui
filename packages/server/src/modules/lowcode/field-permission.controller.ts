import type { Request, Response, NextFunction } from 'express'
import * as service from './field-permission.service'
import { success } from '../../utils/response'

export async function getRules(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.getFieldPermissionRules(req.query)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function getRuleById(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.getFieldPermissionRuleById(Number(req.params.id))
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function createRule(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.createFieldPermissionRule(req.body)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function updateRule(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.updateFieldPermissionRule(Number(req.params.id), req.body)
    res.json(success(result))
  } catch (err) {
    next(err)
  }
}

export async function deleteRule(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteFieldPermissionRule(Number(req.params.id))
    res.json(success(true))
  } catch (err) {
    next(err)
  }
}
