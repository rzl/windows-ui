import request from './request'

export interface DictForm {
  id?: string
  name?: string
  code?: string
  description?: string
  categoryId?: string
  status?: number
}

export interface DictItemForm {
  id?: string
  dictId?: string
  label?: string
  value?: string
  sort?: number
  status?: number
}

export interface DictCategoryForm {
  id?: string
  code?: string
  name?: string
  sort?: number
  status?: number
}

export function getDicts() {
  return request.get('/system/dicts')
}

export function getDict(id: string) {
  return request.get(`/system/dicts/${id}`)
}

export function createDict(data: DictForm) {
  return request.post('/system/dicts', data)
}

export function updateDict(id: string, data: DictForm) {
  return request.put(`/system/dicts/${id}`, data)
}

export function deleteDict(id: string) {
  return request.delete(`/system/dicts/${id}`)
}

export function getDictCategories() {
  return request.get('/system/dict-categories')
}

export function createDictCategory(data: DictCategoryForm) {
  return request.post('/system/dict-categories', data)
}

export function updateDictCategory(id: string, data: DictCategoryForm) {
  return request.put(`/system/dict-categories/${id}`, data)
}

export function deleteDictCategory(id: string) {
  return request.delete(`/system/dict-categories/${id}`)
}

export function createDictItem(data: DictItemForm) {
  return request.post('/system/dict-items', data)
}

export function updateDictItem(id: string, data: DictItemForm) {
  return request.put(`/system/dict-items/${id}`, data)
}

export function deleteDictItem(id: string) {
  return request.delete(`/system/dict-items/${id}`)
}
