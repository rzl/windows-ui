<template>
  <div ref="wrapRef" class="w-scrollbar" :class="{ 'w-scrollbar--native': native }" :style="wrapStyle">
    <div ref="viewRef" class="w-scrollbar__view" :style="viewStyle" @scroll="handleScroll">
      <slot />
    </div>
    <div v-if="!native && verticalVisible" class="w-scrollbar__bar w-scrollbar__bar--vertical" :style="{ width: `${barSize}px` }">
      <div
        class="w-scrollbar__thumb"
        :style="{ height: `${verticalThumbSize}px`, transform: `translateY(${verticalThumbPos}px)` }"
        @mousedown="startVerticalDrag"
      />
    </div>
    <div v-if="!native && horizontalVisible" class="w-scrollbar__bar w-scrollbar__bar--horizontal" :style="{ height: `${barSize}px` }">
      <div
        class="w-scrollbar__thumb"
        :style="{ width: `${horizontalThumbSize}px`, transform: `translateX(${horizontalThumbPos}px)` }"
        @mousedown="startHorizontalDrag"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'WScrollbar' })
const props = defineProps({
  height: { type: [String, Number], default: '' },
  maxHeight: { type: [String, Number], default: '' },
  native: { type: Boolean, default: false },
  always: { type: Boolean, default: false },
  barSize: { type: Number, default: 12 }
})

const wrapRef = ref<HTMLDivElement>()
const viewRef = ref<HTMLDivElement>()
const scrollTop = ref(0)
const scrollLeft = ref(0)
const clientHeight = ref(0)
const scrollHeight = ref(0)
const clientWidth = ref(0)
const scrollWidth = ref(0)

const wrapStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.height) style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  if (props.maxHeight) style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  return style
})

const viewStyle = computed(() => {
  if (props.native) return {}
  return { overflow: 'scroll', marginRight: `-${props.barSize + 4}px`, marginBottom: `-${props.barSize + 4}px` }
})

const verticalVisible = computed(() => {
  if (props.native) return false
  return scrollHeight.value > clientHeight.value && (props.always || scrollHeight.value > 0)
})

const horizontalVisible = computed(() => {
  if (props.native) return false
  return scrollWidth.value > clientWidth.value && (props.always || scrollWidth.value > 0)
})

const verticalThumbSize = computed(() => {
  if (scrollHeight.value <= 0) return 0
  const ratio = clientHeight.value / scrollHeight.value
  return Math.max(30, clientHeight.value * ratio)
})

const verticalThumbPos = computed(() => {
  if (scrollHeight.value <= clientHeight.value) return 0
  const track = clientHeight.value - verticalThumbSize.value
  const ratio = scrollTop.value / (scrollHeight.value - clientHeight.value)
  return ratio * track
})

const horizontalThumbSize = computed(() => {
  if (scrollWidth.value <= 0) return 0
  const ratio = clientWidth.value / scrollWidth.value
  return Math.max(30, clientWidth.value * ratio)
})

const horizontalThumbPos = computed(() => {
  if (scrollWidth.value <= clientWidth.value) return 0
  const track = clientWidth.value - horizontalThumbSize.value
  const ratio = scrollLeft.value / (scrollWidth.value - clientWidth.value)
  return ratio * track
})

const updateSize = () => {
  const el = viewRef.value
  if (!el) return
  clientHeight.value = el.clientHeight
  scrollHeight.value = el.scrollHeight
  clientWidth.value = el.clientWidth
  scrollWidth.value = el.scrollWidth
}

const handleScroll = () => {
  const el = viewRef.value
  if (!el) return
  scrollTop.value = el.scrollTop
  scrollLeft.value = el.scrollLeft
}

let startY = 0
const startVerticalDrag = (e: MouseEvent) => {
  e.preventDefault()
  startY = e.clientY
  document.addEventListener('mousemove', onVerticalDrag)
  document.addEventListener('mouseup', stopVerticalDrag)
}

const onVerticalDrag = (e: MouseEvent) => {
  const el = viewRef.value
  if (!el) return
  const delta = e.clientY - startY
  const track = clientHeight.value - verticalThumbSize.value
  const ratio = delta / track
  el.scrollTop = ratio * (scrollHeight.value - clientHeight.value)
}

const stopVerticalDrag = () => {
  document.removeEventListener('mousemove', onVerticalDrag)
  document.removeEventListener('mouseup', stopVerticalDrag)
}

let startX = 0
const startHorizontalDrag = (e: MouseEvent) => {
  e.preventDefault()
  startX = e.clientX
  document.addEventListener('mousemove', onHorizontalDrag)
  document.addEventListener('mouseup', stopHorizontalDrag)
}

const onHorizontalDrag = (e: MouseEvent) => {
  const el = viewRef.value
  if (!el) return
  const delta = e.clientX - startX
  const track = clientWidth.value - horizontalThumbSize.value
  const ratio = delta / track
  el.scrollLeft = ratio * (scrollWidth.value - clientWidth.value)
}

const stopHorizontalDrag = () => {
  document.removeEventListener('mousemove', onHorizontalDrag)
  document.removeEventListener('mouseup', stopHorizontalDrag)
}

let ro: ResizeObserver | null = null
onMounted(() => {
  updateSize()
  if (typeof ResizeObserver !== 'undefined' && viewRef.value) {
    ro = new ResizeObserver(updateSize)
    ro.observe(viewRef.value)
  }
})

onBeforeUnmount(() => {
  if (ro && viewRef.value) ro.unobserve(viewRef.value)
})
</script>

<style scoped>
.w-scrollbar { position: relative; overflow: hidden; background: #fff; border: 1px solid #7f9db9; }
.w-scrollbar--native { overflow: auto; }
.w-scrollbar__view { box-sizing: border-box; max-height: 100%; max-width: 100%; }
.w-scrollbar--native .w-scrollbar__view { overflow: auto; margin: 0; }
.w-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
.w-scrollbar__bar { position: absolute; background: #f0f0f0; border: 1px solid #d4d0c8; box-sizing: border-box; }
.w-scrollbar__bar--vertical { top: 0; right: 0; bottom: 0; }
.w-scrollbar__bar--horizontal { left: 0; right: 0; bottom: 0; }
.w-scrollbar__thumb { background: linear-gradient(180deg, #e8e8e8 0%, #d4d0c8 50%, #c0c0c0 100%); border: 1px solid #808080; border-radius: 4px; cursor: pointer; box-sizing: border-box; }
.w-scrollbar__bar--horizontal .w-scrollbar__thumb { background: linear-gradient(90deg, #e8e8e8 0%, #d4d0c8 50%, #c0c0c0 100%); }
.w-scrollbar__thumb:hover { background: linear-gradient(180deg, #d4d0c8 0%, #c0c0c0 50%, #a0a0a0 100%); }
</style>
