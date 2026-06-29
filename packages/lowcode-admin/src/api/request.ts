import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

interface RetryConfig extends InternalAxiosRequestConfig {
  __retry?: boolean
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

let isRefreshing = false
let isRedirecting = false
let refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken))
  refreshSubscribers = []
}

async function redirectToLogin() {
  if (isRedirecting) return
  isRedirecting = true

  const auth = useAuthStore()
  auth.logout()

  try {
    const { default: router } = await import('@/router')
    const current = router.currentRoute.value
    if (current.path !== '/login') {
      router.replace({
        path: '/login',
        query: { redirect: current.fullPath }
      })
    }
  } catch {
    // 路由未就绪时回退到 hash 跳转
    if (window.location.hash !== '#/login') {
      window.location.href = '/#/login'
    }
  } finally {
    isRedirecting = false
  }
}

async function handleUnauthorized(message: string, originalRequest?: RetryConfig) {
  const refreshToken = localStorage.getItem('lowcode_refresh_token')

  // 没有刷新令牌、已经是重试请求、或者是刷新/退出接口本身失败，直接跳转登录
  if (!refreshToken || originalRequest?.__retry || originalRequest?.url === '/auth/refresh' || originalRequest?.url === '/auth/logout') {
    redirectToLogin()
    return Promise.reject(new Error(message))
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((token) => {
        if (!originalRequest) {
          reject(new Error(message))
          return
        }
        originalRequest.headers.Authorization = `Bearer ${token}`
        resolve(instance(originalRequest))
      })
    })
  }

  isRefreshing = true
  if (originalRequest) {
    originalRequest.__retry = true
  }

  try {
    const auth = useAuthStore()
    const result = await auth.refresh()
    onTokenRefreshed(result.accessToken)
    if (originalRequest) {
      originalRequest.headers.Authorization = `Bearer ${result.accessToken}`
      return instance(originalRequest)
    }
    return Promise.resolve(undefined)
  } catch (refreshError) {
    redirectToLogin()
    return Promise.reject(refreshError)
  } finally {
    isRefreshing = false
  }
}

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
    if (data.code === 200) {
      return data.data
    }

    const message = data.message || '请求失败'

    // 后端通过 body 返回 401（未登录/令牌过期/令牌失效）
    if (data.code === 401) {
      return handleUnauthorized(message, response.config as RetryConfig)
    }

    if (typeof window !== 'undefined') {
      const auth = useAuthStore()
      auth.showError?.(message)
    }
    return Promise.reject(new Error(message))
  },
  (error) => {
    const message = error.response?.data?.message || error.message || '网络错误'
    const status = error.response?.status

    // HTTP 401 也统一处理
    if (status === 401) {
      return handleUnauthorized(message, error.config as RetryConfig)
    }

    if (typeof window !== 'undefined') {
      const auth = useAuthStore()
      auth.showError?.(message)
    }
    return Promise.reject(new Error(message))
  }
)

export default instance
