<template>
  <div class="admin-layout">
    <aside class="admin-sidebar" :class="{ collapsed: app.sidebarCollapsed }">
      <div class="sidebar-logo">
        <w-icon name="computer" />
        <span v-show="!app.sidebarCollapsed">Lowcode Admin</span>
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
          <w-breadcrumb :items="breadcrumbItems" />
        </div>
        <div class="header-right">
          <w-button size="small" @click="openSettings">
            <w-icon name="setting" size="small" />
          </w-button>
          <div class="user-info" @click="router.push('/profile')">
            <w-avatar
              :src="auth.userInfo?.avatar"
              :alt="auth.userInfo?.nickname"
              size="small"
            />
            <span>{{ auth.userInfo?.nickname }}</span>
          </div>
          <w-button size="small" @click="handleLogout">
            <w-icon name="logout" size="small" /> {{ t('退出') }}
          </w-button>
        </div>
      </header>

      <div class="tab-bar">
        <div
          v-for="tab in app.visitedViews"
          :key="tab.path"
          :class="['tab-item', { active: route.path === tab.path }]"
          @click="router.push(tab.path)"
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

  <w-drawer v-model="settingsVisible" :title="t('系统设置')" size="360px">
    <w-form>
      <w-form-item :label="t('系统语言')">
        <w-select v-model="settings.locale" :options="languageOptions" />
      </w-form-item>
      <w-form-item :label="t('组件尺寸')">
        <w-select v-model="settings.size" :options="sizeOptions" />
      </w-form-item>
      <w-form-item :label="t('主色')">
        <w-color-picker v-model="settings.theme.primary" />
      </w-form-item>
      <w-form-item :label="t('成功色')">
        <w-color-picker v-model="settings.theme.success" />
      </w-form-item>
      <w-form-item :label="t('警告色')">
        <w-color-picker v-model="settings.theme.warning" />
      </w-form-item>
      <w-form-item :label="t('危险色')">
        <w-color-picker v-model="settings.theme.danger" />
      </w-form-item>
      <w-form-item :label="t('启用VConsole')">
        <w-switch v-model="settings.vconsoleEnabled" :active-text="t('是')" :inactive-text="t('否')" />
      </w-form-item>
      <div class="settings-actions">
        <w-button type="primary" @click="saveSettings">{{ t('保存设置') }}</w-button>
        <w-button @click="settingsVisible = false">{{ t('取消') }}</w-button>
      </div>
    </w-form>
  </w-drawer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useMenuStore } from '@/stores/menu'
import { useLowcodeLocale, type LocaleType } from '@/locale'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()
const menu = useMenuStore()
const { t } = useLowcodeLocale()

menu.loadMenus()

const settingsVisible = ref(false)
const settings = reactive({
  locale: app.locale,
  size: app.size,
  vconsoleEnabled: app.vconsoleEnabled,
  theme: { ...app.theme }
})

const languageOptions = computed(() => [
  { label: t('中文'), value: 'zh-CN' },
  { label: t('英文'), value: 'en-US' }
])

const sizeOptions = computed(() => [
  { label: t('大'), value: 'large' },
  { label: t('默认'), value: 'default' },
  { label: t('小'), value: 'small' }
])

function openSettings() {
  settings.locale = app.locale
  settings.size = app.size
  settings.vconsoleEnabled = app.vconsoleEnabled
  settings.theme = { ...app.theme }
  settingsVisible.value = true
}

function saveSettings() {
  app.setLocale(settings.locale as LocaleType)
  app.size = settings.size
  app.vconsoleEnabled = settings.vconsoleEnabled
  app.theme.primary = settings.theme.primary
  app.theme.success = settings.theme.success
  app.theme.warning = settings.theme.warning
  app.theme.danger = settings.theme.danger
  settingsVisible.value = false
}

watch(() => app.locale, () => {
  settings.locale = app.locale
})

function transformMenu(items: any[]): any[] {
  return items.map((item) => ({
    label: item.title,
    icon: item.icon,
    value: item.path,
    children: item.children?.length ? transformMenu(item.children) : undefined
  }))
}

const menuItems = computed(() => transformMenu(menu.menus))

function flattenMenus(items: any[], result: any[] = []): any[] {
  items.forEach((item) => {
    result.push(item)
    if (item.children?.length) {
      flattenMenus(item.children, result)
    }
  })
  return result
}

function buildMenuChain(node: any, byId: Map<number, any>): any[] {
  const chain: any[] = []
  while (node) {
    chain.unshift(node)
    node = node.parent_id ? byId.get(node.parent_id) : undefined
  }
  return chain
}

const breadcrumbItems = computed(() => {
  const items: { label: string; href?: string }[] = [{ label: t('首页'), href: '/#/dashboard' }]
  const flat = flattenMenus(menu.menus)
  if (!flat.length) {
    return items
  }

  const byPath = new Map<string, any>()
  const byId = new Map<number, any>()
  flat.forEach((item) => {
    if (item.path) byPath.set(item.path, item)
    byId.set(item.id, item)
  })

  // 优先精确匹配菜单路径
  let current = byPath.get(route.path)
  if (current) {
    buildMenuChain(current, byId).forEach((node) => {
      items.push({ label: node.title })
    })
    return items
  }

  // 其次按最长前缀匹配（用于 /lowcode/design/:id 等详情页）
  const prefixItem = flat
    .filter((item) => item.path && route.path.startsWith(item.path + '/'))
    .sort((a, b) => b.path.length - a.path.length)[0]

  if (prefixItem) {
    buildMenuChain(prefixItem, byId).forEach((node) => {
      items.push({ label: node.title })
    })
  }

  if (route.meta?.title) {
    items.push({ label: route.meta.title as string })
  }

  return items
})

function handleMenuSelect(value: string) {
  router.push(value)
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

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
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.admin-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--w-bg-color);
  border-right: 2px solid #808080;
  display: flex;
  flex-direction: column;
  transition: width 0.2s;
}
.admin-sidebar.collapsed {
  width: 64px;
}
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
.header-right { display: flex; align-items: center; gap: 12px; font-size: 13px; }
.user-info { display: flex; align-items: center; gap: 8px; cursor: pointer; }

.settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

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

.admin-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>
