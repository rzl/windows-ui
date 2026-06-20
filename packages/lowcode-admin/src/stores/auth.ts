import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth'
import type { LoginForm } from '@/api/auth'
import { connectWebSocket, disconnectWebSocket, watchVisibilityForReconnect } from '@/utils/websocket'
import { useAppStore } from './app'

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

  async function login(form: LoginForm) {
    const result = await authApi.login(form)
    token.value = result.accessToken
    userInfo.value = result.userInfo
    localStorage.setItem('lowcode_token', result.accessToken)
    localStorage.setItem('lowcode_refresh_token', result.refreshToken)
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

  function logout() {
    token.value = ''
    userInfo.value = null
    permissions.value = []
    localStorage.removeItem('lowcode_token')
    localStorage.removeItem('lowcode_refresh_token')
    disconnectWebSocket()
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
