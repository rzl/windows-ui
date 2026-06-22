import { Router, type Router as RouterType } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import rbacRoutes from '../modules/rbac/rbac.routes'
import systemRoutes from '../modules/system/system.routes'
import lowcodeRoutes from '../modules/lowcode/lowcode.routes'
import monitorRoutes from '../modules/monitor/monitor.routes'
import dashboardRoutes from '../modules/dashboard/dashboard.routes'
import flowRoutes from '../modules/flow/flow.routes'
import commonRoutes from '../modules/common/common.routes'
import scheduleRoutes from '../modules/schedule/schedule.routes'
import reportRoutes from '../modules/report/report.routes'
import printRoutes from '../modules/print/print.routes'
import externalDatasourceRoutes from '../modules/external-datasource/external-datasource.routes'
import appRoutes from '../modules/app/app.routes'
import auditRoutes from '../modules/audit/audit.routes'
import pageRoutes from '../modules/page/page.routes'
import customApiRoutes from '../modules/custom-api/custom-api.routes'
import pluginRoutes from '../modules/plugin/plugin.routes'
import { optionalAuthMiddleware } from '../middleware/auth'
import * as customApiController from '../modules/custom-api/custom-api.controller'

const router: RouterType = Router()

router.use('/auth', authRoutes)
router.use('/rbac', rbacRoutes)
router.use('/system', systemRoutes)
router.use('/lowcode', lowcodeRoutes)
router.use('/monitor', monitorRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/flow', flowRoutes)
router.use('/common', commonRoutes)
router.use('/schedule', scheduleRoutes)
router.use('/report', reportRoutes)
router.use('/print', printRoutes)
router.use('/external-datasources', externalDatasourceRoutes)
router.use('/apps', appRoutes)
router.use('/audit-logs', auditRoutes)
router.use('/pages', pageRoutes)
router.use('/custom-apis', customApiRoutes)
router.use('/plugins', pluginRoutes)
router.use('/custom', optionalAuthMiddleware, customApiController.executeCustomApi)

export default router
