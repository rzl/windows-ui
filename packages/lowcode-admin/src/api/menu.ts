import request from './request'

export interface MenuForm {
  id?: number
  parentId?: number
  name?: string
  path?: string
  component?: string
  title?: string
  icon?: string
  sort?: number
  status?: number
  permission?: string
}

export function getMenus() {
  return request.get('/rbac/menus')
}

export function getMenuTree() {
  return request.get('/rbac/menus/tree')
}

export function createMenu(data: MenuForm) {
  return request.post('/rbac/menus', data)
}

export function updateMenu(id: number, data: MenuForm) {
  return request.put(`/rbac/menus/${id}`, data)
}

export function deleteMenu(id: number) {
  return request.delete(`/rbac/menus/${id}`)
}
