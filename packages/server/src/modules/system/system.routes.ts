import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as systemController from './system.controller'
import * as tenantController from './tenant.controller'

const router: RouterType = Router()

router.use(authMiddleware)

// 租户
router.get('/tenants', tenantController.getTenants)
router.get('/tenants/:id', tenantController.getTenant)
router.post('/tenants', tenantController.createTenant)
router.put('/tenants/:id', tenantController.updateTenant)
router.delete('/tenants/:id', tenantController.deleteTenant)

// 字典
router.get('/dicts', systemController.getDicts)
router.get('/dicts/:id', systemController.getDict)
router.get('/dicts/code/:code', systemController.getDictByCode)
router.post('/dicts', systemController.createDict)
router.put('/dicts/:id', systemController.updateDict)
router.delete('/dicts/:id', systemController.deleteDict)

// 字典项
router.post('/dict-items', systemController.createDictItem)
router.put('/dict-items/:id', systemController.updateDictItem)
router.delete('/dict-items/:id', systemController.deleteDictItem)

// 字典分类
router.get('/dict-categories', systemController.getDictCategories)
router.post('/dict-categories', systemController.createDictCategory)
router.put('/dict-categories/:id', systemController.updateDictCategory)
router.delete('/dict-categories/:id', systemController.deleteDictCategory)

// 公告
router.get('/notices', systemController.getNotices)
router.post('/notices', systemController.createNotice)
router.put('/notices/:id', systemController.updateNotice)
router.delete('/notices/:id', systemController.deleteNotice)

// 职务
router.get('/positions', systemController.getPositions)
router.post('/positions', systemController.createPosition)
router.put('/positions/:id', systemController.updatePosition)
router.delete('/positions/:id', systemController.deletePosition)

export default router
