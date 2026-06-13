import request from './request'

export interface UserQuery {
  keyword?: string
  status?: string | number
  page?: number
  pageSize?: number
}

export interface UserForm {
  id?: number
  username?: string
  password?: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  status?: number
  roleId?: number
  deptId?: number
}

export function getUsers(params: UserQuery) {
  return request.get('/rbac/users', { params })
}

export function createUser(data: UserForm) {
  return request.post('/rbac/users', data)
}

export function updateUser(id: number, data: UserForm) {
  return request.put(`/rbac/users/${id}`, data)
}

export function deleteUsers(ids: number[]) {
  return request.post('/rbac/users/delete', { ids })
}
