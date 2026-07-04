<template>
  <div class="property-panel">
    <div class="panel-title">属性</div>
    <property-editor
      v-if="selectedNode"
      :node="selectedNode"
      @update="emit('update', $event)"
    />
    <div v-else class="empty-tip">选中画布中的组件以编辑属性</div>
  </div>
</template>

<script setup lang="ts">
import PropertyEditor from './property-editor.vue'
import type { PageNode } from './types'

defineOptions({ name: 'PropertyPanel' })

const props = defineProps<{
  selectedNode: PageNode | null
}>()

const emit = defineEmits<{
  (e: 'update', node: PageNode): void
}>()

void props
</script>

<style scoped>
.property-panel { width: 280px; background: var(--w-bg-color); border-left: 1px solid var(--w-border-color); padding: 12px; display: flex; flex-direction: column; }
.panel-title { font-weight: bold; margin-bottom: 12px; color: var(--w-text-color-primary); }
.empty-tip { color: var(--w-text-color-placeholder); }
</style>
