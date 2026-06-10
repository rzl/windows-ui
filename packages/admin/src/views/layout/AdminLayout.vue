<template>
  <w-config-provider :size="app.size" :theme="app.theme">
    <div class="admin-layout">
      <aside class="admin-sidebar" :class="{ collapsed: app.sidebarCollapsed }">
        <div class="sidebar-logo">
          <w-icon name="computer" />
          <span v-show="!app.sidebarCollapsed">Admin</span>
        </div>
        <w-menu
          :items="menuItems"
          mode="vertical"
          :collapse="app.sidebarCollapsed"
          :default-active="route.path"
          @select="handleMenuSelect"
        />
      </aside>
      <div class="admin-main">
        <header class="admin-header">
          <div class="header-left">
            <w-button size="small" @click="app.toggleSidebar">
              <w-icon name="menu" size="small" />
            </w-button>
            <Breadcrumb />
          </div>
          <div class="header-right">
            <Screenfull />
            <w-button size="small" @click="settingVisible = true">
              <w-icon name="setting" size="small" />
            </w-button>
            <div class="user-dropdown" v-click-outside="closeUserMenu">
              <div class="user-trigger" @click="showUserMenu = !showUserMenu">
                <w-icon name="user" size="small" />
                <span>{{ auth.userInfo?.nickname }}</span>
                <w-icon :name="showUserMenu ? 'arrowUp' : 'arrowDown'" size="small" />
              </div>
              <div v-show="showUserMenu" class="user-menu">
                <div class="user-menu-item" @click="goProfile">
                  <w-icon name="user" size="small" /> 个人中心
                </div>
                <div class="user-menu-item" @click="handleLogout">
                  <w-icon name="logout" size="small" /> 退出登录
                </div>
              </div>
            </div>
          </div>
        </header>

        <div class="tab-bar">
          <div
            v-for="tab in app.visitedViews"
            :key="tab.path"
            :class="['tab-item', { active: route.path === tab.path }]"
            @click="router.push(tab.path)"
            @contextmenu.prevent="showContextMenu($event, tab)"
          >
            <span>{{ tab.title }}</span>
            <w-icon
              v-if="tab.path !== '/dashboard'"
              name="close"
              size="small"
              class="tab-close"
              @click.stop="closeTab(tab)"
            />
          </div>
        </div>

        <main class="admin-content">
          <router-view />
        </main>
      </div>
    </div>

    <div
      v-show="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div class="context-item" @click="refreshTab">刷新页面</div>
      <div class="context-item" @click="closeCurrentTab">关闭当前</div>
      <div class="context-item" @click="closeOthersTab">关闭其他</div>
      <div class="context-item" @click="closeAllTab">关闭全部</div>
    </div>
    <w-drawer v-model="settingVisible" title="系统配置" width="360">
      <div class="setting-section">
        <h4>语言设置</h4>
        <w-space>
          <w-button
            v-for="opt in langOptions"
            :key="opt.value"
            :type="locale === opt.value ? 'primary' : 'default'"
            size="small"
            @click="switchLang(opt.value)"
          >
            {{ opt.label }}
          </w-button>
        </w-space>
      </div>

      <w-divider />

      <div class="setting-section">
        <h4>主题色</h4>
        <div class="color-row">
          <input type="color" :value="app.theme.primary" @change="e => setPrimary((e.target as HTMLInputElement).value)">
          <span>{{ app.theme.primary }}</span>
        </div>
      </div>

      <w-divider />

      <div class="setting-section">
        <h4>组件大小</h4>
        <w-space>
          <w-button
            v-for="s in sizeOptions"
            :key="s.value"
            :type="app.size === s.value ? 'primary' : 'default'"
            size="small"
            @click="app.size = s.value"
          >
            {{ s.label }}
          </w-button>
        </w-space>
      </div>

      <w-divider />

      <div class="setting-section">
        <w-button @click="resetSettings">恢复默认</w-button>
      </div>
    </w-drawer>
  </w-config-provider>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { mockMenus } from '@/mock/data'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Screenfull from '@/components/Screenfull.vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()
const { locale } = useI18n()

const settingVisible = ref(false)

const langOptions = [
  { label: "中文", value: "zh-CN" },
  { label: "English", value: "en-US" }
]

const sizeOptions = [
  { label: "小", value: "small" },
  { label: "默认", value: "default" },
  { label: "大", value: "large" }
] as const

function switchLang(val: string) {
  locale.value = val
  app.lang = val
  localStorage.setItem("admin_lang", val)
}

function setPrimary(color: string) {
  app.theme = { ...app.theme, primary: color }
}

function resetSettings() {
  app.size = "default"
  app.theme = { primary: "#245edb", success: "#3a9e3a", warning: "#e4a010", danger: "#d92b2b" }
  locale.value = "zh-CN"
  app.lang = "zh-CN"
  localStorage.setItem("admin_lang", "zh-CN")
}

const showUserMenu = ref(false)
const contextMenu = ref({ visible: false, x: 0, y: 0, targetPath: '' })

const visibleMenus = computed(() => {
  return mockMenus.filter((m) => {
    const perms = m.permissions || []
    return perms.some((p) => auth.hasPermission(p))
  })
})

function transformMenu(items: any[]): any[] {
  return items.map((item) => ({
    label: item.label,
    icon: item.icon,
    value: item.path,
    children: item.children ? transformMenu(item.children) : undefined
  }))
}

const menuItems = computed(() => transformMenu(visibleMenus.value))

function handleMenuSelect(value: string) {
  router.push(value)
}

function closeUserMenu() {
  showUserMenu.value = false
}

function goProfile() {
  showUserMenu.value = false
  router.push('/profile')
}

function handleLogout() {
  showUserMenu.value = false
  auth.logout()
  router.push('/login')
}

// Tabs
watch(
  () => route.path,
  () => {
    if (route.meta?.title) {
      app.addView({
        name: route.name as string,
        path: route.path,
        title: route.meta.title as string
      })
    }
  },
  { immediate: true }
)

function closeTab(tab: any) {
  app.removeView(tab.path)
  if (route.path === tab.path) {
    const views = app.visitedViews
    const idx = views.findIndex((v) => v.path === tab.path)
    const next = views[idx - 1] || views[idx] || views[0]
    if (next) router.push(next.path)
  }
}

function showContextMenu(e: MouseEvent, tab: any) {
  contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, targetPath: tab.path }
}

function hideContextMenu() {
  contextMenu.value.visible = false
}

function refreshTab() {
  hideContextMenu()
  router.go(0)
}

function closeCurrentTab() {
  hideContextMenu()
  const tab = app.visitedViews.find((v) => v.path === contextMenu.value.targetPath)
  if (tab) closeTab(tab)
}

function closeOthersTab() {
  hideContextMenu()
  app.removeOthers(contextMenu.value.targetPath)
}

function closeAllTab() {
  hideContextMenu()
  app.removeAll()
  router.push('/dashboard')
}

onMounted(() => {
  document.addEventListener('click', hideContextMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', hideContextMenu)
})

const vClickOutside = {
  mounted(el: any, binding: any) {
    el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el._clickOutside)
  }
}
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--w-bg-color);
  border-right: 2px solid #808080;
  display: flex;
  flex-direction: column;
  transition: width 0.2s;
}
.admin-sidebar.collapsed { width: 64px; }
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #d4d0c8;
  font-weight: bold;
  color: var(--w-color-primary);
  white-space: nowrap;
  overflow: hidden;
}
.sidebar-nav { padding: 4px; }
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #000;
  text-decoration: none;
  font-size: 13px;
  border: 1px solid transparent;
  cursor: pointer;
}
.sidebar-link:hover {
  background: var(--w-xp-blue-light);
  color: #fff;
}
.sidebar-link.active {
  background: var(--w-color-primary);
  color: #fff;
  font-weight: bold;
}
.menu-parent { justify-content: space-between; position: relative; }
.menu-arrow { margin-left: auto; }
.submenu { padding-left: 8px; }
.sub-link { padding-left: 20px; font-size: 12px; }
.sub-parent { padding-left: 20px; font-size: 12px; justify-content: space-between; }
.sub2-link { padding-left: 32px; font-size: 12px; }
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--w-bg-color);
  border-bottom: 2px solid;
  border-color: #fff #808080 #808080 #fff;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.header-right { display: flex; align-items: center; gap: 12px; }
.user-dropdown { position: relative; }
.user-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 13px;
}
.user-trigger:hover { background: var(--w-xp-blue-light); color: #fff; }
.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 140px;
  background: var(--w-bg-color);
  border: 1px solid #808080;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  z-index: 999;
}
.user-menu-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
}
.user-menu-item:hover { background: var(--w-xp-blue-light); color: #fff; }

/* Tab Bar */
.tab-bar {
  display: flex;
  gap: 2px;
  padding: 4px 8px;
  background: #f0f0f0;
  border-bottom: 1px solid #d4d0c8;
  overflow-x: auto;
}
.tab-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: var(--w-bg-color);
  border: 1px solid #d4d0c8;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
}
.tab-item:hover { background: #e8e8e8; }
.tab-item.active {
  background: var(--w-color-primary);
  color: #fff;
  border-color: var(--w-color-primary);
}
.tab-close {
  cursor: pointer;
  opacity: 0.7;
}
.tab-close:hover { opacity: 1; }

/* Context Menu */
.context-menu {
  position: fixed;
  background: var(--w-bg-color);
  border: 1px solid #808080;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  z-index: 9999;
  min-width: 120px;
}
.context-item {
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}
.context-item:hover {
  background: var(--w-xp-blue-light);
  color: #fff;
}

.admin-content { flex: 1; padding: 16px; overflow: auto; }

/* Setting Drawer */
.setting-section { margin-bottom: 16px; }
.setting-section h4 { margin: 0 0 8px; font-size: 14px; color: var(--w-color-primary); }
.color-row { display: flex; align-items: center; gap: 8px; }

</style>
