import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as tenantController from './tenant.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/tenants', tenantController.getTenants)
router.get('/tenants/:id', tenantController.getTenant)
router.post('/tenants', tenantController.createTenant)
router.put('/tenants/:id', tenantController.updateTenant)
router.delete('/tenants/:id', tenantController.deleteTenant)

export default router
