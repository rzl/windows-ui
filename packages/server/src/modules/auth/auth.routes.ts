import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as authController from './auth.controller'

const router: RouterType = Router()

router.post('/login', authController.login)
router.post('/logout', authMiddleware, authController.logout)
router.post('/refresh', authController.refresh)
router.get('/profile', authMiddleware, authController.profile)
router.put('/profile', authMiddleware, authController.updateProfile)
router.put('/password', authMiddleware, authController.changePassword)

export default router
