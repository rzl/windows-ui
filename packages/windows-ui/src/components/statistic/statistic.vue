<template>
  <div class="w-statistic">
    <div class="w-statistic__title">{{ title }}</div>
    <div class="w-statistic__value" :style="valueStyle">
      <span v-if="prefix" class="w-statistic__prefix">{{ prefix }}</span>
      <span>{{ displayValue }}</span>
      <span v-if="suffix" class="w-statistic__suffix">{{ suffix }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'WStatistic' })
const props = defineProps({
  title: String,
  value: [Number, String],
  prefix: String,
  suffix: String,
  precision: Number,
  valueStyle: Object
})

const displayValue = computed(() => {
  if (typeof props.value === 'number' && props.precision !== undefined) {
    return props.value.toFixed(props.precision)
  }
  return props.value
})
</script>

<style scoped>
.w-statistic { display: inline-block; }
.w-statistic__title { font-size: var(--w-font-size-small); color: var(--w-text-color-secondary); margin-bottom: 4px; }
.w-statistic__value { font-size: 24px; font-weight: bold; color: var(--w-text-color-primary); font-family: var(--w-font-family); }
.w-statistic__prefix, .w-statistic__suffix { font-size: 16px; }
</style>
