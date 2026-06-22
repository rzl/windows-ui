import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as pluginController from './plugin.controller'

const router: RouterType = Router()

// 所有用户均需获取启用插件列表以渲染页面，因此 /active 不校验登录
router.get('/active', pluginController.getActivePlugins)

router.use(authMiddleware)

router.get('/', pluginController.getPlugins)
router.get('/:id', pluginController.getPlugin)
router.post('/', pluginController.createPlugin)
router.put('/:id', pluginController.updatePlugin)
router.delete('/:id', pluginController.deletePlugin)
router.post('/:id/enable', pluginController.enablePlugin)
router.post('/:id/disable', pluginController.disablePlugin)

export default router
