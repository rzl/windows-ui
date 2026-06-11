import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { delay, mockRoles } from '@/mock/data'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const userInfo = ref<any>(null)
  const role = ref('')

  const isLoggedIn = computed(() => !!token.value)
  const permissions = computed(() => {
    const r = mockRoles.find((x) => x.code === role.value)
    return r ? r.permissions : []
  })

  async function login(form: { username: string; password: string }) {
    await delay(null, 500)
    if (form.username === 'admin' && form.password === 'admin') {
      role.value = 'admin'
    } else if (form.username === 'editor' && form.password === 'editor') {
      role.value = 'editor'
    } else if (form.username === 'viewer' && form.password === 'viewer') {
      role.value = 'viewer'
    } else {
      throw new Error('用户名或密码错误')
    }
    token.value = `mock-token-${Date.now()}`
    localStorage.setItem('admin_token', token.value)
    userInfo.value = { username: form.username, nickname: form.username, avatar: '' }
    return userInfo.value
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    role.value = ''
    localStorage.removeItem('admin_token')
  }

  function hasPermission(code: string) {
    if (role.value === 'admin' || permissions.value.includes('*')) return true
    return permissions.value.includes(code)
  }

  return { token, userInfo, role, isLoggedIn, permissions, login, logout, hasPermission }
})
