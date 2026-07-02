import type { Response } from 'express'
import type { AuthRequest } from '../../middleware/auth'
import { success } from '../../utils/response'
import * as auditService from './audit.service'

export async function getAuditLogs(req: AuthRequest, res: Response) {
  const result = await auditService.getAuditLogs(req, req.query as any)
  res.json(success(result))
}

export async function getAuditLogDetail(req: AuthRequest, res: Response) {
  const result = await auditService.getAuditLogDetail(req, Number(req.params.id))
  res.json(success(result))
}

export async function getAuditActions(_req: AuthRequest, res: Response) {
  const result = await auditService.getAuditActions()
  res.json(success(result))
}
