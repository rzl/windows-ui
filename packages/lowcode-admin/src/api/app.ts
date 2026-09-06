import request from './request'

export interface AppForm {
  id?: string
  code?: string
  name?: string
  category?: string
  icon?: string
  description?: string
  status?: number
  isMarket?: number
  items?: AppItem[]
  portalConfig?: any
}

export interface AppItem {
  type: 'model' | 'report' | 'dashboard' | 'flow' | 'print' | 'datasource' | 'page'
  refCode: string
  refName?: string
  sort?: number
}

export function getApps() {
  return request.get('/apps')
}

export function getApp(code: string) {
  return request.get(`/apps/${code}`)
}

export function getMarketApps() {
  return request.get('/apps/market')
}

export function saveApp(data: AppForm) {
  return request.post('/apps', data)
}

export function deleteApp(id: string) {
  return request.delete(`/apps/${id}`)
}

export function createSnapshot(id: string, data: { version: string; description?: string }) {
  return request.post(`/apps/${id}/snapshot`, data)
}

export function publishVersion(id: string, versionId: string) {
  return request.post(`/apps/${id}/publish`, { versionId })
}

export function rollbackVersion(id: string, versionId: string) {
  return request.post(`/apps/${id}/rollback`, { versionId })
}

export function getAppVersions(id: string) {
  return request.get(`/apps/${id}/versions`)
}

export function exportApp(id: string) {
  return request.get(`/apps/${id}/export`, { responseType: 'blob' })
}

export function importApp(data: any) {
  return request.post('/apps/import', data)
}

export function getAppTemplates() {
  return request.get('/apps/templates')
}

export function createAppFromTemplate(data: { template: string; code?: string; name?: string; autoPublish?: boolean }) {
  return request.post('/apps/create-from-template', data)
}
