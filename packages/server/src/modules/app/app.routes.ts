import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import { requirePermission } from '../../middleware/permission'
import * as appController from './app.controller'

const router: RouterType = Router()

// 应用的创建/发布/回滚/导入等管理操作要求 app:manage 权限，超管自动放行
const manage = requirePermission('app:manage')

router.use(authMiddleware)

router.get('/', appController.getApps)
router.get('/market', appController.getMarketApps)
router.get('/templates', appController.getAppTemplates)
router.post('/create-from-template', manage, appController.createAppFromTemplate)
router.get('/:code', appController.getApp)
router.post('/', manage, appController.saveApp)
router.delete('/:id', manage, appController.deleteApp)
router.post('/:id/snapshot', manage, appController.createSnapshot)
router.post('/:id/publish', manage, appController.publishVersion)
router.post('/:id/rollback', manage, appController.rollbackVersion)
router.get('/:id/versions', appController.getAppVersions)
router.get('/:id/export', appController.exportApp)
router.post('/import', manage, appController.importApp)

export default router
