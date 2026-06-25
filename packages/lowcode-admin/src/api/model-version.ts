import request from './request'

export function getModelVersions(modelId: number) {
  return request.get(`/lowcode/models/${modelId}/versions`)
}

export function createModelVersion(modelId: number, data: { version: string; description?: string }) {
  return request.post(`/lowcode/models/${modelId}/versions`, data)
}

export function rollbackModelVersion(modelId: number, versionId: number) {
  return request.post(`/lowcode/models/${modelId}/versions/${versionId}/rollback`)
}

export function deleteModelVersion(modelId: number, versionId: number) {
  return request.delete(`/lowcode/models/${modelId}/versions/${versionId}`)
}
