import type { Response } from 'express'
import { success, error } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import { isSuperAdmin } from '../../utils/tenant'
import * as tenantService from './tenant.service'

export async function getTenants(_req: AuthRequest, res: Response) {
  const result = await tenantService.getTenants()
  res.json(success(result))
}

export async function getTenant(req: AuthRequest, res: Response) {
  const result = await tenantService.getTenantById(Number(req.params.id))
  res.json(success(result))
}

export async function createTenant(req: AuthRequest, res: Response) {
  if (!isSuperAdmin(req.user)) {
    return res.status(200).json(error('仅超级管理员可创建租户', 403))
  }
  const result = await tenantService.createTenant(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateTenant(req: AuthRequest, res: Response) {
  if (!isSuperAdmin(req.user)) {
    return res.status(200).json(error('仅超级管理员可编辑租户', 403))
  }
  const result = await tenantService.updateTenant(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteTenant(req: AuthRequest, res: Response) {
  if (!isSuperAdmin(req.user)) {
    return res.status(200).json(error('仅超级管理员可删除租户', 403))
  }
  await tenantService.deleteTenant(Number(req.params.id))
  res.json(success(null, '删除成功'))
}
