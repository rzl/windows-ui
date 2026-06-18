<template>
  <div class="stat-content" :class="`is-${color}`">
    <w-icon :name="icon || 'star'" :size="40" />
    <span class="stat-value">{{ displayValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  widget: any
  stats?: Record<string, any>
}>()

const color = computed(() => props.widget.color || 'primary')
const icon = computed(() => props.widget.icon || 'star')
const displayValue = computed(() => {
  const field = props.widget.field
  if (field && props.stats && props.stats[field] !== undefined) {
    return props.stats[field]
  }
  return props.widget.value ?? 0
})
</script>

<style scoped>
.stat-content { display: flex; align-items: center; gap: 12px; padding: 8px; }
.stat-value { font-size: 32px; font-weight: bold; }
.is-primary { color: var(--w-color-primary); }
.is-success { color: var(--w-color-success); }
.is-warning { color: var(--w-color-warning); }
.is-danger { color: var(--w-color-danger); }
</style>
