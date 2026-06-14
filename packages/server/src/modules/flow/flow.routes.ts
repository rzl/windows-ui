import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as flowController from './flow.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/definitions', flowController.getFlowDefinitions)
router.get('/definitions/:code', flowController.getFlowDefinition)
router.get('/definitions/model/:modelCode', flowController.getFlowDefinitionByModel)
router.post('/definitions', flowController.saveFlowDefinition)
router.delete('/definitions/:id', flowController.deleteFlowDefinition)

router.post('/instances/start', flowController.startFlowInstance)
router.get('/instances/status/:businessKey', flowController.getInstanceStatus)
router.get('/instances/trace/:businessKey', flowController.getFlowTrace)

router.get('/tasks/pending', flowController.getPendingTasks)
router.post('/tasks/:id/approve', flowController.approveTask)
router.post('/tasks/:id/reject', flowController.rejectTask)

export default router
