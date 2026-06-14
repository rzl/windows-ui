import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as externalDatasourceController from './external-datasource.controller'

const router: RouterType = Router()

router.use(authMiddleware)

router.get('/', externalDatasourceController.getExternalDataSources)
router.get('/:id', externalDatasourceController.getExternalDataSource)
router.post('/', externalDatasourceController.createExternalDataSource)
router.put('/:id', externalDatasourceController.updateExternalDataSource)
router.delete('/:id', externalDatasourceController.deleteExternalDataSource)
router.post('/:id/test', externalDatasourceController.testExternalDataSource)
router.post('/:id/execute', externalDatasourceController.executeExternalDataSource)
router.post('/:id/options', externalDatasourceController.getExternalDataSourceOptions)

export default router
