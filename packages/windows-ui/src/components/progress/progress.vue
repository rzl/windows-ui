<template>
  <div class="w-progress">
    <div class="w-progress__bar" :style="{ width: `${width}px` }">
      <div class="w-progress__inner" :style="{ width: `${percent}%`, background: statusColor }">
        <span v-if="showText && percent > 10" class="w-progress__text">{{ percent }}%</span>
      </div>
    </div>
    <span v-if="showText" class="w-progress__text-out">{{ percent }}%</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'WProgress' })
const props = defineProps({
  percentage: { type: Number, default: 0 },
  status: { type: String, default: '' },
  width: { type: Number, default: 200 },
  showText: { type: Boolean, default: true }
})

const percent = computed(() => Math.max(0, Math.min(100, props.percentage)))

const statusColor = computed(() => {
  if (props.status === 'success') return '#3a9e3a'
  if (props.status === 'warning') return '#e4a010'
  if (props.status === 'danger') return '#d92b2b'
  return 'linear-gradient(180deg, #5a84ff, #245edb)'
})
</script>

<style scoped>
.w-progress { display: inline-flex; align-items: center; gap: 8px; }
.w-progress__bar { height: 16px; background: #f0f0f0; border: 1px solid #c0c0c0; border-radius: 8px; overflow: hidden; }
.w-progress__inner { height: 100%; display: flex; align-items: center; justify-content: center; transition: width 0.3s; }
.w-progress__text { color: #fff; font-size: 10px; font-weight: bold; }
.w-progress__text-out { font-size: var(--w-font-size-small); color: var(--w-text-color-secondary); }
</style>
