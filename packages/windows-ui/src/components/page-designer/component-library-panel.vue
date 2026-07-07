<template>
  <div class="component-library" :class="`component-library--${globalSize}`">
    <div class="library-header">
      <div class="panel-title">组件库</div>
      <div class="library-search">
        <component
          :is="inputTag"
          v-model="searchText"
          placeholder="搜索组件"
          :size="globalSize"
          clearable
        />
      </div>
    </div>
    <div
      v-for="group in filteredGroups"
      :key="group.key"
      class="component-group"
    >
      <div
        class="group-title"
        :class="{ collapsed: !expandedGroups[group.key] }"
        @click="emit('toggle-group', group.key)"
      >
        <component :is="iconTag" name="chevron-down" class="group-arrow" />
        {{ group.title }}
      </div>
      <div v-show="expandedGroups[group.key]" class="component-group-items">
        <component
          :is="buttonTag"
          v-for="type in group.items"
          :key="type.value"
          type="button"
          plain
          class="component-item"
          :size="globalSize"
          :icon="type.icon"
          :draggable="!isMobile"
          @dragstart="emit('drag-start', $event, type.value)"
          @touchstart.stop.prevent="emit('touch-start', $event, type.label, type.value)"
          @click="emit('add', type.value)"
        >
          {{ type.label }}
        </component>
      </div>
    </div>
    <div v-if="!filteredGroups.length" class="empty-tip">
      未找到匹配组件
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePrefix } from '../../utils/prefix'
import type { ComponentGroup } from './types'

defineOptions({ name: 'ComponentLibraryPanel' })

const props = defineProps<{
  groups: ComponentGroup[]
  expandedGroups: Record<string, boolean>
  globalSize: string
  isMobile: boolean
}>()

const emit = defineEmits<{
  (e: 'drag-start', event: DragEvent, type: string): void
  (e: 'touch-start', event: TouchEvent, label: string, type: string): void
  (e: 'toggle-group', key: string): void
  (e: 'add', type: string): void
}>()

const { withPrefix } = usePrefix()
const buttonTag = withPrefix('button')
const inputTag = withPrefix('input')
const iconTag = withPrefix('icon')

const searchText = ref('')

const filteredGroups = computed(() => {
  const keyword = searchText.value.trim()
  if (!keyword) return props.groups
  return props.groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.includes(keyword))
    }))
    .filter((group) => group.items.length > 0)
})
</script>

<style scoped>
.component-library { padding: 12px; font-family: var(--w-font-family); color: var(--w-text-color-primary); }
.library-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.panel-title { font-weight: bold; color: var(--w-text-color-primary); white-space: nowrap; }
.library-search { flex: 1; min-width: 0; margin-bottom: 0; display: flex; }
.library-search :deep(.w-input) { flex: 1; min-width: 0; width: 100%; }
.component-group { margin-bottom: 12px; }
.component-group-items { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
.group-title { color: var(--w-text-color-secondary); font-size: 12px; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; }
.group-arrow { transition: transform 0.2s; font-size: 12px; }
.group-title.collapsed .group-arrow { transform: rotate(-90deg); }
.component-item {
  height: auto !important;
  min-height: 64px;
  padding: 8px !important;
  line-height: 1.2;
  white-space: normal;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: grab;
  touch-action: none;
}
.component-item:active { cursor: grabbing; }
.component-item :deep(.w-icon) {
  font-size: 18px;
}
.empty-tip { color: var(--w-text-color-placeholder); text-align: center; padding: 12px; }
</style>
