<template>
  <div class="w-segmented">
    <div v-for="opt in options" :key="opt.value" :class="['w-segmented__item', { 'is-active': modelValue === opt.value, 'is-disabled': opt.disabled }]" @click="select(opt)">
      <w-icon v-if="opt.icon" :name="opt.icon" size="small" />
      <span>{{ opt.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WSegmented' })
const props = defineProps({
  modelValue: [String, Number] as any,
  options: { type: Array as () => { label: string; value: any; icon?: string; disabled?: boolean }[], default: () => [] }
})
const emit = defineEmits(['update:modelValue', 'change'])

const select = (opt: any) => { if (opt.disabled) return; emit('update:modelValue', opt.value); emit('change', opt.value) }
</script>

<style scoped>
.w-segmented { display: inline-flex; border: 1px solid #919b9c; background: #f0f0f0; border-radius: var(--w-border-radius-base); overflow: hidden; }
.w-segmented__item { display: flex; align-items: center; gap: 4px; padding: 4px 12px; cursor: pointer; font-size: var(--w-font-size-base); border-right: 1px solid #d4d0c8; }
.w-segmented__item:last-child { border-right: none; }
.w-segmented__item:hover { background: #e0e0e0; }
.w-segmented__item.is-active { background: var(--w-color-primary); color: #fff; }
.w-segmented__item.is-disabled { opacity: 0.5; cursor: not-allowed; }
</style>
