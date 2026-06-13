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
        </div>
        <div class="header-right">
          <span>{{ auth.userInfo?.nickname }}</span>
          <w-button size="small" @click="handleLogout">
            <w-icon name="logout" size="small" /> 退出
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
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useMenuStore } from '@/stores/menu'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()
const menu = useMenuStore()

menu.loadMenus()

function transformMenu(items: any[]): any[] {
  return items.map((item) => ({
    label: item.title,
    icon: item.icon,
    value: item.path,
    children: item.children?.length ? transformMenu(item.children) : undefined
  }))
}

const menuItems = computed(() => transformMenu(menu.menus))

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
