import request from './request'

export interface PluginForm {
  id?: number
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

export function getPlugin(id: number) {
  return request.get(`/plugins/${id}`)
}

export function createPlugin(data: PluginForm) {
  return request.post('/plugins', data)
}

export function updatePlugin(id: number, data: PluginForm) {
  return request.put(`/plugins/${id}`, data)
}

export function deletePlugin(id: number) {
  return request.delete(`/plugins/${id}`)
}

export function enablePlugin(id: number) {
  return request.post(`/plugins/${id}/enable`)
}

export function disablePlugin(id: number) {
  return request.post(`/plugins/${id}/disable`)
}
