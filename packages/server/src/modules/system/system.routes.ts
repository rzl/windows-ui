import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as systemController from './system.controller'

const router: RouterType = Router()

router.use(authMiddleware)

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

export default router
