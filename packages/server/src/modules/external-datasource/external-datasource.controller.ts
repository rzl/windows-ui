import type { Response } from 'express'
import type { AuthRequest } from '../../middleware/auth'
import { success } from '../../utils/response'
import * as externalDatasourceService from './external-datasource.service'

export async function getExternalDataSources(req: AuthRequest, res: Response) {
  const result = await externalDatasourceService.getExternalDataSources(req)
  res.json(success(result))
}

export async function getExternalDataSource(req: AuthRequest, res: Response) {
  const result = await externalDatasourceService.getExternalDataSource(req, Number(req.params.id))
  res.json(success(result))
}

export async function createExternalDataSource(req: AuthRequest, res: Response) {
  const result = await externalDatasourceService.createExternalDataSource(req, req.body)
  res.json(success(result, '创建成功'))
}

export async function updateExternalDataSource(req: AuthRequest, res: Response) {
  const result = await externalDatasourceService.updateExternalDataSource(req, Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteExternalDataSource(req: AuthRequest, res: Response) {
  await externalDatasourceService.deleteExternalDataSource(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function testExternalDataSource(req: AuthRequest, res: Response) {
  const result = await externalDatasourceService.testExternalDataSource(req, Number(req.params.id))
  res.json(success(result))
}

export async function executeExternalDataSource(req: AuthRequest, res: Response) {
  const result = await externalDatasourceService.executeExternalDataSource(req, Number(req.params.id), req.body || {})
  res.json(success(result))
}

export async function getExternalDataSourceOptions(req: AuthRequest, res: Response) {
  const ds = await externalDatasourceService.getExternalDataSource(req, Number(req.params.id))
  const config = ds.config as externalDatasourceService.ExternalDataSourceConfig
  const rows = await externalDatasourceService.executeExternalDataSource(req, Number(req.params.id), req.body || {})
  const options = externalDatasourceService.formatOptions(rows, config.labelField, config.valueField)
  res.json(success(options))
}
