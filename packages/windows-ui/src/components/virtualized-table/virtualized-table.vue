<template>
  <div class="w-virtualized-table">
    <div class="w-virtualized-table__header"><div v-for="col in columns" :key="col.prop" class="w-virtualized-table__th" :style="colWidthStyle(col.width)">{{ col.label }}</div></div>
    <div class="w-virtualized-table__viewport" :style="viewportStyle" @scroll="handleScroll">
      <div class="w-virtualized-table__body" :style="{ height: `${data.length * rowHeight}px` }">
        <div v-for="(row, ri) in visibleData" :key="startIndex + ri" class="w-virtualized-table__row" :style="{ height: `${rowHeight}px`, top: `${(startIndex + ri) * rowHeight}px` }">
          <div v-for="col in columns" :key="col.prop" class="w-virtualized-table__td" :style="colWidthStyle(col.width)"><slot :name="col.prop" :row="row" :$index="startIndex + ri">{{ row[col.prop] }}</slot></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
defineOptions({ name: 'WVirtualizedTable' })
const props = defineProps({
  data: { type: Array as () => any[], default: () => [] },
  columns: { type: Array as () => { prop: string; label: string; width?: number | string }[], default: () => [] },
  rowHeight: { type: Number, default: 32 },
  visibleCount: { type: Number, default: 10 },
  height: { type: [String, Number], default: undefined }
})
const scrollTop = ref(0)
const startIndex = computed(() => Math.floor(scrollTop.value / props.rowHeight))
const visibleData = computed(() => props.data.slice(startIndex.value, startIndex.value + props.visibleCount + 1))
const handleScroll = (e: Event) => { scrollTop.value = (e.target as HTMLDivElement).scrollTop }
const viewportStyle = computed(() => {
  const h = props.height !== undefined ? (typeof props.height === 'number' ? `${props.height}px` : props.height) : `${props.rowHeight * props.visibleCount}px`
  return { height: h }
})
const colWidthStyle = (width?: number | string) => {
  if (width === undefined) return {}
  return { width: typeof width === 'number' ? `${width}px` : width, flex: 'none' }
}
</script>

<style scoped>
.w-virtualized-table { border: 1px solid #919b9c; }
.w-virtualized-table__header { display: flex; background: linear-gradient(180deg, #f8f8f8, #e0e0e0); border-bottom: 1px solid #d4d0c8; }
.w-virtualized-table__th { flex: 1; padding: 6px 10px; font-weight: bold; font-size: var(--w-font-size-base); }
.w-virtualized-table__viewport { overflow-y: auto; position: relative; }
.w-virtualized-table__body { position: relative; }
.w-virtualized-table__row { display: flex; position: absolute; left: 0; right: 0; border-bottom: 1px solid #e8e8e8; }
.w-virtualized-table__td { flex: 1; padding: 6px 10px; font-size: var(--w-font-size-base); display: flex; align-items: center; }
</style>
