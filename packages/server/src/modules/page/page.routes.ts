import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as pageController from './page.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/pages', pageController.getPages)
router.get('/pages/:code', pageController.getPage)
router.post('/pages', pageController.savePage)
router.delete('/pages/:id', pageController.deletePage)
router.post('/pages/:code/execute', pageController.executeDataSource)

export default router
