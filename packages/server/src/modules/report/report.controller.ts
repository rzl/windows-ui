import type { Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as reportService from './report.service'

export async function getReports(req: AuthRequest, res: Response) {
  const result = await reportService.getReports(req)
  res.json(success(result))
}

export async function getReport(req: AuthRequest, res: Response) {
  const result = await reportService.getReportByCode(req, req.params.code)
  res.json(success(result))
}

export async function saveReport(req: AuthRequest, res: Response) {
  const result = await reportService.saveReport(req, req.body)
  res.json(success(result, '保存成功'))
}

export async function deleteReport(req: AuthRequest, res: Response) {
  await reportService.deleteReport(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function executeReport(req: AuthRequest, res: Response) {
  const result = await reportService.executeReport(req, req.params.code, req.body, req.user)
  res.json(success(result))
}

export async function exportReportExcel(req: AuthRequest, res: Response) {
  const buffer = await reportService.exportReportExcel(req, req.params.code, req.body, req.user)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.code}.xlsx`)
  res.send(buffer)
}
