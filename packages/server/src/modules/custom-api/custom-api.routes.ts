import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as customApiController from './custom-api.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/', customApiController.getCustomApis)
router.get('/:id', customApiController.getCustomApi)
router.post('/', customApiController.createCustomApi)
router.put('/:id', customApiController.updateCustomApi)
router.delete('/:id', customApiController.deleteCustomApi)
router.post('/:id/test', customApiController.testCustomApi)

export default router
