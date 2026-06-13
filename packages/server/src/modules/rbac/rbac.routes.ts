import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as rbacController from './rbac.controller'

const router: RouterType = Router()

router.use(authMiddleware)

// 用户
router.get('/users', rbacController.getUsers)
router.get('/users/:id', rbacController.getUser)
router.post('/users', rbacController.createUser)
router.put('/users/:id', rbacController.updateUser)
router.post('/users/delete', rbacController.deleteUsers)

// 角色
router.get('/roles', rbacController.getRoles)
router.get('/roles/:id', rbacController.getRole)
router.post('/roles', rbacController.createRole)
router.put('/roles/:id', rbacController.updateRole)
router.delete('/roles/:id', rbacController.deleteRole)

// 菜单
router.get('/menus', rbacController.getMenus)
router.get('/menus/tree', rbacController.getMenuTree)
router.post('/menus', rbacController.createMenu)
router.put('/menus/:id', rbacController.updateMenu)
router.delete('/menus/:id', rbacController.deleteMenu)

// 部门
router.get('/depts/tree', rbacController.getDeptTree)
router.post('/depts', rbacController.createDept)
router.put('/depts/:id', rbacController.updateDept)
router.delete('/depts/:id', rbacController.deleteDept)

export default router
