import request from './request'

export function getFlowDefinitions() {
  return request.get('/flow/definitions')
}

export function getFlowDefinition(code: string) {
  return request.get(`/flow/definitions/${code}`)
}

export function getFlowDefinitionByModel(modelCode: string) {
  return request.get(`/flow/definitions/model/${modelCode}`)
}

export function saveFlowDefinition(data: any) {
  return request.post('/flow/definitions', data)
}

export function deleteFlowDefinition(id: string) {
  return request.delete(`/flow/definitions/${id}`)
}

export function startFlowInstance(flowCode: string, businessKey: string) {
  return request.post('/flow/instances/start', { flowCode, businessKey })
}

export function getInstanceStatus(businessKey: string) {
  return request.get(`/flow/instances/status/${businessKey}`)
}

export function getFlowTrace(businessKey: string) {
  return request.get(`/flow/instances/trace/${businessKey}`)
}

export function getPendingTasks() {
  return request.get('/flow/tasks/pending')
}

export function approveTask(id: string, comment?: string) {
  return request.post(`/flow/tasks/${id}/approve`, { comment })
}

export function rejectTask(id: string, comment?: string) {
  return request.post(`/flow/tasks/${id}/reject`, { comment })
}

export function transferTask(id: string, targetUserId: string) {
  return request.post(`/flow/tasks/${id}/transfer`, { targetUserId })
}

export function getFlowVersions(code: string) {
  return request.get(`/flow/definitions/${code}/versions`)
}

export function rollbackFlowDefinition(code: string, version: number) {
  return request.post(`/flow/definitions/${code}/rollback`, { version })
}

export function getFlowDelegations(params?: any) {
  return request.get('/flow/delegations', { params })
}

export function createFlowDelegation(data: any) {
  return request.post('/flow/delegations', data)
}

export function updateFlowDelegation(id: string, data: any) {
  return request.put(`/flow/delegations/${id}`, data)
}

export function deleteFlowDelegation(id: string) {
  return request.delete(`/flow/delegations/${id}`)
}

export function checkFlowTimeout() {
  return request.post('/flow/check-timeout')
}

export function getFlowPerformanceByDefinition(params?: any) {
  return request.get('/flow/performance/definitions', { params })
}

export function getFlowPerformanceByNode(params?: any) {
  return request.get('/flow/performance/nodes', { params })
}

export function urgeTask(id: string) {
  return request.post(`/flow/tasks/${id}/urge`)
}

export function urgeInstance(id: string) {
  return request.post(`/flow/instances/${id}/urge`)
}

export function terminateInstance(id: string, reason: string) {
  return request.post(`/flow/instances/${id}/terminate`, { reason })
}
