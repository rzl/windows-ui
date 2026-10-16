import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import { requirePermission } from '../../middleware/permission'
import * as customApiController from './custom-api.controller'
import * as versionController from './custom-api-version.controller'

const router: RouterType = Router()

// 自定义接口的设计/调试/版本管理要求 custom-api:design 权限，超管自动放行
const design = requirePermission('custom-api:design')

router.use(authMiddleware)

router.get('/', customApiController.getCustomApis)
router.get('/:id/versions', versionController.getVersions)
router.post('/:id/versions', design, versionController.createVersion)
router.post('/:id/versions/:versionId/rollback', design, versionController.rollbackVersion)
router.delete('/:id/versions/:versionId', design, versionController.deleteVersion)
router.get('/:id/logs', customApiController.getApiLogs)
router.get('/:id', customApiController.getCustomApi)
router.post('/', design, customApiController.createCustomApi)
router.put('/:id', design, customApiController.updateCustomApi)
router.delete('/:id', design, customApiController.deleteCustomApi)
router.post('/:id/test', design, customApiController.testCustomApi)

export default router
