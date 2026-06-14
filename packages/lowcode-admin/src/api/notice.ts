import request from './request'

export function getNotices() {
  return request.get('/system/notices')
}

export function createNotice(data: any) {
  return request.post('/system/notices', data)
}

export function updateNotice(id: number, data: any) {
  return request.put(`/system/notices/${id}`, data)
}

export function deleteNotice(id: number) {
  return request.delete(`/system/notices/${id}`)
}
