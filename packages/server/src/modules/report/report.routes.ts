import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as reportController from './report.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/reports', reportController.getReports)
router.get('/reports/:code', reportController.getReport)
router.post('/reports', reportController.saveReport)
router.delete('/reports/:id', reportController.deleteReport)
router.post('/reports/:code/execute', reportController.executeReport)
router.post('/reports/:code/export', reportController.exportReportExcel)

export default router
