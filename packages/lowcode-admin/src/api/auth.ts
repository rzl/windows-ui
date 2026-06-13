import request from './request'

export interface LoginForm {
  username: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  userInfo: {
    id: number
    username: string
    nickname: string
    email: string
    phone: string
    avatar: string
    roleId: number
    deptId: number
  }
}

export function login(data: LoginForm) {
  return request.post<LoginResult>('/auth/login', data)
}

export function logout() {
  return request.post('/auth/logout')
}

export function getProfile() {
  return request.get('/auth/profile')
}
