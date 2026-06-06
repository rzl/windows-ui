<template>
  <div :class="['w-card', { 'w-card--hover': props.hover }]" :style="cardStyle">
    <div v-if="$slots.header || props.header" class="w-card__header">
      <slot name="header">{{ props.header }}</slot>
    </div>
    <div class="w-card__body" :style="bodyStyle">
      <slot />
    </div>
    <div v-if="$slots.footer" class="w-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'WCard' })
const props = defineProps({
  header: String,
  hover: Boolean,
  shadow: { type: String, default: 'always' }
})

const cardStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.shadow === 'always') style.boxShadow = '2px 2px 5px rgba(0,0,0,0.3)'
  else if (props.shadow === 'never') style.boxShadow = 'none'
  return style
})

const bodyStyle = computed(() => ({ padding: '12px' }))
</script>

<style scoped>
.w-card { background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; font-family: var(--w-font-family); }
.w-card__header { padding: 8px 12px; background: var(--w-xp-title-bar); color: #fff; font-weight: bold; font-size: var(--w-font-size-medium); }
.w-card__body { font-size: var(--w-font-size-base); color: var(--w-text-color-primary); }
.w-card__footer { padding: 8px 12px; border-top: 1px solid #d4d0c8; }
.w-card--hover:hover { box-shadow: 4px 4px 10px rgba(0,0,0,0.5); }
</style>
