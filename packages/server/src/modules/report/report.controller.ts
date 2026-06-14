import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as reportService from './report.service'

export async function getReports(_req: Request, res: Response) {
  const result = await reportService.getReports()
  res.json(success(result))
}

export async function getReport(req: Request, res: Response) {
  const result = await reportService.getReportByCode(req.params.code)
  res.json(success(result))
}

export async function saveReport(req: Request, res: Response) {
  const result = await reportService.saveReport(req.body)
  res.json(success(result, '保存成功'))
}

export async function deleteReport(req: Request, res: Response) {
  await reportService.deleteReport(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function executeReport(req: Request, res: Response) {
  const result = await reportService.executeReport(req.params.code, req.body, (req as AuthRequest).user)
  res.json(success(result))
}

export async function exportReportExcel(req: Request, res: Response) {
  const buffer = await reportService.exportReportExcel(req.params.code, req.body, (req as AuthRequest).user)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.code}.xlsx`)
  res.send(buffer)
}
