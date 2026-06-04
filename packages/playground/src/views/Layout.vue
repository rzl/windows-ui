<template>
  <w-config-provider prefix="w">
    <div class="playground">
      <header class="playground-header">
        <h1>🖥️ Windows UI</h1>
        <p>Vue 3 UI Library - Windows XP Style</p>
      </header>

      <div class="playground-body">
        <aside class="playground-sidebar">
          <nav class="sidebar-nav">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="['sidebar-link', { 'is-active': $route.path === item.path }]"
            >
              <w-icon v-if="item.icon" :name="item.icon" size="small" />
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </aside>

        <main class="playground-content">
          <router-view />
        </main>
      </div>
    </div>
  </w-config-provider>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const $route = useRoute()

const navItems = [
  { path: '/', label: '🏠 首页', icon: 'home' },
  { path: '/basic', label: '🔧 基础组件', icon: 'folder' },
  { path: '/form', label: '📝 表单组件', icon: 'folder' },
  { path: '/data', label: '📊 数据展示', icon: 'folder' },
  { path: '/nav', label: '🧭 导航组件', icon: 'folder' },
  { path: '/feedback', label: '💬 反馈组件', icon: 'folder' },
  { path: '/others', label: '📎 其他组件', icon: 'folder' },
]
</script>

<style scoped>
.playground { min-height: 100vh; display: flex; flex-direction: column; }
.playground-header { text-align: center; padding: 20px; background: linear-gradient(180deg, #1f91e5, #1a6fdc, #1a5dc6); color: #fff; flex-shrink: 0; }
.playground-header h1 { margin: 0 0 6px; font-size: 28px; }
.playground-header p { margin: 0; opacity: 0.9; font-size: 13px; }
.playground-body { display: flex; flex: 1; max-width: 1600px; margin: 0 auto; width: 100%; padding: 16px; gap: 16px; }
.playground-sidebar { width: 200px; flex-shrink: 0; position: sticky; top: 16px; align-self: flex-start; }
.sidebar-nav { background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; }
.sidebar-link { display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #000; text-decoration: none; font-size: 13px; border-bottom: 1px solid #d4d0c8; transition: background 0.15s; }
.sidebar-link:last-child { border-bottom: none; }
.sidebar-link:hover { background: var(--w-xp-blue-light); color: #fff; }
.sidebar-link.is-active { background: var(--w-color-primary); color: #fff; font-weight: bold; }
.playground-content { flex: 1; min-width: 0; }
</style>
