export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export function success<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return { code: 200, message, data }
}

export function error(message = '操作失败', code = 500, data: any = null): ApiResponse {
  return { code, message, data }
}

export class AppError extends Error {
  code: number

  constructor(message: string, code = 500) {
    super(message)
    this.code = code
    this.name = 'AppError'
  }
}
