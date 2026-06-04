<template>
  <div :class="['w-alert', `w-alert--${type}`, { 'is-center': center }]">
    <w-icon :name="iconName" />
    <div class="w-alert__content">
      <div v-if="title" class="w-alert__title">{{ title }}</div>
      <div class="w-alert__description"><slot>{{ description }}</slot></div>
    </div>
    <w-icon v-if="closable" name="close" size="small" class="w-alert__close" @click="handleClose" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WAlert' })
const props = defineProps({
  title: String,
  description: String,
  type: { type: String, default: 'info' },
  closable: Boolean,
  center: Boolean
})
const emit = defineEmits(['close'])

const iconName = computed(() => {
  const map: Record<string, string> = { info: 'info', success: 'success', warning: 'warning', error: 'error' }
  return map[props.type] || 'info'
})

const handleClose = () => emit('close')
</script>

<style scoped>
.w-alert { display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; border: 1px solid; font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
.w-alert--info { background: #e8f4fd; border-color: var(--w-color-primary); color: var(--w-color-primary); }
.w-alert--success { background: #e8f8e8; border-color: var(--w-color-success); color: var(--w-color-success); }
.w-alert--warning { background: #fff8e0; border-color: var(--w-color-warning); color: var(--w-color-warning); }
.w-alert--error { background: #ffe8e8; border-color: var(--w-color-danger); color: var(--w-color-danger); }
.w-alert__content { flex: 1; }
.w-alert__title { font-weight: bold; margin-bottom: 2px; }
.w-alert__close { cursor: pointer; }
.w-alert.is-center { justify-content: center; text-align: center; }
</style>
