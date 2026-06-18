import request from './request'

export function getPages() {
  return request.get('/pages/pages')
}

export function getPage(code: string) {
  return request.get(`/pages/pages/${code}`)
}

export function savePage(data: any) {
  return request.post('/pages/pages', data)
}

export function deletePage(id: number) {
  return request.delete(`/pages/pages/${id}`)
}

export function executePageDataSource(code: string, dataSource: any, ctx?: any) {
  return request.post(`/pages/pages/${code}/execute`, { dataSource, ctx })
}
