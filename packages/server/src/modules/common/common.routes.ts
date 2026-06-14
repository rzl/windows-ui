import { Router, type Router as RouterType } from 'express'
import multer from 'multer'
import path from 'path'
import { authMiddleware } from '../../middleware/auth'
import * as commonController from './common.controller'
import * as commonService from './common.service'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, commonService.getUploadDir())
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname)
    cb(null, `${unique}${ext}`)
  }
})

const upload = multer({ storage })

const router: RouterType = Router()

router.use(authMiddleware)

router.post('/upload', upload.single('file'), commonController.uploadFile)

export default router
