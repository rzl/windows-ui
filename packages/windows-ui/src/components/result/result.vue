<template>
  <div class="w-result">
    <w-icon :name="iconName" size="large" />
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

defineOptions({ name: 'WResult' })
const props = defineProps({
  icon: { type: String, default: 'info' },
  title: String,
  subtitle: String
})

const iconName = computed(() => props.icon)
</script>

<style scoped>
.w-result { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; text-align: center; }
.w-result__title { margin-top: 12px; font-size: var(--w-font-size-large); font-weight: bold; color: var(--w-text-color-primary); }
.w-result__subtitle { margin-top: 8px; font-size: var(--w-font-size-base); color: var(--w-text-color-secondary); }
.w-result__extra { margin-top: 16px; }
</style>
