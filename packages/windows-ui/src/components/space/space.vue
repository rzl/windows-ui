<template>
  <div :class="['w-space', `w-space--${direction}`]" :style="spaceStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'WSpace' })
const props = defineProps({ direction: { type: String, default: 'horizontal' }, size: { type: [String, Number], default: 8 }, wrap: Boolean })
const spaceStyle = computed(() => ({ gap: typeof props.size === 'number' ? `${props.size}px` : props.size, flexWrap: props.wrap ? 'wrap' as const : undefined }))
</script>

<style scoped>
.w-space { display: inline-flex; }
.w-space--vertical { flex-direction: column; }
.w-space--horizontal { flex-direction: row; }
</style>
