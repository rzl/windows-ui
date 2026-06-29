<template>
  <div :class="['w-checkbox-group', `w-checkbox-group--${size}`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WCheckboxGroup' })
const props = defineProps({
  modelValue: { type: Array as () => any[], default: () => [] },
  disabled: Boolean,
  min: { type: Number, default: undefined },
  max: { type: Number, default: undefined },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (value: any, checked: boolean) => {
  let arr = [...props.modelValue]
  if (checked) {
    if (props.max !== undefined && arr.length >= props.max) return
    if (!arr.includes(value)) arr.push(value)
  } else {
    if (props.min !== undefined && arr.length <= props.min) return
    arr = arr.filter(v => v !== value)
  }
  emit('update:modelValue', arr)
  emit('change', arr)
}

provide('checkboxGroup', {
  modelValue: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  size: computed(() => size.value),
  change: handleChange
})
</script>

<style scoped>
.w-checkbox-group { display: inline-flex; flex-wrap: wrap; gap: 8px; }
.w-checkbox-group--small { gap: 6px; }
.w-checkbox-group--large { gap: 12px; }
</style>
