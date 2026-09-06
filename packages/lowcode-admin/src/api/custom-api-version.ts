import request from './request'

export function getCustomApiVersions(apiId: string) {
  return request.get(`/custom-apis/${apiId}/versions`)
}

export function createCustomApiVersion(apiId: string, data: { version: string; description?: string }) {
  return request.post(`/custom-apis/${apiId}/versions`, data)
}

export function rollbackCustomApiVersion(apiId: string, versionId: string) {
  return request.post(`/custom-apis/${apiId}/versions/${versionId}/rollback`)
}

export function deleteCustomApiVersion(apiId: string, versionId: string) {
  return request.delete(`/custom-apis/${apiId}/versions/${versionId}`)
}
