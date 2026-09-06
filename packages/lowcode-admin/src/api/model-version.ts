import request from './request'

export function getModelVersions(modelId: string) {
  return request.get(`/lowcode/models/${modelId}/versions`)
}

export function createModelVersion(modelId: string, data: { version: string; description?: string }) {
  return request.post(`/lowcode/models/${modelId}/versions`, data)
}

export function rollbackModelVersion(modelId: string, versionId: string) {
  return request.post(`/lowcode/models/${modelId}/versions/${versionId}/rollback`)
}

export function deleteModelVersion(modelId: string, versionId: string) {
  return request.delete(`/lowcode/models/${modelId}/versions/${versionId}`)
}
