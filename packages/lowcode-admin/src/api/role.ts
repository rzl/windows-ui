import request from './request'

export interface RoleForm {
  id?: number
  name?: string
  code?: string
  description?: string
  status?: number
  permissions?: string[]
}

export function getRoles() {
  return request.get('/rbac/roles')
}

export function getRole(id: number) {
  return request.get(`/rbac/roles/${id}`)
}

export function createRole(data: RoleForm) {
  return request.post('/rbac/roles', data)
}

export function updateRole(id: number, data: RoleForm) {
  return request.put(`/rbac/roles/${id}`, data)
}

export function deleteRole(id: number) {
  return request.delete(`/rbac/roles/${id}`)
}
