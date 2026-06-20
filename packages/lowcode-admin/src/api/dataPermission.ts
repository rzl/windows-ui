import request from './request'

export interface DataPermissionRule {
  id?: number
  code: string
  name: string
  model_code: string
  scope: 'all' | 'dept' | 'dept_and_sub' | 'self' | 'roles' | 'users'
  role_ids?: number[]
  user_ids?: number[]
  custom_filter?: any[]
  status?: number
}

export function getDataPermissions(params?: any) {
  return request.get('/lowcode/data-permissions', { params })
}

export function getDataPermission(id: number) {
  return request.get(`/lowcode/data-permissions/${id}`)
}

export function createDataPermission(data: DataPermissionRule) {
  return request.post('/lowcode/data-permissions', data)
}

export function updateDataPermission(id: number, data: DataPermissionRule) {
  return request.put(`/lowcode/data-permissions/${id}`, data)
}

export function deleteDataPermission(id: number) {
  return request.delete(`/lowcode/data-permissions/${id}`)
}
