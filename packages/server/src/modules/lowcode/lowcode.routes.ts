import { Router, type Router as RouterType } from 'express'
import { authMiddleware } from '../../middleware/auth'
import * as lowcodeController from './lowcode.controller'

const router: RouterType = Router()

router.use(authMiddleware)

// 数据模型
router.get('/models', lowcodeController.getModels)
router.get('/models/:id', lowcodeController.getModel)
router.get('/models/code/:code', lowcodeController.getModelByCode)
router.post('/models', lowcodeController.createModel)
router.put('/models/:id', lowcodeController.updateModel)
router.delete('/models/:id', lowcodeController.deleteModel)

// 字段
router.post('/fields', lowcodeController.createField)
router.put('/fields/:id', lowcodeController.updateField)
router.delete('/fields/:id', lowcodeController.deleteField)

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

// 动态 CRUD（放在最后避免路径冲突）
router.get('/:modelCode', lowcodeController.dynamicList)
router.post('/:modelCode/import', lowcodeController.dynamicImport)
router.delete('/:modelCode/batch', lowcodeController.dynamicBatchDelete)
router.get('/:modelCode/:id', lowcodeController.dynamicDetail)
router.post('/:modelCode', lowcodeController.dynamicCreate)
router.put('/:modelCode/:id', lowcodeController.dynamicUpdate)
router.delete('/:modelCode/:id', lowcodeController.dynamicDelete)

export default router
