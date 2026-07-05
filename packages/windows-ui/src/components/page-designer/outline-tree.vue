<template>
  <div class="outline-tree">
    <div
      v-for="node in treeNodes"
      :key="node.id"
      class="outline-node"
      :class="{
        selected: node.id === selectedId,
        container: node.isContainer,
        'drop-before': dropIndicator?.id === node.id && dropIndicator?.position === 'before',
        'drop-after': dropIndicator?.id === node.id && dropIndicator?.position === 'after',
        'drop-inside': dropIndicator?.id === node.id && dropIndicator?.position === 'inside'
      }"
      :style="{ paddingLeft: `${node.level * 16 + 8}px` }"
      @click.stop="selectNode(node.id)"
      @dragover.stop.prevent="handleDragOver($event, node)"
      @dragleave.stop="handleDragLeave"
      @drop.stop.prevent="handleDrop($event, node)"
    >
      <component
        :is="iconTag"
        name="sort"
        class="outline-drag-handle"
        title="拖动排序"
        draggable="true"
        @dragstart.stop="handleDragStart($event, node.id)"
        @click.stop
      />
      <span
        v-if="node.isContainer"
        class="outline-toggle"
        @click.stop="toggleNode(node.id)"
      >
        <component :is="iconTag" :name="isExpanded(node.id) ? 'chevron-down' : 'chevron-right'" />
      </span>
      <span v-else class="outline-spacer" />
      <component :is="iconTag" :name="node.icon" class="outline-icon" />
      <span class="outline-label" :title="node.label">{{ node.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePrefix } from '../../utils/prefix'
import type { PageNode } from './types'

defineOptions({ name: 'WPageOutlineTree' })

const { withPrefix } = usePrefix()
const iconTag = withPrefix('icon')

const props = defineProps<{
  components: PageNode[]
  selectedId: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'reorder', payload: { sourceId: string; targetId: string; position: 'before' | 'after' | 'inside' }): void
}>()

const expandedIds = ref<Set<string>>(new Set())
const dropIndicator = ref<{ id: string; position: 'before' | 'after' | 'inside' } | null>(null)

const typeIconMap: Record<string, string> = {
  container: 'box',
  card: 'card',
  row: 'layout',
  tabs: 'tabs',
  text: 'font',
  statistic: 'stats',
  chart: 'chart',
  alert: 'alert',
  tag: 'tag',
  progress: 'progress',
  avatar: 'avatar',
  image: 'image',
  divider: 'divider',
  table: 'table',
  list: 'list',
  model: 'model',
  dashboard: 'dashboard',
  report: 'report',
  button: 'button',
  link: 'link',
  input: 'input',
  select: 'select',
  radio: 'radio',
  checkbox: 'checkbox',
  'date-picker': 'calendar',
  switch: 'switch'
}

interface OutlineTreeNode {
  id: string
  label: string
  icon: string
  level: number
  isContainer: boolean
  ancestorIds: string[]
  children?: OutlineTreeNode[]
}

function isContainer(node: PageNode): boolean {
  return ['container', 'card', 'row', 'tabs'].includes(node.type)
}

function buildTree(nodes: PageNode[], level: number, ancestorIds: string[] = []): OutlineTreeNode[] {
  const result: OutlineTreeNode[] = []
  for (const node of nodes) {
    const container = isContainer(node)
    const item: OutlineTreeNode = {
      id: node.id,
      label: getNodeLabel(node),
      icon: typeIconMap[node.type] || '📄',
      level,
      isContainer: container,
      ancestorIds: [...ancestorIds]
    }
    result.push(item)
    if (container && node.children?.length && isExpanded(node.id)) {
      result.push(...buildTree(node.children, level + 1, [...ancestorIds, node.id]))
    }
  }
  return result
}

function getNodeLabel(node: PageNode): string {
  if (node.props?.title) return `${node.type} · ${node.props.title}`
  if (node.props?.label) return `${node.type} · ${node.props.label}`
  if (node.props?.content) return `${node.type} · ${String(node.props.content).slice(0, 12)}`
  return node.type
}

const treeNodes = computed(() => buildTree(props.components || [], 0))

function isExpanded(id: string): boolean {
  return expandedIds.value.has(id)
}

function toggleNode(id: string) {
  const next = new Set(expandedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  expandedIds.value = next
}

function selectNode(id: string) {
  emit('select', id)
}

function findAncestorIds(nodes: PageNode[], id: string, ancestors: string[] = []): string[] | null {
  for (const node of nodes) {
    if (node.id === id) return ancestors
    if (node.children?.length) {
      const found = findAncestorIds(node.children, id, [...ancestors, node.id])
      if (found) return found
    }
  }
  return null
}

watch(
  () => props.selectedId,
  (id) => {
    if (!id) return
    const ancestorIds = findAncestorIds(props.components || [], id)
    if (!ancestorIds?.length) return
    expandedIds.value = new Set([...expandedIds.value, ...ancestorIds])
  },
  { immediate: true }
)

function hasNodeType(transfer: DataTransfer | null) {
  return transfer?.types.includes('pageNodeId') ?? false
}

function handleDragStart(event: DragEvent, id: string) {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('pageNodeId', id)
  event.dataTransfer.effectAllowed = 'move'
}

function computeDropPosition(event: DragEvent, node: OutlineTreeNode): 'before' | 'after' | 'inside' {
  const rect = (event.currentTarget as HTMLElement)?.getBoundingClientRect()
  if (!rect) return 'after'
  const third = rect.height / 3
  const y = event.clientY - rect.top
  if (y < third) return 'before'
  if (y > third * 2 && node.isContainer) return 'inside'
  return 'after'
}

function handleDragOver(event: DragEvent, node: OutlineTreeNode) {
  if (!hasNodeType(event.dataTransfer)) return
  event.preventDefault()
  dropIndicator.value = { id: node.id, position: computeDropPosition(event, node) }
}

function handleDragLeave() {
  dropIndicator.value = null
}

function handleDrop(event: DragEvent, node: OutlineTreeNode) {
  event.preventDefault()
  const sourceId = event.dataTransfer?.getData('pageNodeId')
  dropIndicator.value = null
  if (!sourceId || sourceId === node.id) return
  const position = computeDropPosition(event, node)
  emit('reorder', { sourceId, targetId: node.id, position })
}
</script>

<style scoped>
.outline-tree { font-size: 13px; }
.outline-node {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 3px;
  user-select: none;
}
.outline-node:hover { background: var(--w-fill-color-light); }
.outline-node.selected { background: var(--w-table-current-row-bg); color: var(--w-color-primary); }
.outline-toggle {
  width: 14px;
  text-align: center;
  font-size: 10px;
  color: var(--w-text-color-placeholder);
}
.outline-spacer { width: 14px; }
.outline-icon { font-size: 12px; width: 16px; text-align: center; }
.outline-drag-handle {
  width: 14px;
  font-size: 10px;
  color: var(--w-text-color-placeholder);
  cursor: grab;
  text-align: center;
}
.outline-drag-handle:active { cursor: grabbing; }
.outline-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-node.drop-before { border-top: 2px solid var(--w-color-primary); }
.outline-node.drop-after { border-bottom: 2px solid var(--w-color-primary); }
.outline-node.drop-inside { background: var(--w-table-current-row-bg); }
</style>
