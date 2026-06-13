import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as dashboardController from './dashboard.controller'

const router: RouterType = Router()

router.use(authMiddleware)

// 统计数据
router.get('/stats', dashboardController.getStats)

// 首页配置
router.get('/homepage', dashboardController.getHomepageConfig)
router.post('/homepage', dashboardController.saveHomepageConfig)

// 仪表盘
router.get('/dashboards', dashboardController.getDashboards)
router.get('/dashboards/:code', dashboardController.getDashboard)
router.post('/dashboards', dashboardController.createDashboard)
router.put('/dashboards/:id', dashboardController.updateDashboard)
router.delete('/dashboards/:id', dashboardController.deleteDashboard)

// 数据源执行
router.post('/dashboards/data-source/execute', dashboardController.executeDataSource)

export default router
