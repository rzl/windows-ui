import request from './request'

export function getStats(widgets?: any[]) {
  return widgets
    ? request.post('/dashboard/stats', { widgets })
    : request.get('/dashboard/stats')
}

export function getHomepageConfig(code = 'default') {
  return request.get('/dashboard/homepage', { params: { code } })
}

export function saveHomepageConfig(data: any) {
  return request.post('/dashboard/homepage', data)
}

export function getDashboards() {
  return request.get('/dashboard/dashboards')
}

export function getDashboard(code: string) {
  return request.get(`/dashboard/dashboards/${code}`)
}

export function createDashboard(data: any) {
  return request.post('/dashboard/dashboards', data)
}

export function updateDashboard(id: number, data: any) {
  return request.put(`/dashboard/dashboards/${id}`, data)
}

export function deleteDashboard(id: number) {
  return request.delete(`/dashboard/dashboards/${id}`)
}

export function executeDataSource(dataSource: any, ctx?: any) {
  return request.post('/dashboard/dashboards/data-source/execute', { dataSource, ctx })
}
