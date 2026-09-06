import request from './request'

export interface PluginForm {
  id?: string
  code?: string
  name?: string
  version?: string
  description?: string
  type?: string
  contributions?: any
  runtimeCode?: string
  runtimeUrl?: string
  configSchema?: any
  status?: number
  icon?: string
  author?: string
}

export function getPlugins() {
  return request.get('/plugins')
}

export function getActivePlugins() {
  return request.get('/plugins/active')
}

export function getPlugin(id: string) {
  return request.get(`/plugins/${id}`)
}

export function createPlugin(data: PluginForm) {
  return request.post('/plugins', data)
}

export function updatePlugin(id: string, data: PluginForm) {
  return request.put(`/plugins/${id}`, data)
}

export function deletePlugin(id: string) {
  return request.delete(`/plugins/${id}`)
}

export function enablePlugin(id: string) {
  return request.post(`/plugins/${id}/enable`)
}

export function disablePlugin(id: string) {
  return request.post(`/plugins/${id}/disable`)
}
