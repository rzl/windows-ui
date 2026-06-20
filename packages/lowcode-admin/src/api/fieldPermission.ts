import request from './request'

export interface FieldPermissionRule {
  id?: number
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

export function getFieldPermission(id: number) {
  return request.get(`/lowcode/field-permissions/${id}`)
}

export function createFieldPermission(data: FieldPermissionRule) {
  return request.post('/lowcode/field-permissions', data)
}

export function updateFieldPermission(id: number, data: FieldPermissionRule) {
  return request.put(`/lowcode/field-permissions/${id}`, data)
}

export function deleteFieldPermission(id: number) {
  return request.delete(`/lowcode/field-permissions/${id}`)
}
