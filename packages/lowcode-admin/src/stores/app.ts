import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { setGlobalLocale, type LocaleType } from '@/locale'

export interface TabItem {
  name: string
  path: string
  title: string
}

export interface NotificationState {
  unreadMessageCount: number
  unreadTodoCount: number
  totalUnreadCount: number
}

export type LowcodeThemeMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'lowcode-admin-settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    // ignore
  }
  return null
}

const saved = loadSettings()

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const mobileSidebarVisible = ref(false)
  const isMobile = ref(false)
  const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const size = ref<'small' | 'default' | 'large'>(saved?.size || 'default')
  const locale = ref<LocaleType>(saved?.locale || 'zh-CN')
  const mode = ref<LowcodeThemeMode>(saved?.mode || 'light')
  const vconsoleEnabled = ref<boolean>(saved?.vconsoleEnabled || false)
  const theme = reactive({
    primary: saved?.theme?.primary || '#245edb',
    success: saved?.theme?.success || '#3a9e3a',
    warning: saved?.theme?.warning || '#e4a010',
    danger: saved?.theme?.danger || '#d92b2b'
  })
  const visitedViews = ref<TabItem[]>([
    { name: 'Dashboard', path: '/dashboard', title: '仪表盘' }
  ])

  const notification = reactive<NotificationState>({
    unreadMessageCount: 0,
    unreadTodoCount: 0,
    totalUnreadCount: 0
  })

  setGlobalLocale(locale.value)

  watch([size, locale, mode, vconsoleEnabled, theme], () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        size: size.value,
        locale: locale.value,
        mode: mode.value,
        vconsoleEnabled: vconsoleEnabled.value,
        theme: { primary: theme.primary, success: theme.success, warning: theme.warning, danger: theme.danger }
      })
    )
    setGlobalLocale(locale.value)
  }, { deep: true })

  function setLocale(value: LocaleType) {
    locale.value = value
  }

  function setMode(value: LowcodeThemeMode) {
    mode.value = value
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function openMobileSidebar() {
    mobileSidebarVisible.value = true
  }

  function closeMobileSidebar() {
    mobileSidebarVisible.value = false
  }

  function toggleMobileSidebar() {
    mobileSidebarVisible.value = !mobileSidebarVisible.value
  }

  function setMobile(value: boolean) {
    isMobile.value = value
    if (!value) {
      mobileSidebarVisible.value = false
    }
  }

  function setScreenWidth(width: number) {
    screenWidth.value = width
  }

  function addView(view: TabItem) {
    if (visitedViews.value.some((v) => v.path === view.path)) return
    visitedViews.value.push(view)
  }

  function removeView(path: string) {
    const idx = visitedViews.value.findIndex((v) => v.path === path)
    if (idx > -1) visitedViews.value.splice(idx, 1)
  }

  function removeOthers(path: string) {
    visitedViews.value = visitedViews.value.filter((v) => v.path === path || v.path === '/dashboard')
  }

  function removeAll() {
    visitedViews.value = [{ name: 'Dashboard', path: '/dashboard', title: '仪表盘' }]
  }

  function setNotificationState(state: Partial<NotificationState>) {
    if (state.unreadMessageCount !== undefined) notification.unreadMessageCount = state.unreadMessageCount
    if (state.unreadTodoCount !== undefined) notification.unreadTodoCount = state.unreadTodoCount
    notification.totalUnreadCount = notification.unreadMessageCount + notification.unreadTodoCount
  }

  function incrementUnreadMessageCount() {
    notification.unreadMessageCount++
    notification.totalUnreadCount++
  }

  function incrementUnreadTodoCount() {
    notification.unreadTodoCount++
    notification.totalUnreadCount++
  }

  return {
    sidebarCollapsed,
    mobileSidebarVisible,
    isMobile,
    screenWidth,
    size,
    locale,
    mode,
    vconsoleEnabled,
    theme,
    visitedViews,
    notification,
    toggleSidebar,
    openMobileSidebar,
    closeMobileSidebar,
    toggleMobileSidebar,
    setMobile,
    setScreenWidth,
    setLocale,
    setMode,
    addView,
    removeView,
    removeOthers,
    removeAll,
    setNotificationState,
    incrementUnreadMessageCount,
    incrementUnreadTodoCount
  }
})
