<template>
  <div class="page-tabs-bar">
    <div class="page-tabs">
      <div
        v-for="p in pages"
        :key="p.code"
        :class="['page-tab', { active: activeCode === p.code }]"
        @click="emit('switch', p.code)"
      >
        <component :is="iconTag" v-if="p.isMain" name="document" class="page-tab-icon" />
        <span class="page-tab-name">{{ p.name }}</span>
        <span v-if="!p.isMain" class="page-tab-close" title="删除子页面" @click.stop="emit('delete', p.code)">×</span>
      </div>
    </div>
    <component :is="buttonTag" size="mini" @click="emit('add')">+ 子页面</component>
  </div>
</template>

<script setup lang="ts">
import { usePrefix } from '../../utils/prefix'
import type { PageItem } from './types'

defineOptions({ name: 'DesignerPageTabs' })

const props = defineProps<{
  pages: PageItem[]
  activeCode: string
}>()

const emit = defineEmits<{
  (e: 'switch', code: string): void
  (e: 'add'): void
  (e: 'delete', code: string): void
}>()

const { withPrefix } = usePrefix()
const buttonTag = withPrefix('button')
const iconTag = withPrefix('icon')

void props
</script>

<style scoped>
.page-tabs-bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--w-fill-color); border-bottom: 1px solid var(--w-border-color); }
.page-tabs { display: flex; gap: 4px; flex: 1; overflow-x: auto; }
.page-tab { display: flex; align-items: center; gap: 4px; padding: 6px 12px; cursor: pointer; border: 1px solid transparent; border-radius: 4px; background: transparent; font-size: 13px; white-space: nowrap; color: var(--w-text-color-secondary); }
.page-tab:hover { background: var(--w-fill-color-light); color: var(--w-text-color-regular); }
.page-tab.active { background: var(--w-bg-color); color: var(--w-color-primary); border-color: var(--w-border-color); font-weight: bold; }
.page-tab-icon { font-size: 14px; }
.page-tab-close { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; margin-left: 4px; border-radius: 50%; font-size: 14px; line-height: 1; }
.page-tab-close:hover { background: var(--w-fill-color-dark); }
</style>
