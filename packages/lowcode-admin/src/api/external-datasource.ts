import request from './request'

export interface ExternalDataSourceForm {
  id?: number
  code?: string
  name?: string
  type?: string
  config?: any
  description?: string
  status?: number
}

export function getExternalDataSources() {
  return request.get('/external-datasources')
}

export function getExternalDataSource(id: number) {
  return request.get(`/external-datasources/${id}`)
}

export function createExternalDataSource(data: ExternalDataSourceForm) {
  return request.post('/external-datasources', data)
}

export function updateExternalDataSource(id: number, data: ExternalDataSourceForm) {
  return request.put(`/external-datasources/${id}`, data)
}

export function deleteExternalDataSource(id: number) {
  return request.delete(`/external-datasources/${id}`)
}

export function testExternalDataSource(id: number, ctx: any = {}) {
  return request.post(`/external-datasources/${id}/test`, ctx)
}

export function executeExternalDataSource(id: number, ctx: any = {}) {
  return request.post(`/external-datasources/${id}/execute`, ctx)
}

export function getExternalDataSourceOptions(id: number, ctx: any = {}) {
  return request.post(`/external-datasources/${id}/options`, ctx)
}
