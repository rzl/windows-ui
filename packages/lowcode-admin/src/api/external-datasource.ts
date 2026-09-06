import request from './request'

export interface ExternalDataSourceForm {
  id?: string
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

export function getExternalDataSource(id: string) {
  return request.get(`/external-datasources/${id}`)
}

export function createExternalDataSource(data: ExternalDataSourceForm) {
  return request.post('/external-datasources', data)
}

export function updateExternalDataSource(id: string, data: ExternalDataSourceForm) {
  return request.put(`/external-datasources/${id}`, data)
}

export function deleteExternalDataSource(id: string) {
  return request.delete(`/external-datasources/${id}`)
}

export function testExternalDataSource(id: string, ctx: any = {}) {
  return request.post(`/external-datasources/${id}/test`, ctx)
}

export function executeExternalDataSource(id: string, ctx: any = {}) {
  return request.post(`/external-datasources/${id}/execute`, ctx)
}

export function getExternalDataSourceOptions(id: string, ctx: any = {}) {
  return request.post(`/external-datasources/${id}/options`, ctx)
}
