import request from './request'

export interface FieldPermissionRule {
  id?: string
  model_code: string
  field_code: string
  readable?: number
  editable?: number
  hidden?: number
  role_ids?: number[]
  status?: number
}

export function getFieldPermissions(params?: any) {
  return request.get('/lowcode/field-permissions', { params })
}

export function getFieldPermission(id: string) {
  return request.get(`/lowcode/field-permissions/${id}`)
}

export function createFieldPermission(data: FieldPermissionRule) {
  return request.post('/lowcode/field-permissions', data)
}

export function updateFieldPermission(id: string, data: FieldPermissionRule) {
  return request.put(`/lowcode/field-permissions/${id}`, data)
}

export function deleteFieldPermission(id: string) {
  return request.delete(`/lowcode/field-permissions/${id}`)
}
