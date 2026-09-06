import request from './request'

export function getScheduledTasks() {
  return request.get('/schedule/tasks')
}

export function saveScheduledTask(data: any) {
  return data.id ? request.put(`/schedule/tasks/${data.id}`, data) : request.post('/schedule/tasks', data)
}

export function deleteScheduledTask(id: string) {
  return request.delete(`/schedule/tasks/${id}`)
}

export function getTaskLogs(id: string) {
  return request.get(`/schedule/tasks/${id}/logs`)
}

export function runTask(id: string) {
  return request.post(`/schedule/tasks/${id}/run`)
}
