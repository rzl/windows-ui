<template>
  <div :class="['w-segmented', `w-segmented--${size}`]">
    <div v-for="opt in options" :key="opt.value" :class="['w-segmented__item', { 'is-active': modelValue === opt.value, 'is-disabled': opt.disabled }]" @click="select(opt)">
      <w-icon v-if="opt.icon" :name="opt.icon" :size="size" />
      <span>{{ opt.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WSegmented' })
const props = defineProps({
  modelValue: [String, Number] as any,
  options: { type: Array as () => { label: string; value: any; icon?: string; disabled?: boolean }[], default: () => [] },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'change'])

const select = (opt: any) => { if (opt.disabled) return; emit('update:modelValue', opt.value); emit('change', opt.value) }
</script>

<style scoped>
.w-segmented { display: inline-flex; border: 1px solid #919b9c; background: #f0f0f0; border-radius: var(--w-border-radius-base); overflow: hidden; }
.w-segmented__item { display: flex; align-items: center; gap: 4px; padding: 4px 12px; cursor: pointer; font-size: var(--w-font-size-base); border-right: 1px solid #d4d0c8; box-sizing: border-box; height: var(--w-component-size); }
.w-segmented__item:last-child { border-right: none; }
.w-segmented__item:hover { background: #e0e0e0; }
.w-segmented__item.is-active { background: var(--w-color-primary); color: #fff; }
.w-segmented__item.is-disabled { opacity: 0.5; cursor: not-allowed; }
.w-segmented--small .w-segmented__item { padding: 2px 8px; height: var(--w-component-size-small); font-size: var(--w-font-size-small); }
.w-segmented--large .w-segmented__item { padding: 6px 16px; height: var(--w-component-size-large); font-size: var(--w-font-size-medium); }
</style>