import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as externalDatasourceService from './external-datasource.service'

export async function getExternalDataSources(_req: Request, res: Response) {
  const result = await externalDatasourceService.getExternalDataSources()
  res.json(success(result))
}

export async function getExternalDataSource(req: Request, res: Response) {
  const result = await externalDatasourceService.getExternalDataSource(Number(req.params.id))
  res.json(success(result))
}

export async function createExternalDataSource(req: Request, res: Response) {
  const result = await externalDatasourceService.createExternalDataSource(req.body)
  res.json(success(result, '创建成功'))
}

export async function updateExternalDataSource(req: Request, res: Response) {
  const result = await externalDatasourceService.updateExternalDataSource(Number(req.params.id), req.body)
  res.json(success(result, '更新成功'))
}

export async function deleteExternalDataSource(req: Request, res: Response) {
  await externalDatasourceService.deleteExternalDataSource(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function testExternalDataSource(req: Request, res: Response) {
  const result = await externalDatasourceService.testExternalDataSource(Number(req.params.id))
  res.json(success(result))
}

export async function executeExternalDataSource(req: Request, res: Response) {
  const result = await externalDatasourceService.executeExternalDataSource(Number(req.params.id), req.body || {})
  res.json(success(result))
}

export async function getExternalDataSourceOptions(req: Request, res: Response) {
  const ds = await externalDatasourceService.getExternalDataSource(Number(req.params.id))
  const config = ds.config as externalDatasourceService.ExternalDataSourceConfig
  const rows = await externalDatasourceService.executeExternalDataSource(Number(req.params.id), req.body || {})
  const options = externalDatasourceService.formatOptions(rows, config.labelField, config.valueField)
  res.json(success(options))
}
