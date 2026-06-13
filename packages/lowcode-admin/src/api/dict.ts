import request from './request'

export interface DictForm {
  id?: number
  name?: string
  code?: string
  description?: string
  status?: number
}

export interface DictItemForm {
  id?: number
  dictId?: number
  label?: string
  value?: string
  sort?: number
  status?: number
}

export function getDicts() {
  return request.get('/system/dicts')
}

export function getDict(id: number) {
  return request.get(`/system/dicts/${id}`)
}

export function createDict(data: DictForm) {
  return request.post('/system/dicts', data)
}

export function updateDict(id: number, data: DictForm) {
  return request.put(`/system/dicts/${id}`, data)
}

export function deleteDict(id: number) {
  return request.delete(`/system/dicts/${id}`)
}

export function createDictItem(data: DictItemForm) {
  return request.post('/system/dict-items', data)
}

export function updateDictItem(id: number, data: DictItemForm) {
  return request.put(`/system/dict-items/${id}`, data)
}

export function deleteDictItem(id: number) {
  return request.delete(`/system/dict-items/${id}`)
}
