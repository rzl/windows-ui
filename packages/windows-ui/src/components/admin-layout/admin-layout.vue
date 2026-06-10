<template>
  <div class="w-admin-layout">
    <aside class="w-admin-layout__sidebar" :class="{ collapsed }">
      <div class="w-admin-layout__logo">
        <slot name="logo">
          <w-icon name="computer" />
          <span v-show="!collapsed">{{ title }}</span>
        </slot>
      </div>
      <div class="w-admin-layout__menu">
        <slot name="menu" />
      </div>
    </aside>
    <div class="w-admin-layout__main">
      <header class="w-admin-layout__header">
        <slot name="header" />
      </header>
      <main class="w-admin-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WAdminLayout' })
defineProps({
  collapsed: { type: Boolean, default: false },
  title: { type: String, default: 'Admin' }
})
</script>

<style scoped>
.w-admin-layout { display: flex; min-height: 100vh; }
.w-admin-layout__sidebar { width: 220px; flex-shrink: 0; background: var(--w-bg-color); border-right: 2px solid #808080; display: flex; flex-direction: column; transition: width 0.2s; }
.w-admin-layout__sidebar.collapsed { width: 64px; }
.w-admin-layout__logo { display: flex; align-items: center; gap: 8px; padding: 12px; border-bottom: 1px solid #d4d0c8; font-weight: bold; color: var(--w-color-primary); white-space: nowrap; overflow: hidden; }
.w-admin-layout__menu { padding: 4px; flex: 1; overflow-y: auto; }
.w-admin-layout__main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.w-admin-layout__header { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: var(--w-bg-color); border-bottom: 2px solid; border-color: #fff #808080 #808080 #fff; }
.w-admin-layout__content { flex: 1; padding: 16px; overflow: auto; }
</style>
