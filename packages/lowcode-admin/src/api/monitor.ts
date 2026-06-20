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
