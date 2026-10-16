import { Router, type Router as RouterType } from 'express'
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth'
import { requirePermission } from '../../middleware/permission'
import * as pluginController from './plugin.controller'

const router: RouterType = Router()

// 插件的安装/修改/启停要求 plugin:manage 权限，超管自动放行
const manage = requirePermission('plugin:manage')

// 未登录用户返回裁剪后的插件元信息（不含运行时代码）
router.get('/active', optionalAuthMiddleware, pluginController.getActivePlugins)

router.use(authMiddleware)

router.get('/', pluginController.getPlugins)
router.get('/:id', pluginController.getPlugin)
router.post('/', manage, pluginController.createPlugin)
router.put('/:id', manage, pluginController.updatePlugin)
router.delete('/:id', manage, pluginController.deletePlugin)
router.post('/:id/enable', manage, pluginController.enablePlugin)
router.post('/:id/disable', manage, pluginController.disablePlugin)

export default router
