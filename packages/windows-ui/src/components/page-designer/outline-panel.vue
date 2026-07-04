<template>
  <div class="outline-panel">
    <div class="panel-title">大纲</div>
    <outline-tree
      :components="components || []"
      :selected-id="selectedId"
      @select="emit('select', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import OutlineTree from './outline-tree.vue'
import type { PageNode } from './types'

defineOptions({ name: 'OutlinePanel' })

const props = defineProps<{
  components?: PageNode[]
  selectedId: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

void props
</script>

<style scoped>
.outline-panel { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.panel-title { font-weight: bold; margin-bottom: 12px; color: var(--w-text-color-primary); }
</style>
