import type { Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as pageService from './page.service'

export async function getPages(req: AuthRequest, res: Response) {
  const result = await pageService.getPages(req)
  res.json(success(result))
}

export async function getPage(req: AuthRequest, res: Response) {
  const result = await pageService.getPageByCode(req, req.params.code)
  res.json(success(result))
}

export async function savePage(req: AuthRequest, res: Response) {
  const result = await pageService.savePage(req, req.body)
  res.json(success(result, '保存成功'))
}

export async function deletePage(req: AuthRequest, res: Response) {
  await pageService.deletePage(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function executeDataSource(req: AuthRequest, res: Response) {
  const result = await pageService.executePageDataSource(
    req,
    req.params.code,
    req.body.dataSource,
    req.body.ctx || {}
  )
  res.json(success(result))
}
