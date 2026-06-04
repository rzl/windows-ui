<template>
  <div class="w-badge">
    <slot />
    <sup v-if="show" :class="['w-badge__content', `w-badge--${type}`, { 'is-dot': isDot }]">{{ displayValue }}</sup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'WBadge' })
const props = defineProps({
  value: [String, Number],
  max: { type: Number, default: 99 },
  isDot: Boolean,
  type: { type: String, default: 'danger' }
})

const show = computed(() => props.isDot || props.value !== undefined && props.value !== '')
const displayValue = computed(() => {
  if (props.isDot) return ''
  const num = Number(props.value)
  if (!isNaN(num) && num > props.max) return `${props.max}+`
  return props.value
})
</script>

<style scoped>
.w-badge { position: relative; display: inline-flex; vertical-align: middle; }
.w-badge__content { position: absolute; top: 0; right: 0; transform: translate(50%, -50%); background: var(--w-color-danger); color: #fff; font-size: var(--w-font-size-extra-small); padding: 0 5px; height: 16px; line-height: 16px; border-radius: 8px; border: 1px solid var(--w-bg-color); white-space: nowrap; z-index: var(--w-index-normal); }
.w-badge__content.is-dot { width: 8px; height: 8px; padding: 0; border-radius: 50%; }
.w-badge--primary { background: var(--w-color-primary); }
.w-badge--success { background: var(--w-color-success); }
.w-badge--warning { background: var(--w-color-warning); }
.w-badge--info { background: var(--w-color-info); }
</style>
