<template>
  <div class="w-statistic">
    <div class="w-statistic__title">{{ title }}</div>
    <div class="w-statistic__value" :style="mergedValueStyle">
      <w-icon v-if="icon" class="w-statistic__icon" :name="icon" size="20" />
      <span v-if="prefix" class="w-statistic__prefix">{{ prefix }}</span>
      <span>{{ displayValue }}</span>
      <span v-if="suffix" class="w-statistic__suffix">{{ suffix }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WStatistic' })
const props = defineProps({
  title: String,
  value: [Number, String],
  prefix: String,
  suffix: String,
  precision: Number,
  valueStyle: Object,
  icon: String,
  color: String
})

const displayValue = computed(() => {
  if (typeof props.value === 'number' && props.precision !== undefined) {
    return props.value.toFixed(props.precision)
  }
  return props.value
})

const mergedValueStyle = computed(() => {
  const style: Record<string, string> = { ...(props.valueStyle || {}) }
  if (props.color) {
    style.color = `var(--w-color-${props.color}, ${props.color})`
  }
  return style
})
</script>

<style scoped>
.w-statistic { display: inline-block; }
.w-statistic__title { font-size: var(--w-font-size-small); color: var(--w-text-color-secondary); margin-bottom: 4px; }
.w-statistic__value { display: inline-flex; align-items: center; gap: 4px; font-size: 24px; font-weight: bold; color: var(--w-text-color-primary); font-family: var(--w-font-family); }
.w-statistic__icon { color: inherit; }
.w-statistic__prefix, .w-statistic__suffix { font-size: 16px; }
</style>
