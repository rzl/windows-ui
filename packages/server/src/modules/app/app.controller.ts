import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as appService from './app.service'

export async function getApps(_req: Request, res: Response) {
  const result = await appService.getApps()
  res.json(success(result))
}

export async function getApp(req: Request, res: Response) {
  const result = await appService.getAppByCode(req.params.code)
  res.json(success(result))
}

export async function saveApp(req: Request, res: Response) {
  const result = await appService.saveApp(req.body)
  res.json(success(result, '保存成功'))
}

export async function deleteApp(req: Request, res: Response) {
  await appService.deleteApp(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function createSnapshot(req: Request, res: Response) {
  const result = await appService.createSnapshot(Number(req.params.id), req.body)
  res.json(success(result, '快照已创建'))
}

export async function publishVersion(req: Request, res: Response) {
  const result = await appService.publishVersion(Number(req.params.id), Number(req.body.versionId))
  res.json(success(result, '版本已发布'))
}

export async function rollbackVersion(req: Request, res: Response) {
  const result = await appService.rollbackVersion(Number(req.params.id), Number(req.body.versionId))
  res.json(success(result, '已回滚到指定版本'))
}

export async function getAppVersions(req: Request, res: Response) {
  const result = await appService.getAppVersions(Number(req.params.id))
  res.json(success(result))
}

export async function exportApp(req: Request, res: Response) {
  const result = await appService.exportApp(Number(req.params.id))
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', `attachment; filename=${result.code}.json`)
  res.send(JSON.stringify(result, null, 2))
}

export async function importApp(req: Request, res: Response) {
  const result = await appService.importApp(req.body)
  res.json(success(result, '导入成功'))
}
