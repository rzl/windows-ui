import type { Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as printService from './print.service'

export async function getPrintTemplates(req: AuthRequest, res: Response) {
  const result = await printService.getPrintTemplates(req, req.query.modelCode as string)
  res.json(success(result))
}

export async function getPrintTemplate(req: AuthRequest, res: Response) {
  const result = await printService.getPrintTemplateByCode(req, req.params.code)
  res.json(success(result))
}

export async function savePrintTemplate(req: AuthRequest, res: Response) {
  const result = await printService.savePrintTemplate(req, req.body)
  res.json(success(result, '保存成功'))
}

export async function deletePrintTemplate(req: AuthRequest, res: Response) {
  await printService.deletePrintTemplate(req, Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function previewPrintTemplate(req: AuthRequest, res: Response) {
  const result = await printService.renderPrintTemplate(req, req.params.code, req.body, req.user)
  res.json(success(result))
}

export async function exportPrintTemplatePdf(req: AuthRequest, res: Response) {
  const result = await printService.renderPrintTemplate(req, req.params.code, req.body, req.user)
  // 当前实现返回 HTML，由前端调用浏览器打印生成 PDF
  res.setHeader('Content-Type', 'application/json')
  res.json(success(result))
}
