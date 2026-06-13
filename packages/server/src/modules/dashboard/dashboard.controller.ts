import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as dashboardService from './dashboard.service'

export async function getStats(_req: Request, res: Response) {
  const result = await dashboardService.getStats()
  res.json(success(result))
}

export async function getHomepageConfig(req: Request, res: Response) {
  const result = await dashboardService.getHomepageConfig(req.query.code as string)
  res.json(success(result))
}

export async function saveHomepageConfig(req: Request, res: Response) {
  const result = await dashboardService.saveHomepageConfig(req.body)
  res.json(success(result, '保存成功'))
}

export async function getDashboards(_req: Request, res: Response) {
  const result = await dashboardService.getDashboards()
  res.json(success(result))
}

export async function getDashboard(req: Request, res: Response) {
  const result = await dashboardService.getDashboardByCode(req.params.code)
  res.json(success(result))
}

export async function createDashboard(req: Request, res: Response) {
  const result = await dashboardService.createDashboard(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateDashboard(req: Request, res: Response) {
  const result = await dashboardService.updateDashboard(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteDashboard(req: Request, res: Response) {
  await dashboardService.deleteDashboard(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function executeDataSource(req: Request, res: Response) {
  const result = await dashboardService.executeDataSource(req.body.dataSource || {}, req.body.ctx || {})
  res.json(success(result))
}
