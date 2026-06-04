<template>
  <div class="w-tree">
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
import WTreeNode from './tree-node.vue'

defineOptions({ name: 'WTree' })
defineProps({
  data: { type: Array as () => any[], default: () => [] },
  expandAll: Boolean
})
const emit = defineEmits(['node-click'])
const handleNodeClick = (node: any) => emit('node-click', node)
</script>

<style scoped>
.w-tree { font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
</style>
