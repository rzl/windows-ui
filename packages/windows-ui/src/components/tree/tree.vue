<template>
  <div :class="['w-tree', `w-tree--${size}`]">
    <w-tree-node
      v-for="node in data"
      :key="node.value"
      :node="node"
      :level="0"
      :expand-all="expandAll"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import WTreeNode from './tree-node.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WTree' })
const props = defineProps({
  data: { type: Array as () => any[], default: () => [] },
  expandAll: Boolean,
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
provide('treeSize', size)
const emit = defineEmits(['node-click'])
const handleNodeClick = (node: any) => emit('node-click', node)
</script>

<style scoped>
.w-tree { font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
.w-tree--small { font-size: var(--w-font-size-small); }
.w-tree--small :deep(.w-tree-node__content) { padding: 2px 4px; }
.w-tree--large { font-size: var(--w-font-size-medium); }
.w-tree--large :deep(.w-tree-node__content) { padding: 4px 6px; }
</style>
