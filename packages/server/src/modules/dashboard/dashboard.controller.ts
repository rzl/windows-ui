import type { Response } from 'express'
import type { AuthRequest } from '../../middleware/auth'
import { success } from '../../utils/response'
import * as dashboardService from './dashboard.service'

export async function getStats(req: AuthRequest, res: Response) {
  const widgets = Array.isArray(req.body?.widgets) ? req.body.widgets : []
  const result = await dashboardService.getStats(req, widgets)
  res.json(success(result))
}

export async function getHomepageConfig(req: AuthRequest, res: Response) {
  const result = await dashboardService.getHomepageConfig(req, req.query.code as string)
  res.json(success(result))
}

export async function saveHomepageConfig(req: AuthRequest, res: Response) {
  const result = await dashboardService.saveHomepageConfig(req, req.body)
  res.json(success(result, '保存成功'))
}

export async function getDashboards(req: AuthRequest, res: Response) {
  const result = await dashboardService.getDashboards(req)
  res.json(success(result))
}

export async function getDashboard(req: AuthRequest, res: Response) {
  const result = await dashboardService.getDashboardByCode(req, req.params.code)
  res.json(success(result))
}

export async function createDashboard(req: AuthRequest, res: Response) {
  const result = await dashboardService.createDashboard(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDashboard(req: AuthRequest, res: Response) {
  const result = await dashboardService.updateDashboard(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDashboard(req: AuthRequest, res: Response) {
  await dashboardService.deleteDashboard(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function executeDataSource(req: AuthRequest, res: Response) {
  const result = await dashboardService.executeDataSource(req.body.dataSource || {}, req.body.ctx || {})
  res.json(success(result))
}
