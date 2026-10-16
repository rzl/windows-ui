import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import { requirePermission } from '../../middleware/permission'
import * as flowController from './flow.controller'

const router: RouterType = Router()

// 流程定义的设计/版本管理与强制终止要求 flow:design 权限，超管自动放行
const design = requirePermission('flow:design')

router.use(authMiddleware)

router.get('/definitions', flowController.getFlowDefinitions)
router.get('/definitions/:code', flowController.getFlowDefinition)
router.get('/definitions/:code/versions', flowController.getFlowVersions)
router.post('/definitions/:code/rollback', design, flowController.rollbackFlowDefinition)
router.get('/definitions/model/:modelCode', flowController.getFlowDefinitionByModel)
router.post('/definitions', design, flowController.saveFlowDefinition)
router.delete('/definitions/:id', design, flowController.deleteFlowDefinition)

router.post('/instances/start', flowController.startFlowInstance)
router.get('/instances/status/:businessKey', flowController.getInstanceStatus)
router.get('/instances/trace/:businessKey', flowController.getFlowTrace)

router.get('/tasks/pending', flowController.getPendingTasks)
// 审批操作的"是否为审批人"校验在 service 层完成
router.post('/tasks/:id/approve', flowController.approveTask)
router.post('/tasks/:id/reject', flowController.rejectTask)
router.post('/tasks/:id/transfer', flowController.transferTask)

router.get('/delegations', flowController.getFlowDelegations)
router.post('/delegations', flowController.createFlowDelegation)
router.put('/delegations/:id', flowController.updateFlowDelegation)
router.delete('/delegations/:id', flowController.deleteFlowDelegation)

router.post('/check-timeout', design, flowController.checkTimeoutTasks)
router.get('/performance/definitions', flowController.getFlowPerformanceByDefinition)
router.get('/performance/nodes', flowController.getFlowPerformanceByNode)

router.post('/tasks/:id/urge', flowController.urgeTask)
router.post('/instances/:id/urge', flowController.urgeInstance)
router.post('/instances/:id/terminate', design, flowController.terminateInstance)

export default router
