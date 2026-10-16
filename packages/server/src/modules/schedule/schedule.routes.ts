import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import { requirePermission } from '../../middleware/permission'
import * as scheduleController from './schedule.controller'

const router: RouterType = Router()

// 定时任务的增删改与手动执行要求 schedule:manage 权限，超管自动放行
const manage = requirePermission('schedule:manage')

router.use(authMiddleware)

router.get('/tasks', scheduleController.getScheduledTasks)
router.get('/tasks/:id', scheduleController.getScheduledTask)
router.post('/tasks', manage, scheduleController.saveScheduledTask)
router.put('/tasks/:id', manage, scheduleController.saveScheduledTask)
router.delete('/tasks/:id', manage, scheduleController.deleteScheduledTask)
router.get('/tasks/:id/logs', scheduleController.getTaskLogs)
router.post('/tasks/:id/run', manage, scheduleController.runTask)

export default router
