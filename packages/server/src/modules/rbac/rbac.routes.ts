import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import { requirePermission } from '../../middleware/permission'
import * as rbacController from './rbac.controller'

const router: RouterType = Router()

// 用户/角色/菜单/部门的管理要求 rbac:manage 权限，超管自动放行
const manage = requirePermission('rbac:manage')

router.use(authMiddleware)

// 用户
router.get('/users', rbacController.getUsers)
router.get('/users/:id', rbacController.getUser)
router.post('/users', manage, rbacController.createUser)
router.put('/users/:id', manage, rbacController.updateUser)
router.post('/users/delete', manage, rbacController.deleteUsers)

// 角色
router.get('/roles', rbacController.getRoles)
router.get('/roles/:id', rbacController.getRole)
router.post('/roles', manage, rbacController.createRole)
router.put('/roles/:id', manage, rbacController.updateRole)
router.delete('/roles/:id', manage, rbacController.deleteRole)

// 菜单
router.get('/menus', rbacController.getMenus)
router.get('/menus/tree', rbacController.getMenuTree)
router.post('/menus', manage, rbacController.createMenu)
router.put('/menus/:id', manage, rbacController.updateMenu)
router.delete('/menus/:id', manage, rbacController.deleteMenu)

// 部门
router.get('/depts/tree', rbacController.getDeptTree)
router.post('/depts', manage, rbacController.createDept)
router.put('/depts/:id', manage, rbacController.updateDept)
router.delete('/depts/:id', manage, rbacController.deleteDept)

export default router
