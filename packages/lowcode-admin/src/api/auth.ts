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

export interface ProfileForm {
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
}

export interface PasswordForm {
  oldPassword: string
  newPassword: string
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

export function updateProfile(data: ProfileForm) {
  return request.put('/auth/profile', data)
}

export function changePassword(data: PasswordForm) {
  return request.put('/auth/password', data)
}

export function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<{ name: string; url: string; size: number }>('/common/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
