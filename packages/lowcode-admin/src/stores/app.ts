import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { setGlobalLocale, type LocaleType } from '@/locale'

export interface TabItem {
  name: string
  path: string
  title: string
}

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
  const size = ref<'small' | 'default' | 'large'>(saved?.size || 'default')
  const locale = ref<LocaleType>(saved?.locale || 'zh-CN')
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

  setGlobalLocale(locale.value)

  watch([size, locale, vconsoleEnabled, theme], () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        size: size.value,
        locale: locale.value,
        vconsoleEnabled: vconsoleEnabled.value,
        theme: { primary: theme.primary, success: theme.success, warning: theme.warning, danger: theme.danger }
      })
    )
    setGlobalLocale(locale.value)
  }, { deep: true })

  function setLocale(value: LocaleType) {
    locale.value = value
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
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

  return {
    sidebarCollapsed,
    size,
    locale,
    vconsoleEnabled,
    theme,
    visitedViews,
    toggleSidebar,
    setLocale,
    addView,
    removeView,
    removeOthers,
    removeAll
  }
})
