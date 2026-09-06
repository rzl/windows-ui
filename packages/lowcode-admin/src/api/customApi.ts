import request from './request'

export interface CustomApiForm {
  id?: string
  code?: string
  name?: string
  method?: string
  path?: string
  description?: string
  script?: string
  status?: number
  isPublic?: number
  rateLimit?: number
  rateLimitWindow?: string
  ipWhitelist?: string
  ipBlacklist?: string
  timeout?: number
  logRetentionDays?: number
}

export function getCustomApis() {
  return request.get('/custom-apis')
}

export function getCustomApi(id: string) {
  return request.get(`/custom-apis/${id}`)
}

export function createCustomApi(data: CustomApiForm) {
  return request.post('/custom-apis', data)
}

export function updateCustomApi(id: string, data: CustomApiForm) {
  return request.put(`/custom-apis/${id}`, data)
}

export function deleteCustomApi(id: string) {
  return request.delete(`/custom-apis/${id}`)
}

export function testCustomApi(id: string, ctx: any = {}) {
  return request.post(`/custom-apis/${id}/test`, ctx)
}

export function getCustomApiLogs(id: string, params?: any) {
  return request.get(`/custom-apis/${id}/logs`, { params })
}
