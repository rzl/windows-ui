import { Router, type Router as RouterType } from 'express'
import multer from 'multer'
import path from 'path'
import { authMiddleware } from '../../middleware/auth'
import * as commonController from './common.controller'
import * as commonService from './common.service'

// 允许上传的扩展名白名单：排除 .html/.svg/.js 等可执行内容，防止存储型 XSS
const ALLOWED_EXTENSIONS = new Set([
  // 图片
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.ico',
  // 文档
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.md', '.json',
  // 压缩包
  '.zip', '.rar', '.7z', '.gz',
  // 音视频
  '.mp3', '.mp4', '.wav', '.webm'
])

const MAX_FILE_SIZE = 10 * 1024 * 1024

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, commonService.getUploadDir())
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${unique}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      cb(null, false)
      return
    }
    cb(null, true)
  }
})

const router: RouterType = Router()

router.use(authMiddleware)

router.post('/upload', upload.single('file'), commonController.uploadFile)

export default router
