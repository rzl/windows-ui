import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth'
import type { LoginForm } from '@/api/auth'
import { connectWebSocket, disconnectWebSocket, watchVisibilityForReconnect } from '@/utils/websocket'
import { useAppStore } from './app'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('lowcode_token') || '')
  const refreshTokenValue = ref(localStorage.getItem('lowcode_refresh_token') || '')
  const tenantCode = ref(localStorage.getItem('lowcode_tenant_code') || '')
  const userInfo = ref<any>(null)
  const permissions = ref<string[]>([])
  const errorMessage = ref('')

  const isLoggedIn = computed(() => !!token.value)
  const isAuthenticated = computed(() => !!token.value && !!userInfo.value)

  function showError(message: string) {
    errorMessage.value = message
    // 也可以调用组件库 message
    console.error(message)
  }

  function initWebSocket() {
    if (!userInfo.value?.id) return
    const appStore = useAppStore()
    connectWebSocket(userInfo.value.id, userInfo.value.nickname || userInfo.value.username, {
      onNewMessage: () => {
        appStore.incrementUnreadMessageCount()
      }
    })
    watchVisibilityForReconnect(userInfo.value.id, userInfo.value.nickname || userInfo.value.username)
  }

  function setTokens(accessToken: string, refreshToken: string) {
    token.value = accessToken
    refreshTokenValue.value = refreshToken
    localStorage.setItem('lowcode_token', accessToken)
    localStorage.setItem('lowcode_refresh_token', refreshToken)
  }

  function clearTokens() {
    token.value = ''
    refreshTokenValue.value = ''
    tenantCode.value = ''
    userInfo.value = null
    permissions.value = []
    localStorage.removeItem('lowcode_token')
    localStorage.removeItem('lowcode_refresh_token')
    localStorage.removeItem('lowcode_tenant_code')
    disconnectWebSocket()
  }

  async function login(form: LoginForm) {
    const result = await authApi.login(form)
    setTokens(result.accessToken, result.refreshToken)
    if (form.tenantCode !== undefined) {
      tenantCode.value = form.tenantCode
      localStorage.setItem('lowcode_tenant_code', form.tenantCode)
    }
    userInfo.value = result.userInfo
    initWebSocket()
    return result
  }

  async function fetchProfile() {
    const result = await authApi.getProfile()
    userInfo.value = result
    permissions.value = result.permissions || []
    initWebSocket()
    return result
  }

  async function refresh() {
    const rt = refreshTokenValue.value || localStorage.getItem('lowcode_refresh_token')
    if (!rt) {
      throw new Error('刷新令牌不存在')
    }
    const result = await authApi.refreshToken(rt)
    setTokens(result.accessToken, result.refreshToken)
    return result
  }

  async function logout() {
    const currentToken = token.value
    if (currentToken) {
      try {
        // 先调用后端退出，此时 localStorage 中的令牌仍未清除，请求头可正常携带
        await authApi.logout()
      } catch {
        // 忽略退出接口失败
      }
    }
    clearTokens()
  }

  function hasPermission(code: string) {
    if (!code) return true
    if (permissions.value.includes('*')) return true
    return permissions.value.includes(code)
  }

  return {
    token,
    refreshTokenValue,
    tenantCode,
    userInfo,
    permissions,
    isLoggedIn,
    isAuthenticated,
    login,
    fetchProfile,
    refresh,
    logout,
    hasPermission,
    showError,
    errorMessage
  }
})
