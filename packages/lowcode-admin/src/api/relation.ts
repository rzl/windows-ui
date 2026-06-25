import request from './request'

export interface RelationForm {
  id?: number
  code?: string
  name?: string
  sourceModel?: string
  targetModel?: string
  relationType?: 'belongsTo' | 'hasMany' | 'manyToMany'
  sourceField?: string
  targetField?: string
  junctionTable?: string
  status?: number
}

export function getRelations(params?: any) {
  return request.get('/lowcode/relations', { params })
}

export function getRelation(id: number) {
  return request.get(`/lowcode/relations/${id}`)
}

export function createRelation(data: RelationForm) {
  return request.post('/lowcode/relations', data)
}

export function updateRelation(id: number, data: RelationForm) {
  return request.put(`/lowcode/relations/${id}`, data)
}

export function deleteRelation(id: number) {
  return request.delete(`/lowcode/relations/${id}`)
}

export function getRelationOptions(code: string, params?: any) {
  return request.get(`/lowcode/relations/${code}/options`, { params })
}
