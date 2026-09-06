import request from './request'

export interface RoleForm {
  id?: string
  name?: string
  code?: string
  description?: string
  status?: number
  permissions?: string[]
}

export function getRoles() {
  return request.get('/rbac/roles')
}

export function getRole(id: string) {
  return request.get(`/rbac/roles/${id}`)
}

export function createRole(data: RoleForm) {
  return request.post('/rbac/roles', data)
}

export function updateRole(id: string, data: RoleForm) {
  return request.put(`/rbac/roles/${id}`, data)
}

export function deleteRole(id: string) {
  return request.delete(`/rbac/roles/${id}`)
}
