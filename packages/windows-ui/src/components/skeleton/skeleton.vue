<template>
  <div class="w-skeleton">
    <template v-if="!loading"><slot /></template>
    <template v-else>
      <div v-for="i in rows" :key="i" class="w-skeleton__row" :style="rowStyle(i)"><div class="w-skeleton__item" /></div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WSkeleton' })
const props = defineProps({ loading: { type: Boolean, default: true }, rows: { type: Number, default: 3 }, animated: { type: Boolean, default: true } })
const rowStyle = (i: number) => ({ width: i === 1 ? '40%' : i === props.rows ? '70%' : '100%' })
</script>

<style scoped>
.w-skeleton { width: 100%; }
.w-skeleton__row { margin-bottom: 8px; }
.w-skeleton__item { height: 16px; background: #e0e0e0; border-radius: var(--w-border-radius-base); }
.w-skeleton__item { animation: skeleton-pulse 1.5s infinite; }
@keyframes skeleton-pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
</style>
