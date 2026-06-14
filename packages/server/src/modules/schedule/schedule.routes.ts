import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as scheduleController from './schedule.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/tasks', scheduleController.getScheduledTasks)
router.get('/tasks/:id', scheduleController.getScheduledTask)
router.post('/tasks', scheduleController.saveScheduledTask)
router.put('/tasks/:id', scheduleController.saveScheduledTask)
router.delete('/tasks/:id', scheduleController.deleteScheduledTask)
router.get('/tasks/:id/logs', scheduleController.getTaskLogs)
router.post('/tasks/:id/run', scheduleController.runTask)

export default router
