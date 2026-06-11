<template>
  <div :class="['w-progress', `w-progress--${size}`]">
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
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WProgress' })
const props = defineProps({
  percentage: { type: Number, default: 0 },
  status: { type: String, default: '' },
  width: { type: Number, default: 200 },
  showText: { type: Boolean, default: true },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)

const percent = computed(() => Math.max(0, Math.min(100, props.percentage)))

const statusColor = computed(() => {
  if (props.status === 'success') return 'var(--w-color-success)'
  if (props.status === 'warning') return 'var(--w-color-warning)'
  if (props.status === 'danger') return 'var(--w-color-danger)'
  return 'linear-gradient(180deg, var(--w-color-primary-light), var(--w-color-primary))'
})
</script>

<style scoped>
.w-progress { display: inline-flex; align-items: center; gap: 8px; }
.w-progress__bar { height: 16px; background: #f0f0f0; border: 1px solid #c0c0c0; border-radius: 8px; overflow: hidden; }
.w-progress__inner { height: 100%; display: flex; align-items: center; justify-content: center; transition: width 0.3s; }
.w-progress__text { color: #fff; font-size: 10px; font-weight: bold; }
.w-progress__text-out { font-size: var(--w-font-size-small); color: var(--w-text-color-secondary); }
.w-progress--small .w-progress__bar { height: 12px; border-radius: 6px; }
.w-progress--small .w-progress__text { font-size: 9px; }
.w-progress--small .w-progress__text-out { font-size: var(--w-font-size-extra-small); }
.w-progress--large .w-progress__bar { height: 20px; border-radius: 10px; }
.w-progress--large .w-progress__text { font-size: var(--w-font-size-base); }
.w-progress--large .w-progress__text-out { font-size: var(--w-font-size-base); }
</style>
