import { Router, type Router as RouterType } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import rbacRoutes from '../modules/rbac/rbac.routes'
import systemRoutes from '../modules/system/system.routes'
import lowcodeRoutes from '../modules/lowcode/lowcode.routes'
import monitorRoutes from '../modules/monitor/monitor.routes'
import dashboardRoutes from '../modules/dashboard/dashboard.routes'
import flowRoutes from '../modules/flow/flow.routes'

const router: RouterType = Router()

router.use('/auth', authRoutes)
router.use('/rbac', rbacRoutes)
router.use('/system', systemRoutes)
router.use('/lowcode', lowcodeRoutes)
router.use('/monitor', monitorRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/flow', flowRoutes)

export default router
