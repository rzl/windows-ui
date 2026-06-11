<template>
  <div class="w-virtualized-tree">
    <div class="w-virtualized-tree__viewport" :style="{ height: `${rowHeight * visibleCount}px` }" @scroll="handleScroll">
      <div class="w-virtualized-tree__body" :style="{ height: `${flatData.length * rowHeight}px` }">
        <div
          v-for="item in visibleData"
          :key="item.key"
          class="w-virtualized-tree__row"
          :style="{ height: `${rowHeight}px`, top: `${item.index * rowHeight}px`, paddingLeft: `${item.level * 16}px` }"
          @click="handleClick(item.node)"
        >
          <w-icon v-if="item.node.children?.length" :name="item.expanded ? 'arrowDown' : 'arrowRight'" :size="size" />
          <w-icon v-else name="file" :size="size" />
          <span>{{ item.node.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WVirtualizedTree' })
const props = defineProps({
  data: { type: Array as () => any[], default: () => [] },
  rowHeight: { type: Number, default: 28 },
  visibleCount: { type: Number, default: 10 },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['node-click'])

const scrollTop = ref(0)
const expandedSet = ref(new Set<string>())

const flatten = (nodes: any[], level = 0): any[] => {
  const result: any[] = []
  for (const node of nodes) {
    const key = node.value || node.label
    result.push({ node, level, key: `${key}-${level}`, expanded: expandedSet.value.has(key) })
    if (node.children?.length && expandedSet.value.has(key)) {
      result.push(...flatten(node.children, level + 1))
    }
  }
  return result
}

const flatData = computed(() => flatten(props.data))
const startIndex = computed(() => Math.floor(scrollTop.value / props.rowHeight))
const visibleData = computed(() => flatData.value.slice(startIndex.value, startIndex.value + props.visibleCount + 1).map((item, i) => ({ ...item, index: startIndex.value + i })))

const handleScroll = (e: Event) => { scrollTop.value = (e.target as HTMLDivElement).scrollTop }
const handleClick = (node: any) => {
  const key = node.value || node.label
  if (expandedSet.value.has(key)) expandedSet.value.delete(key)
  else expandedSet.value.add(key)
  emit('node-click', node)
}
</script>

<style scoped>
.w-virtualized-tree { border: 1px solid #919b9c; }
.w-virtualized-tree__viewport { overflow-y: auto; }
.w-virtualized-tree__body { position: relative; }
.w-virtualized-tree__row { display: flex; align-items: center; gap: 4px; position: absolute; left: 0; right: 0; cursor: pointer; padding: 0 4px; }
.w-virtualized-tree__row:hover { background: var(--w-xp-blue-light); color: #fff; }
</style>
