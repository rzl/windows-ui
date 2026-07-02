import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as flowController from './flow.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/definitions', flowController.getFlowDefinitions)
router.get('/definitions/:code', flowController.getFlowDefinition)
router.get('/definitions/:code/versions', flowController.getFlowVersions)
router.post('/definitions/:code/rollback', flowController.rollbackFlowDefinition)
router.get('/definitions/model/:modelCode', flowController.getFlowDefinitionByModel)
router.post('/definitions', flowController.saveFlowDefinition)
router.delete('/definitions/:id', flowController.deleteFlowDefinition)

router.post('/instances/start', flowController.startFlowInstance)
router.get('/instances/status/:businessKey', flowController.getInstanceStatus)
router.get('/instances/trace/:businessKey', flowController.getFlowTrace)

router.get('/tasks/pending', flowController.getPendingTasks)
router.post('/tasks/:id/approve', flowController.approveTask)
router.post('/tasks/:id/reject', flowController.rejectTask)
router.post('/tasks/:id/transfer', flowController.transferTask)

router.get('/delegations', flowController.getFlowDelegations)
router.post('/delegations', flowController.createFlowDelegation)
router.put('/delegations/:id', flowController.updateFlowDelegation)
router.delete('/delegations/:id', flowController.deleteFlowDelegation)

router.post('/check-timeout', flowController.checkTimeoutTasks)
router.get('/performance/definitions', flowController.getFlowPerformanceByDefinition)
router.get('/performance/nodes', flowController.getFlowPerformanceByNode)

export default router
