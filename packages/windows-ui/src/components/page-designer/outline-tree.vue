<template>
  <div class="outline-tree">
    <div
      v-for="node in treeNodes"
      :key="node.id"
      class="outline-node"
      :class="{ selected: node.id === selectedId, container: node.isContainer }"
      :style="{ paddingLeft: `${node.level * 16 + 8}px` }"
      @click.stop="selectNode(node.id)"
    >
      <span
        v-if="node.isContainer"
        class="outline-toggle"
        @click.stop="toggleNode(node.id)"
      >
        {{ isExpanded(node.id) ? '▼' : '▶' }}
      </span>
      <span v-else class="outline-spacer" />
      <span class="outline-icon">{{ node.icon }}</span>
      <span class="outline-label" :title="node.label">{{ node.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PageNode } from './types'

defineOptions({ name: 'WPageOutlineTree' })

const props = defineProps<{
  components: PageNode[]
  selectedId: string
}>()

const emit = defineEmits(['select'])

const expandedIds = ref<Set<string>>(new Set())

const typeIconMap: Record<string, string> = {
  container: '📦',
  card: '🃏',
  row: '⊞',
  tabs: '🗂️',
  text: 'T',
  statistic: '🔢',
  chart: '📊',
  alert: '🔔',
  tag: '🏷️',
  progress: '▰',
  avatar: '👤',
  image: '🖼️',
  divider: '—',
  table: '▦',
  list: '☰',
  model: '🗃️',
  dashboard: '📈',
  report: '📄',
  button: '🔘',
  link: '🔗',
  input: '📝',
  select: '▼',
  radio: '◉',
  checkbox: '☑',
  'date-picker': '📅',
  switch: '⚪'
}

interface OutlineTreeNode {
  id: string
  label: string
  icon: string
  level: number
  isContainer: boolean
  children?: OutlineTreeNode[]
}

function isContainer(node: PageNode): boolean {
  return ['container', 'card', 'row', 'tabs'].includes(node.type)
}

function buildTree(nodes: PageNode[], level: number): OutlineTreeNode[] {
  const result: OutlineTreeNode[] = []
  for (const node of nodes) {
    const container = isContainer(node)
    const item: OutlineTreeNode = {
      id: node.id,
      label: getNodeLabel(node),
      icon: typeIconMap[node.type] || '📄',
      level,
      isContainer: container
    }
    result.push(item)
    if (container && node.children?.length && isExpanded(node.id)) {
      result.push(...buildTree(node.children, level + 1))
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
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

function selectNode(id: string) {
  emit('select', id)
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
.outline-node:hover { background: #f0f0f0; }
.outline-node.selected { background: #e6f2ff; color: var(--w-color-primary); }
.outline-toggle {
  width: 14px;
  text-align: center;
  font-size: 10px;
  color: #999;
}
.outline-spacer { width: 14px; }
.outline-icon { font-size: 12px; width: 16px; text-align: center; }
.outline-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
