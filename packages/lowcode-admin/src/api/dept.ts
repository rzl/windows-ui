import request from './request'

export interface DeptForm {
  id?: number
  parentId?: number
  name?: string
  code?: string
  sort?: number
  status?: number
}

export function getDeptTree() {
  return request.get('/rbac/depts/tree')
}

export function createDept(data: DeptForm) {
  return request.post('/rbac/depts', data)
}

export function updateDept(id: number, data: DeptForm) {
  return request.put(`/rbac/depts/${id}`, data)
}

export function deleteDept(id: number) {
  return request.delete(`/rbac/depts/${id}`)
}
