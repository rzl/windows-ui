import request from './request'

export interface DeptForm {
  id?: string
  parentId?: string
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

export function updateDept(id: string, data: DeptForm) {
  return request.put(`/rbac/depts/${id}`, data)
}

export function deleteDept(id: string) {
  return request.delete(`/rbac/depts/${id}`)
}
