import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import type { AuthRequest } from '../../middleware/auth'
import * as printService from './print.service'

export async function getPrintTemplates(req: Request, res: Response) {
  const result = await printService.getPrintTemplates(req.query.modelCode as string)
  res.json(success(result))
}

export async function getPrintTemplate(req: Request, res: Response) {
  const result = await printService.getPrintTemplateByCode(req.params.code)
  res.json(success(result))
}

export async function savePrintTemplate(req: Request, res: Response) {
  const result = await printService.savePrintTemplate(req.body)
  res.json(success(result, '保存成功'))
}

export async function deletePrintTemplate(req: Request, res: Response) {
  await printService.deletePrintTemplate(Number(req.params.id))
  res.json(success(null, '删除成功'))
}

export async function previewPrintTemplate(req: Request, res: Response) {
  const result = await printService.renderPrintTemplate(req.params.code, req.body, (req as AuthRequest).user)
  res.json(success(result))
}

export async function exportPrintTemplatePdf(req: Request, res: Response) {
  const result = await printService.renderPrintTemplate(req.params.code, req.body, (req as AuthRequest).user)
  // 当前实现返回 HTML，由前端调用浏览器打印生成 PDF
  res.setHeader('Content-Type', 'application/json')
  res.json(success(result))
}
