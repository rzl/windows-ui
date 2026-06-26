import request from './request'

export function getMessageTemplates() {
  return request.get('/monitor/message-templates')
}

export function createMessageTemplate(data: any) {
  return request.post('/monitor/message-templates', data)
}

export function updateMessageTemplate(id: number, data: any) {
  return request.put(`/monitor/message-templates/${id}`, data)
}

export function deleteMessageTemplate(id: number) {
  return request.delete(`/monitor/message-templates/${id}`)
}

export function getMessages(params: any) {
  return request.get('/monitor/messages', { params })
}

export function sendMessage(data: any) {
  return request.post('/monitor/messages', data)
}

export function markMessageRead(id: number) {
  return request.put(`/monitor/messages/${id}/read`)
}

export function readAllMessages() {
  return request.post('/monitor/messages/read-all')
}

export function markMessageReadByBusinessKey(businessType: string, businessKey: string) {
  return request.put(`/monitor/messages/${businessType}/${businessKey}/read`)
}

export function deleteMessage(id: number) {
  return request.delete(`/monitor/messages/${id}`)
}

export function getUnreadCount(receiverId: number) {
  return request.get('/monitor/messages/unread-count', { params: { receiverId } })
}

export function getOperationLogs(params: any) {
  return request.get('/monitor/operation-logs', { params })
}

export function getDataLogs(params: any) {
  return request.get('/monitor/data-logs', { params })
}

export function getServerInfo() {
  return request.get('/monitor/server-info')
}

export function getOnlineUsers() {
  return request.get('/monitor/online-users')
}

// API 性能指标
export function getApiMetrics(params: any) {
  return request.get('/monitor/api-metrics', { params })
}

export function getApiPerformanceStats(params: any) {
  return request.get('/monitor/api-performance-stats', { params })
}

export function getApiTrend(params: any) {
  return request.get('/monitor/api-trend', { params })
}

// 慢 SQL
export function getSlowSqls(params: any) {
  return request.get('/monitor/slow-sqls', { params })
}

export function getSqlPerformanceStats(params: any) {
  return request.get('/monitor/sql-performance-stats', { params })
}

// 告警规则
export function getAlertRules(params?: any) {
  return request.get('/monitor/alert-rules', { params })
}

export function createAlertRule(data: any) {
  return request.post('/monitor/alert-rules', data)
}

export function updateAlertRule(id: number, data: any) {
  return request.put(`/monitor/alert-rules/${id}`, data)
}

export function deleteAlertRule(id: number) {
  return request.delete(`/monitor/alert-rules/${id}`)
}

// 告警记录
export function getAlertRecords(params?: any) {
  return request.get('/monitor/alert-records', { params })
}

export function getUnreadAlertCount() {
  return request.get('/monitor/alert-records/unread-count')
}

export function markAlertRecordRead(id: number) {
  return request.put(`/monitor/alert-records/${id}/read`)
}

export function resolveAlertRecord(id: number) {
  return request.put(`/monitor/alert-records/${id}/resolve`)
}

export function checkAlerts() {
  return request.post('/monitor/check-alerts')
}
