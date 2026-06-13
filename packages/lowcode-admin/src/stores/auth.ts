import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth'
import type { LoginForm } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('lowcode_token') || '')
  const userInfo = ref<any>(null)
  const permissions = ref<string[]>([])
  const errorMessage = ref('')

  const isLoggedIn = computed(() => !!token.value)

  function showError(message: string) {
    errorMessage.value = message
    // 也可以调用组件库 message
    console.error(message)
  }

  async function login(form: LoginForm) {
    const result = await authApi.login(form)
    token.value = result.accessToken
    userInfo.value = result.userInfo
    localStorage.setItem('lowcode_token', result.accessToken)
    localStorage.setItem('lowcode_refresh_token', result.refreshToken)
    return result
  }

  async function fetchProfile() {
    const result = await authApi.getProfile()
    userInfo.value = result
    permissions.value = result.permissions || []
    return result
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    permissions.value = []
    localStorage.removeItem('lowcode_token')
    localStorage.removeItem('lowcode_refresh_token')
  }

  function hasPermission(code: string) {
    if (!code) return true
    if (permissions.value.includes('*')) return true
    return permissions.value.includes(code)
  }

  return {
    token,
    userInfo,
    permissions,
    isLoggedIn,
    login,
    fetchProfile,
    logout,
    hasPermission,
    showError,
    errorMessage
  }
})
