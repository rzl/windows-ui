import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 自定义 axios 实例，响应拦截器已剥离外层 ApiResponse
interface LowcodeRequest extends AxiosInstance {
  get<T = any>(url: string, config?: any): Promise<T>
  post<T = any>(url: string, data?: any, config?: any): Promise<T>
  put<T = any>(url: string, data?: any, config?: any): Promise<T>
  delete<T = any>(url: string, config?: any): Promise<T>
}

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000
}) as LowcodeRequest

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lowcode_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const data = response.data
    if (data.code !== 200) {
      const message = data.message || '请求失败'
      if (typeof window !== 'undefined') {
        const auth = useAuthStore()
        auth.showError?.(message)
      }
      return Promise.reject(new Error(message))
    }
    return data.data
  },
  (error) => {
    const message = error.response?.data?.message || error.message || '网络错误'
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      window.location.href = '/#/login'
    }
    return Promise.reject(new Error(message))
  }
)

export default instance
