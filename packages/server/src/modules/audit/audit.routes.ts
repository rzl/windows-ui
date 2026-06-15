import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as auditController from './audit.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/', auditController.getAuditLogs)
router.get('/actions', auditController.getAuditActions)
router.get('/:id', auditController.getAuditLogDetail)

export default router
