import request from './request'

export interface ReportForm {
  id?: number
  code?: string
  name?: string
  modelCode?: string
  config?: any
  status?: number
}

export function getReports() {
  return request.get('/report/reports')
}

export function getReport(code: string) {
  return request.get(`/report/reports/${code}`)
}

export function saveReport(data: ReportForm) {
  return request.post('/report/reports', data)
}

export function deleteReport(id: number) {
  return request.delete(`/report/reports/${id}`)
}

export function executeReport(code: string, data: { filters?: any[]; params?: any }) {
  return request.post(`/report/reports/${code}/execute`, data)
}

export function exportReportExcel(code: string, data: { filters?: any[]; params?: any }) {
  return request.post(`/report/reports/${code}/export`, data, { responseType: 'blob' })
}
