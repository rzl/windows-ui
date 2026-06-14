import type { Request, Response } from 'express'
import { success } from '../../utils/response'
import * as commonService from './common.service'

export async function uploadFile(req: Request, res: Response) {
  const file = (req as any).file
  if (!file) {
    res.status(400).json({ code: 400, message: '未找到上传文件' })
    return
  }
  res.json(success({
    name: file.originalname,
    url: commonService.getUploadUrl(file.filename),
    size: file.size
  }, '上传成功'))
}
