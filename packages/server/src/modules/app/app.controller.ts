import type { Response } from 'express'
import type { AuthRequest } from '../../middleware/auth'
import { success } from '../../utils/response'
import * as appService from './app.service'
import * as templateService from './template.service'

export async function getAppTemplates(_req: AuthRequest, res: Response) {
  const result = templateService.listTemplates()
  res.json(success(result))
}

export async function createAppFromTemplate(req: AuthRequest, res: Response) {
  const { template, code, name, autoPublish } = req.body
  const operator = req.user
  const result = await templateService.installTemplate(template, { code, name, autoPublish }, operator)

  // 事务已提交，发布菜单
  const app = await appService.getAppById(result.appId)
  if (result.autoPublish) {
    await appService.publishAppMenus(app)
  }

  // 为当前用户角色授权该应用
  if (operator?.roleId) {
    await appService.grantAppToRole(result.appId, operator.roleId)
  }

  res.json(success(result, '模板安装成功'))
}

export async function getApps(_req: AuthRequest, res: Response) {
  const result = await appService.getApps()
  res.json(success(result))
}

export async function getMarketApps(_req: AuthRequest, res: Response) {
  const result = await appService.getMarketApps()
  res.json(success(result))
}

export async function getApp(req: AuthRequest, res: Response) {
  const result = await appService.getAppByCode(req.params.code)
  res.json(success(result))
}

export async function saveApp(req: AuthRequest, res: Response) {
  const result = await appService.saveApp(req.body)
  res.json(success(result, '保存成功'))
}

export async function deleteApp(req: AuthRequest, res: Response) {
  await appService.deleteApp(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function createSnapshot(req: AuthRequest, res: Response) {
  const result = await appService.createSnapshot(Number(req.params.id), req.body)
  res.json(success(result, '快照已创建'))
}

export async function publishVersion(req: AuthRequest, res: Response) {
  const result = await appService.publishVersion(Number(req.params.id), Number(req.body.versionId))
  res.json(success(result, '版本已发布'))
}

export async function rollbackVersion(req: AuthRequest, res: Response) {
  const result = await appService.rollbackVersion(Number(req.params.id), Number(req.body.versionId))
  res.json(success(result, '已回滚到指定版本'))
}

export async function getAppVersions(req: AuthRequest, res: Response) {
  const result = await appService.getAppVersions(Number(req.params.id))
  res.json(success(result))
}

export async function exportApp(req: AuthRequest, res: Response) {
  const result = await appService.exportApp(Number(req.params.id))
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', `attachment; filename=${result.code}.json`)
  res.send(JSON.stringify(result, null, 2))
}

export async function importApp(req: AuthRequest, res: Response) {
  const result = await appService.importApp(req.body)
  res.json(success(result, '导入成功'))
}
