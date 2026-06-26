import request from './request'

export interface ModelForm {
  id?: number
  code?: string
  name?: string
  tableName?: string
  description?: string
  status?: number
  dataPermission?: string
  enableAudit?: number | boolean
}

export interface FieldForm {
  id?: number
  modelId?: number
  fieldName?: string
  displayName?: string
  type?: string
  length?: number
  required?: boolean
  defaultValue?: string
  defaultValueType?: string
  defaultValueExpr?: string
  options?: any[]
  validationRule?: string
  dictCode?: string
  refModel?: string
  refDisplayField?: string
  refRelation?: string
  refFilter?: any
  sort?: number
  status?: number
}

export interface FormConfigData {
  modelId?: number
  name?: string
  config?: any
  status?: number
}

export interface TableConfigData {
  modelId?: number
  name?: string
  config?: any
  status?: number
}

export interface CodingRuleForm {
  id?: number
  code?: string
  name?: string
  prefix?: string
  dateFormat?: string
  seqLength?: number
  status?: number
}

export interface ValidationRuleForm {
  id?: number
  code?: string
  name?: string
  pattern?: string
  message?: string
  status?: number
}

// 模型
export function getModels() {
  return request.get('/lowcode/models')
}

export function getModel(id: number) {
  return request.get(`/lowcode/models/${id}`)
}

export function getModelByCode(code: string) {
  return request.get(`/lowcode/models/code/${code}`)
}

export function getModelPermission(code: string) {
  return request.get(`/lowcode/models/code/${code}/permission`)
}

export function createModel(data: ModelForm) {
  return request.post('/lowcode/models', data)
}

export function updateModel(id: number, data: ModelForm) {
  return request.put(`/lowcode/models/${id}`, data)
}

export function deleteModel(id: number) {
  return request.delete(`/lowcode/models/${id}`)
}

export function exportModel(id: number) {
  return request.get(`/lowcode/models/${id}/export`, { responseType: 'blob' })
}

export function importModel(file: File, conflict: 'skip' | 'overwrite' | 'error' = 'skip') {
  const formData = new FormData()
  formData.append('file', file)
  return request.post(`/lowcode/models/import?conflict=${conflict}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 字段
export function createField(data: FieldForm) {
  return request.post('/lowcode/fields', data)
}

export function updateField(id: number, data: FieldForm) {
  return request.put(`/lowcode/fields/${id}`, data)
}

export function deleteField(id: number) {
  return request.delete(`/lowcode/fields/${id}`)
}

export function batchDeleteFields(ids: number[]) {
  return request.post('/lowcode/fields/batch-delete', { ids })
}

// 表单/列表配置
export function saveForm(data: FormConfigData) {
  return request.post('/lowcode/forms', data)
}

export function saveTable(data: TableConfigData) {
  return request.post('/lowcode/tables', data)
}

// 动态 CRUD
export function getDynamicList(modelCode: string, params: any) {
  return request.get(`/lowcode/${modelCode}`, { params })
}

export function getDynamicDetail(modelCode: string, id: number, params?: any) {
  return request.get(`/lowcode/${modelCode}/${id}`, { params })
}

export function createDynamic(modelCode: string, data: any) {
  return request.post(`/lowcode/${modelCode}`, data)
}

export function updateDynamic(modelCode: string, id: number, data: any) {
  return request.put(`/lowcode/${modelCode}/${id}`, data)
}

export function deleteDynamic(modelCode: string, id: number) {
  return request.delete(`/lowcode/${modelCode}/${id}`)
}

export function deleteDynamicBatch(modelCode: string, ids: (string | number)[]) {
  return request.delete(`/lowcode/${modelCode}/batch`, { data: { ids } })
}

export function importDynamic(modelCode: string, rows: any[]) {
  return request.post(`/lowcode/${modelCode}/import`, { rows })
}

export function exportDynamicExcel(modelCode: string, data: { ids?: (string | number)[]; columns?: any[] }) {
  return request.post(`/lowcode/${modelCode}/export`, data, { responseType: 'blob' })
}

export function importDynamicExcel(modelCode: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post(`/lowcode/${modelCode}/import-excel`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function getImportTemplate(modelCode: string) {
  return request.get(`/lowcode/${modelCode}/template`, { responseType: 'blob' })
}

export function createExportTask(modelCode: string, data: { ids?: (string | number)[]; columns?: any[] }) {
  return request.post(`/lowcode/${modelCode}/export-task`, data)
}

export function getExportTask(modelCode: string, id: number) {
  return request.get(`/lowcode/${modelCode}/export-task/${id}`)
}

export function downloadExportFile(modelCode: string, id: number) {
  return request.get(`/lowcode/${modelCode}/export-task/${id}/download`, { responseType: 'blob' })
}

// 编码规则
export function getCodingRules() {
  return request.get('/lowcode/coding-rules')
}

export function createCodingRule(data: CodingRuleForm) {
  return request.post('/lowcode/coding-rules', data)
}

export function updateCodingRule(id: number, data: CodingRuleForm) {
  return request.put(`/lowcode/coding-rules/${id}`, data)
}

export function deleteCodingRule(id: number) {
  return request.delete(`/lowcode/coding-rules/${id}`)
}

export function generateCode(ruleCode: string) {
  return request.get(`/lowcode/coding-rules/${ruleCode}/generate`)
}

// 校验规则
export function getValidationRules() {
  return request.get('/lowcode/validation-rules')
}

export function createValidationRule(data: ValidationRuleForm) {
  return request.post('/lowcode/validation-rules', data)
}

export function updateValidationRule(id: number, data: ValidationRuleForm) {
  return request.put(`/lowcode/validation-rules/${id}`, data)
}

export function deleteValidationRule(id: number) {
  return request.delete(`/lowcode/validation-rules/${id}`)
}

export function validateBatch(items: { code: string; value: any }[]) {
  return request.post('/lowcode/validation-rules/batch', { items })
}

export function executeFieldOptions(config: any, ctx?: any) {
  return request.post('/lowcode/options/execute', { config, ctx })
}

// 常用查询
export interface SavedQuery {
  id?: number
  name: string
  modelCode?: string
  filters: any
  isDefault?: boolean
}

export function getSavedQueries(modelCode: string) {
  return request.get(`/lowcode/${modelCode}/saved-queries`)
}

export function createSavedQuery(modelCode: string, data: SavedQuery) {
  return request.post(`/lowcode/${modelCode}/saved-queries`, data)
}

export function updateSavedQuery(modelCode: string, id: number, data: SavedQuery) {
  return request.put(`/lowcode/${modelCode}/saved-queries/${id}`, data)
}

export function deleteSavedQuery(modelCode: string, id: number) {
  return request.delete(`/lowcode/${modelCode}/saved-queries/${id}`)
}

export function setDefaultSavedQuery(modelCode: string, id: number) {
  return request.post(`/lowcode/${modelCode}/saved-queries/${id}/default`)
}
