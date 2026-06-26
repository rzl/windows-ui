import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as customApiController from './custom-api.controller'
import * as versionController from './custom-api-version.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/', customApiController.getCustomApis)
router.get('/:id/versions', versionController.getVersions)
router.post('/:id/versions', versionController.createVersion)
router.post('/:id/versions/:versionId/rollback', versionController.rollbackVersion)
router.delete('/:id/versions/:versionId', versionController.deleteVersion)
router.get('/:id/logs', customApiController.getApiLogs)
router.get('/:id', customApiController.getCustomApi)
router.post('/', customApiController.createCustomApi)
router.put('/:id', customApiController.updateCustomApi)
router.delete('/:id', customApiController.deleteCustomApi)
router.post('/:id/test', customApiController.testCustomApi)

export default router
