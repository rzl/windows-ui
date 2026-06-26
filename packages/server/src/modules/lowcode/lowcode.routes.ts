import { Router, type Router as RouterType } from 'express'
import multer from 'multer'
import { authMiddleware } from '../../middleware/auth'
import * as lowcodeController from './lowcode.controller'
import * as dataPermissionController from './data-permission.controller'
import * as fieldPermissionController from './field-permission.controller'
import * as relationController from './relation.controller'
import * as modelVersionController from './model-version.controller'
import * as savedQueryController from './saved-query.controller'

const router: RouterType = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.use(authMiddleware)

// 数据模型
router.get('/models', lowcodeController.getModels)
router.get('/models/:id/export', lowcodeController.exportModel)
router.post('/models/import', upload.single('file'), lowcodeController.importModel)
router.get('/models/:id/versions', modelVersionController.getVersions)
router.post('/models/:id/versions', modelVersionController.createVersion)
router.post('/models/:id/versions/:versionId/rollback', modelVersionController.rollbackVersion)
router.delete('/models/:id/versions/:versionId', modelVersionController.deleteVersion)
router.get('/models/:id', lowcodeController.getModel)
router.get('/models/code/:code', lowcodeController.getModelByCode)
router.get('/models/code/:code/permission', lowcodeController.getModelPermission)
router.post('/models', lowcodeController.createModel)
router.put('/models/:id', lowcodeController.updateModel)
router.delete('/models/:id', lowcodeController.deleteModel)

// 字段
router.post('/fields', lowcodeController.createField)
router.put('/fields/:id', lowcodeController.updateField)
router.delete('/fields/:id', lowcodeController.deleteField)
router.post('/fields/batch-delete', lowcodeController.batchDeleteFields)

// 表单/列表配置
router.post('/forms', lowcodeController.saveForm)
router.post('/tables', lowcodeController.saveTable)

// 编码规则
router.get('/coding-rules', lowcodeController.getCodingRules)
router.post('/coding-rules', lowcodeController.createCodingRule)
router.put('/coding-rules/:id', lowcodeController.updateCodingRule)
router.delete('/coding-rules/:id', lowcodeController.deleteCodingRule)
router.get('/coding-rules/:ruleCode/generate', lowcodeController.generateCode)

// 校验规则
router.get('/validation-rules', lowcodeController.getValidationRules)
router.post('/validation-rules', lowcodeController.createValidationRule)
router.put('/validation-rules/:id', lowcodeController.updateValidationRule)
router.delete('/validation-rules/:id', lowcodeController.deleteValidationRule)
router.post('/validation-rules/:ruleCode/validate', lowcodeController.validateField)
router.post('/validation-rules/batch', lowcodeController.validateBatch)

// 字段选项动态加载
router.post('/options/execute', lowcodeController.executeFieldOptions)

// 数据权限规则
router.get('/data-permissions', dataPermissionController.getRules)
router.get('/data-permissions/:id', dataPermissionController.getRuleById)
router.post('/data-permissions', dataPermissionController.createRule)
router.put('/data-permissions/:id', dataPermissionController.updateRule)
router.delete('/data-permissions/:id', dataPermissionController.deleteRule)

// 字段权限规则
router.get('/field-permissions', fieldPermissionController.getRules)
router.get('/field-permissions/:id', fieldPermissionController.getRuleById)
router.post('/field-permissions', fieldPermissionController.createRule)
router.put('/field-permissions/:id', fieldPermissionController.updateRule)
router.delete('/field-permissions/:id', fieldPermissionController.deleteRule)

// 关联关系
router.get('/relations', relationController.getRelations)
router.get('/relations/:id', relationController.getRelationById)
router.get('/relations/:code/options', relationController.getRelationOptions)
router.post('/relations', relationController.createRelation)
router.put('/relations/:id', relationController.updateRelation)
router.delete('/relations/:id', relationController.deleteRelation)

// 常用查询
router.get('/:modelCode/saved-queries', savedQueryController.getSavedQueries)
router.post('/:modelCode/saved-queries', savedQueryController.createSavedQuery)
router.put('/:modelCode/saved-queries/:id', savedQueryController.updateSavedQuery)
router.delete('/:modelCode/saved-queries/:id', savedQueryController.deleteSavedQuery)
router.post('/:modelCode/saved-queries/:id/default', savedQueryController.setDefaultSavedQuery)

// 动态 CRUD（放在最后避免路径冲突）
router.get('/:modelCode', lowcodeController.dynamicList)
router.post('/:modelCode/import', lowcodeController.dynamicImport)
router.post('/:modelCode/export', lowcodeController.exportDynamicExcel)
router.post('/:modelCode/import-excel', upload.single('file'), lowcodeController.importDynamicExcel)
router.get('/:modelCode/template', lowcodeController.getImportTemplate)
router.post('/:modelCode/export-task', lowcodeController.createExportTask)
router.get('/:modelCode/export-task/:id', lowcodeController.getExportTask)
router.get('/:modelCode/export-task/:id/download', lowcodeController.downloadExportFile)
router.delete('/:modelCode/batch', lowcodeController.dynamicBatchDelete)
router.get('/:modelCode/:id', lowcodeController.dynamicDetail)
router.post('/:modelCode', lowcodeController.dynamicCreate)
router.put('/:modelCode/:id', lowcodeController.dynamicUpdate)
router.delete('/:modelCode/:id', lowcodeController.dynamicDelete)

export default router
