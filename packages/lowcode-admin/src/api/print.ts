import request from './request'

export interface PrintTemplateForm {
  id?: number
  code?: string
  name?: string
  modelCode?: string
  paperSize?: string
  orientation?: string
  config?: any
  pageStyle?: any
  status?: number
}

export function getPrintTemplates(modelCode?: string) {
  return request.get('/print/templates', { params: { modelCode } })
}

export function getPrintTemplate(code: string) {
  return request.get(`/print/templates/${code}`)
}

export function savePrintTemplate(data: PrintTemplateForm) {
  return request.post('/print/templates', data)
}

export function deletePrintTemplate(id: number) {
  return request.delete(`/print/templates/${id}`)
}

export function previewPrintTemplate(code: string, data: { recordId?: number; recordIds?: number[] }) {
  return request.post(`/print/templates/${code}/preview`, data)
}

export function exportPrintTemplatePdf(code: string, data: { recordId?: number; recordIds?: number[] }) {
  return request.post(`/print/templates/${code}/pdf`, data)
}
