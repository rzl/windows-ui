<template>
  <div :class="['w-card', `w-card--${size}`, { 'w-card--hover': props.hover }]" :style="cardStyle">
    <div v-if="$slots.header || props.header" class="w-card__header">
      <div class="w-card__header-content">
        <slot name="header">{{ props.header }}</slot>
      </div>
      <div v-if="$slots.action" class="w-card__actions">
        <slot name="action" />
      </div>
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
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WCard' })
const props = defineProps({
  header: String,
  hover: Boolean,
  shadow: { type: String, default: 'always' },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)

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
.w-card__header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--w-xp-title-bar); color: #fff; font-weight: bold; font-size: var(--w-font-size-medium); }
.w-card__header-content { flex: 1; }
.w-card__actions { display: flex; align-items: center; gap: 8px; }
.w-card__body { font-size: var(--w-font-size-base); color: var(--w-text-color-primary); }
.w-card__footer { padding: 8px 12px; border-top: 1px solid #d4d0c8; }
.w-card--hover:hover { box-shadow: 4px 4px 10px rgba(0,0,0,0.5); }
.w-card--small .w-card__header { padding: 6px 10px; font-size: var(--w-font-size-small); }
.w-card--small .w-card__body { padding: 8px; font-size: var(--w-font-size-small); }
.w-card--large .w-card__header { padding: 10px 14px; font-size: var(--w-font-size-large); }
.w-card--large .w-card__body { padding: 16px; font-size: var(--w-font-size-medium); }
</style>
