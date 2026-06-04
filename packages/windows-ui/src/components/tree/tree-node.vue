<template>
  <div class="w-tree-node">
    <div
      :class="['w-tree-node__content', { 'is-leaf': !hasChildren }]"
      :style="{ paddingLeft: `${level * 16}px` }"
      @click="toggle"
    >
      <w-icon v-if="hasChildren" :name="expanded ? 'arrowDown' : 'arrowRight'" size="small" />
      <w-icon v-else name="file" size="small" />
      <span>{{ node.label }}</span>
    </div>
    <div v-if="hasChildren && expanded" class="w-tree-node__children">
      <w-tree-node
        v-for="child in node.children"
        :key="child.value"
        :node="child"
        :level="level + 1"
        :expand-all="expandAll"
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WTreeNode' })
const props = defineProps({
  node: Object as () => any,
  level: { type: Number, default: 0 },
  expandAll: Boolean
})
const emit = defineEmits(['node-click'])

const expanded = ref(props.expandAll || false)
const hasChildren = computed(() => props.node?.children?.length > 0)

const toggle = () => {
  if (hasChildren.value) expanded.value = !expanded.value
  emit('node-click', props.node)
}
const handleNodeClick = (node: any) => emit('node-click', node)
</script>

<style scoped>
.w-tree-node__content { display: flex; align-items: center; gap: 4px; padding: 3px 4px; cursor: pointer; }
.w-tree-node__content:hover { background: var(--w-xp-blue-light); color: #fff; }
.w-tree-node__content.is-leaf { padding-left: 20px; }
</style>
