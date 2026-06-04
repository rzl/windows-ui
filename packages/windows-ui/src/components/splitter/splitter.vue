<template>
  <div class="w-splitter">
    <div class="w-splitter__panel" :style="leftStyle"><slot name="left" /></div>
    <div class="w-splitter__bar" @mousedown="startDrag" />
    <div class="w-splitter__panel" :style="rightStyle"><slot name="right" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
defineOptions({ name: 'WSplitter' })
const props = defineProps({ split: { type: Number, default: 50 } })
const splitPercent = ref(props.split)
const isDragging = ref(false)
const leftStyle = computed(() => ({ width: `${splitPercent.value}%` }))
const rightStyle = computed(() => ({ width: `${100 - splitPercent.value}%` }))
const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  const startX = e.clientX
  const startSplit = splitPercent.value
  const container = (e.target as HTMLElement).parentElement!
  const onMove = (ev: MouseEvent) => { if (!isDragging.value) return; const delta = ev.clientX - startX; const cw = container.offsetWidth; splitPercent.value = Math.max(10, Math.min(90, startSplit + (delta / cw) * 100)) }
  const onUp = () => { isDragging.value = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}
</script>

<style scoped>
.w-splitter { display: flex; height: 100%; border: 2px solid; border-color: #fff #808080 #808080 #fff; background: var(--w-bg-color); }
.w-splitter__panel { overflow: auto; padding: 4px; }
.w-splitter__bar { width: 6px; background: linear-gradient(90deg, #e0e0e0, #c0c0c0, #e0e0e0); cursor: col-resize; border-left: 1px solid #fff; border-right: 1px solid #808080; }
</style>
