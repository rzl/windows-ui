import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as pageService from './page.service'

export async function getPages(_req: Request, res: Response) {
  const result = await pageService.getPages()
  res.json(success(result))
}

export async function getPage(req: Request, res: Response) {
  const result = await pageService.getPageByCode(req.params.code)
  res.json(success(result))
}

export async function savePage(req: Request, res: Response) {
  const result = await pageService.savePage(req.body)
  res.json(success(result, '保存成功'))
}

export async function deletePage(req: Request, res: Response) {
  await pageService.deletePage(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function executeDataSource(req: Request, res: Response) {
  const result = await pageService.executePageDataSource(
    req.params.code,
    req.body.dataSource,
    req.body.ctx || {}
  )
  res.json(success(result))
}
