<template>
  <div class="component-library" :class="`component-library--${globalSize}`">
    <div class="panel-title">组件库</div>
    <div
      v-for="group in groups"
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
        <div
          v-for="type in group.items"
          :key="type.value"
          class="component-item"
          :draggable="!isMobile"
          @dragstart="emit('drag-start', $event, type.value)"
          @touchstart.stop.prevent="emit('touch-start', $event, type.label, type.value)"
        >
          {{ type.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
}>()

const { withPrefix } = usePrefix()
const iconTag = withPrefix('icon')

void props
</script>

<style scoped>
.component-library { padding: 12px; }
.component-group { margin-bottom: 12px; }
.component-group-items { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
.group-title { color: var(--w-text-color-secondary); font-size: 12px; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; }
.group-arrow { transition: transform 0.2s; font-size: 12px; }
.group-title.collapsed .group-arrow { transform: rotate(-90deg); }
.component-item { padding: 8px; border: 1px solid var(--w-border-color); border-radius: 4px; cursor: grab; background: var(--w-fill-color-lighter); color: var(--w-text-color-regular); font-size: var(--w-font-size-base); }
.component-library--small .component-item { padding: 4px; font-size: var(--w-font-size-small); }
.component-library--large .component-item { padding: 12px; font-size: var(--w-font-size-medium); }
.component-item:hover { background: var(--w-fill-color-light); }
</style>
