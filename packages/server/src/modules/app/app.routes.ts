import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as appController from './app.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/', appController.getApps)
router.get('/:code', appController.getApp)
router.post('/', appController.saveApp)
router.delete('/:id', appController.deleteApp)
router.post('/:id/snapshot', appController.createSnapshot)
router.post('/:id/publish', appController.publishVersion)
router.post('/:id/rollback', appController.rollbackVersion)
router.get('/:id/versions', appController.getAppVersions)
router.get('/:id/export', appController.exportApp)
router.post('/import', appController.importApp)

export default router
