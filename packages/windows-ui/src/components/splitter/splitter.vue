<template>
  <div class="w-splitter" :class="{ 'is-vertical': props.direction === 'vertical' }">
    <div class="w-splitter__panel" :style="firstStyle"><slot name="first" /></div>
    <div class="w-splitter__bar" @mousedown="startDrag" @touchstart.prevent="startTouchDrag" />
    <div class="w-splitter__panel" :style="secondStyle"><slot name="second" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({ name: 'WSplitter' })

const props = defineProps({
  split: { type: Number, default: 50 },
  direction: { type: String, default: 'horizontal' }
})

const splitPercent = ref(props.split)
const isDragging = ref(false)

const isHorizontal = computed(() => props.direction === 'horizontal')

const firstStyle = computed(() => ({
  flex: `${splitPercent.value} 1 0%`
}))

const secondStyle = computed(() => ({
  flex: `${100 - splitPercent.value} 1 0%`
}))

const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  const startPos = isHorizontal.value ? e.clientX : e.clientY
  const startSplit = splitPercent.value
  const container = (e.target as HTMLElement).parentElement!
  const onMove = (ev: MouseEvent) => {
    if (!isDragging.value) return
    const currentPos = isHorizontal.value ? ev.clientX : ev.clientY
    const delta = currentPos - startPos
    const total = (isHorizontal.value ? container.offsetWidth : container.offsetHeight) - 6
    splitPercent.value = Math.max(10, Math.min(90, startSplit + (delta / total) * 100))
  }
  const onUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

const startTouchDrag = (e: TouchEvent) => {
  isDragging.value = true
  const touch = e.touches[0]
  const startPos = isHorizontal.value ? touch.clientX : touch.clientY
  const startSplit = splitPercent.value
  const container = (e.target as HTMLElement).parentElement!
  const onMove = (ev: TouchEvent) => {
    if (!isDragging.value) return
    ev.preventDefault()
    const t = ev.touches[0]
    const currentPos = isHorizontal.value ? t.clientX : t.clientY
    const delta = currentPos - startPos
    const total = (isHorizontal.value ? container.offsetWidth : container.offsetHeight) - 6
    splitPercent.value = Math.max(10, Math.min(90, startSplit + (delta / total) * 100))
  }
  const onEnd = () => {
    isDragging.value = false
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('touchend', onEnd)
    window.removeEventListener('touchcancel', onEnd)
  }
  window.addEventListener('touchmove', onMove, { passive: false })
  window.addEventListener('touchend', onEnd)
  window.addEventListener('touchcancel', onEnd)
}
</script>

<style scoped>
.w-splitter {
  display: flex;
  height: 100%;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  background: var(--w-bg-color);
}

.w-splitter.is-vertical {
  flex-direction: column;
}

.w-splitter__panel {
  overflow: auto;
  padding: 4px;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
}

.w-splitter__bar {
  flex: 0 0 6px;
  background: linear-gradient(90deg, #e0e0e0, #c0c0c0, #e0e0e0);
  cursor: col-resize;
  border-left: 1px solid #fff;
  border-right: 1px solid #808080;
  touch-action: none;
}

.w-splitter.is-vertical > .w-splitter__bar {
  background: linear-gradient(180deg, #e0e0e0, #c0c0c0, #e0e0e0);
  cursor: row-resize;
  border-left: none;
  border-right: none;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #808080;
}
</style>
