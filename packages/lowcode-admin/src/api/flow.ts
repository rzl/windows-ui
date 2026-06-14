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

export function deleteFlowDefinition(id: number) {
  return request.delete(`/flow/definitions/${id}`)
}

export function startFlowInstance(flowCode: string, businessKey: number) {
  return request.post('/flow/instances/start', { flowCode, businessKey })
}

export function getInstanceStatus(businessKey: number) {
  return request.get(`/flow/instances/status/${businessKey}`)
}

export function getFlowTrace(businessKey: number) {
  return request.get(`/flow/instances/trace/${businessKey}`)
}

export function getPendingTasks() {
  return request.get('/flow/tasks/pending')
}

export function approveTask(id: number, comment?: string) {
  return request.post(`/flow/tasks/${id}/approve`, { comment })
}

export function rejectTask(id: number, comment?: string) {
  return request.post(`/flow/tasks/${id}/reject`, { comment })
}
