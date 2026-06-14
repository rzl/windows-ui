import request from './request'

export function getPositions() {
  return request.get('/system/positions')
}

export function createPosition(data: any) {
  return request.post('/system/positions', data)
}

export function updatePosition(id: number, data: any) {
  return request.put(`/system/positions/${id}`, data)
}

export function deletePosition(id: number) {
  return request.delete(`/system/positions/${id}`)
}
