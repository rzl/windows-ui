<template>
  <div class="left-sidebar">
    <div
      v-for="item in items"
      :key="item.value"
      :class="['sidebar-btn', { active: mode === item.value }]"
      :title="item.label"
      @click="emit('change-mode', item.value)"
    >
      <component :is="iconTag" :name="item.icon" />
      <span class="sidebar-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePrefix } from '../../utils/prefix'

defineOptions({ name: 'DesignerSidebar' })

const props = defineProps<{
  mode: 'library' | 'outline' | 'pages'
}>()

const emit = defineEmits<{
  (e: 'change-mode', mode: 'library' | 'outline' | 'pages'): void
}>()

const { withPrefix } = usePrefix()
const iconTag = withPrefix('icon')

const items = [
  { value: 'library' as const, label: '组件库', icon: 'grid' },
  { value: 'outline' as const, label: '大纲', icon: 'list' },
  { value: 'pages' as const, label: '页面信息', icon: 'document' }
]

void props
</script>

<style scoped>
.left-sidebar { width: 44px; display: flex; flex-direction: column; border-right: 1px solid var(--w-border-color); background: var(--w-fill-color); flex-shrink: 0; }
.sidebar-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 4px; cursor: pointer; color: var(--w-text-color-secondary); font-size: 11px; gap: 4px; transition: background 0.15s; }
.sidebar-btn:hover { background: var(--w-fill-color-light); color: var(--w-text-color-regular); }
.sidebar-btn.active { background: var(--w-color-primary, #245edb); color: var(--w-text-color-inverse); }
.sidebar-label { writing-mode: horizontal-tb; }
</style>
