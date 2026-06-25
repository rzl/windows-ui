import request from './request'

export function getCustomApiVersions(apiId: number) {
  return request.get(`/custom-apis/${apiId}/versions`)
}

export function createCustomApiVersion(apiId: number, data: { version: string; description?: string }) {
  return request.post(`/custom-apis/${apiId}/versions`, data)
}

export function rollbackCustomApiVersion(apiId: number, versionId: number) {
  return request.post(`/custom-apis/${apiId}/versions/${versionId}/rollback`)
}

export function deleteCustomApiVersion(apiId: number, versionId: number) {
  return request.delete(`/custom-apis/${apiId}/versions/${versionId}`)
}
