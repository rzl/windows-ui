<template>
  <div :class="['w-result', `w-result--${size}`]">
    <w-icon :name="iconName" :size="size" />
    <div class="w-result__title">{{ title }}</div>
    <div v-if="subtitle" class="w-result__subtitle">{{ subtitle }}</div>
    <div v-if="$slots.extra" class="w-result__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

const STATUS_ICON: Record<string, string> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  '403': 'warning',
  '404': 'info',
  '500': 'error'
}

defineOptions({ name: 'WResult' })
const props = defineProps({
  icon: { type: String, default: 'info' },
  status: { type: String, default: undefined },
  title: String,
  subtitle: String,
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const iconName = computed(() => props.status ? (STATUS_ICON[props.status] || props.status) : props.icon)
</script>

<style scoped>
.w-result { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; text-align: center; }
.w-result__title { margin-top: 12px; font-size: var(--w-font-size-large); font-weight: bold; color: var(--w-text-color-primary); }
.w-result__subtitle { margin-top: 8px; font-size: var(--w-font-size-base); color: var(--w-text-color-secondary); }
.w-result__extra { margin-top: 16px; }
.w-result--small { padding: 20px; }
.w-result--small .w-result__title { font-size: var(--w-font-size-base); }
.w-result--small .w-result__subtitle { font-size: var(--w-font-size-small); }
.w-result--large { padding: 48px; }
.w-result--large .w-result__title { font-size: var(--w-font-size-extra-large); }
.w-result--large .w-result__subtitle { font-size: var(--w-font-size-large); }
</style>
