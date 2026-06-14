import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as printController from './print.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/templates', printController.getPrintTemplates)
router.get('/templates/:code', printController.getPrintTemplate)
router.post('/templates', printController.savePrintTemplate)
router.delete('/templates/:id', printController.deletePrintTemplate)
router.post('/templates/:code/preview', printController.previewPrintTemplate)
router.post('/templates/:code/pdf', printController.exportPrintTemplatePdf)

export default router
