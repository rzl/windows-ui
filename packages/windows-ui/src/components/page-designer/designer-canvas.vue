<template>
  <div
    ref="panelRef"
    class="canvas-panel"
    @wheel="emit('wheel', $event)"
  >
    <div class="panel-title">画布</div>
    <div
      ref="bodyRef"
      class="canvas-body"
      :class="{ 'is-empty': !components?.length, 'show-grid': showGrid }"
      :style="canvasBodyStyle"
      data-droppable="root"
      @dragenter.prevent="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover.prevent="handleDragOver"
      @drop="handleDrop"
      @click.self="emit('select', '')"
    >
      <component-node
        v-for="(node, index) in components"
        :key="node.id"
        :node="node"
        :index="index"
        :selected-id="selectedId"
        :parent-list="components || []"
        @select="emit('select', $event)"
        @delete="emit('delete', $event)"
        @move="emit('move', $event)"
        @reorder="emit('reorder', $event)"
        @move-to-root="emit('move-to-root', $event)"
        @change="emit('change')"
      />
      <div v-if="!components?.length" class="empty-tip">
        拖拽或点击组件到此处
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentNode from './component-node.vue'
import type { PageNode } from './types'

defineOptions({ name: 'DesignerCanvas' })

const props = defineProps<{
  components?: PageNode[]
  selectedId: string
  zoom: number
  showGrid: boolean
}>()

const emit = defineEmits<{
  (e: 'drop', event: DragEvent): void
  (e: 'wheel', event: WheelEvent): void
  (e: 'select', id: string): void
  (e: 'delete', payload: { id: string }): void
  (e: 'move', payload: { id: string; direction: 'up' | 'down' }): void
  (e: 'reorder', payload: { sourceId: string; targetId: string; position: 'before' | 'after' | 'inside' }): void
  (e: 'move-to-root', payload: { sourceId: string }): void
  (e: 'change'): void
}>()

const panelRef = ref<HTMLElement>()
const bodyRef = ref<HTMLElement>()
const dragOverCount = ref(0)

function setCanvasBodyHighlight(active: boolean) {
  if (!bodyRef.value) return
  bodyRef.value.classList.toggle('drop-target-active', active)
}

function handleDragEnter(event: DragEvent) {
  if (event.target !== bodyRef.value) return
  dragOverCount.value++
  setCanvasBodyHighlight(true)
}

function handleDragLeave(event: DragEvent) {
  if (event.target !== bodyRef.value) return
  dragOverCount.value--
  if (dragOverCount.value <= 0) {
    dragOverCount.value = 0
    setCanvasBodyHighlight(false)
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function hasNodeType(transfer: DataTransfer | null) {
  return transfer?.types?.includes('pageNodeId') ?? false
}

function handleDrop(event: DragEvent) {
  dragOverCount.value = 0
  setCanvasBodyHighlight(false)
  const nodeId = event.dataTransfer?.getData('pageNodeId')
  if (hasNodeType(event.dataTransfer) && nodeId) {
    emit('move-to-root', { sourceId: nodeId })
    return
  }
  emit('drop', event)
}

const canvasBodyStyle = computed(() => ({
  transform: `scale(${props.zoom})`,
  transformOrigin: 'top left'
}))
</script>

<style scoped>
.canvas-panel { flex: 1; background: var(--w-bg-color); padding: 12px; display: flex; flex-direction: column; overflow: auto; }
.panel-title { font-weight: bold; margin-bottom: 12px; color: var(--w-text-color-primary); }
.canvas-body { flex: 1; border: 1px dashed var(--w-border-color-light); padding: 12px; position: relative; transition: transform 0.15s ease; }
.canvas-body.is-empty { display: flex; align-items: center; justify-content: center; }
.canvas-body.drop-target-active { background: var(--w-table-current-row-bg); border-color: var(--w-color-primary); }
.canvas-body.show-grid {
  background-image:
    linear-gradient(to right, rgba(128, 128, 128, 0.15) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(128, 128, 128, 0.15) 1px, transparent 1px);
  background-size: 20px 20px;
}
.empty-tip { color: var(--w-text-color-placeholder); }
</style>
