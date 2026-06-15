import request from './request'

export interface AuditLogQuery {
  modelCode?: string
  action?: string
  recordId?: number
  operatorName?: string
  startTime?: string
  endTime?: string
  page?: number
  pageSize?: number
}

export function getAuditLogs(params: AuditLogQuery) {
  return request.get('/audit-logs', { params })
}

export function getAuditLogDetail(id: number) {
  return request.get(`/audit-logs/${id}`)
}

export function getAuditActions() {
  return request.get('/audit-logs/actions')
}
