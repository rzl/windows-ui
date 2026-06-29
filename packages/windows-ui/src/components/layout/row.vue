<template>
  <div :class="['w-row', { 'w-row--flex': type === 'flex', 'w-row--wrap': wrap !== false }]" :style="rowStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

defineOptions({ name: 'WRow' })
const props = defineProps({
  gutter: { type: Number, default: 0 },
  type: String,
  justify: String,
  align: String,
  wrap: { type: Boolean, default: true }
})

provide('rowGutter', computed(() => props.gutter))

const rowStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.gutter) {
    const margin = `-${props.gutter / 2}px`
    style.marginLeft = margin
    style.marginRight = margin
  }
  if (props.justify) style.justifyContent = props.justify
  if (props.align) style.alignItems = props.align
  return style
})
</script>

<style scoped>
.w-row { display: block; }
.w-row--flex { display: flex; }
.w-row--wrap { flex-wrap: wrap; }
</style>
