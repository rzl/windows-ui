<template>
  <div :class="['w-radio-group', `w-radio-group--${size}`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WRadioGroup' })
const props = defineProps({
  modelValue: [String, Number, Boolean] as any,
  disabled: Boolean,
  name: String,
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (value: any) => {
  emit('update:modelValue', value)
  emit('change', value)
}

provide('radioGroup', {
  modelValue: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  name: computed(() => props.name),
  size: computed(() => size.value),
  change: handleChange
})
</script>

<style scoped>
.w-radio-group { display: inline-flex; flex-wrap: wrap; gap: 8px; }
.w-radio-group--small { gap: 6px; }
.w-radio-group--large { gap: 12px; }
</style>
