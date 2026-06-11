import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export interface TabItem {
  name: string
  path: string
  title: string
}

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const size = ref<'small' | 'default' | 'large'>('default')
  const theme = reactive({
    primary: '#245edb',
    success: '#3a9e3a',
    warning: '#e4a010',
    danger: '#d92b2b'
  })
  const lang = ref(localStorage.getItem('admin_lang') || 'zh-CN')
  const visitedViews = ref<TabItem[]>([
    { name: 'Dashboard', path: '/dashboard', title: '仪表盘' }
  ])

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

  return { sidebarCollapsed, size, theme, lang, visitedViews, toggleSidebar, addView, removeView, removeOthers, removeAll }
})
