import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as auditService from './audit.service'

export async function getAuditLogs(req: Request, res: Response) {
  const result = await auditService.getAuditLogs(req.query as any)
  res.json(success(result))
}

export async function getAuditLogDetail(req: Request, res: Response) {
  const result = await auditService.getAuditLogDetail(Number(req.params.id))
  res.json(success(result))
}

export async function getAuditActions(_req: Request, res: Response) {
  const result = await auditService.getAuditActions()
  res.json(success(result))
}
