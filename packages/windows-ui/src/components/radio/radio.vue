<template>
  <label :class="['w-radio', `w-radio--${size}`, { 'is-checked': isChecked, 'is-disabled': disabled }]">
    <span class="w-radio__input">
      <input type="radio" :checked="isChecked" :disabled="disabled" :value="label" :name="name" @change="handleChange" />
      <span class="w-radio__inner" />
    </span>
    <span class="w-radio__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WRadio' })
const props = defineProps({
  modelValue: [String, Number, Boolean] as any,
  label: [String, Number, Boolean] as any,
  disabled: Boolean,
  name: String,
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'change'])

const isChecked = computed(() => props.modelValue === props.label)

const handleChange = () => {
  emit('update:modelValue', props.label)
  emit('change', props.label)
}
</script>

<style scoped>
.w-radio { display: inline-flex; align-items: center; cursor: pointer; font-family: var(--w-font-family); font-size: var(--w-font-size-base); margin-right: 12px; }
.w-radio__input { position: relative; display: inline-block; width: 13px; height: 13px; margin-right: 4px; }
.w-radio__input input { opacity: 0; position: absolute; width: 100%; height: 100%; cursor: pointer; }
.w-radio__inner { display: block; width: 13px; height: 13px; border: 1px solid #808080; border-radius: 50%; background: #fff; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1); }
.w-radio.is-checked .w-radio__inner { border-color: var(--w-color-primary); }
.w-radio.is-checked .w-radio__inner::after { content: ''; position: absolute; left: 4px; top: 4px; width: 5px; height: 5px; border-radius: 50%; background: var(--w-color-primary); }
.w-radio.is-disabled { opacity: 0.5; cursor: not-allowed; }
.w-radio__label { user-select: none; }
.w-radio--small { font-size: var(--w-font-size-small); }
.w-radio--small .w-radio__input { width: 11px; height: 11px; }
.w-radio--small .w-radio__inner { width: 11px; height: 11px; }
.w-radio--small.is-checked .w-radio__inner::after { left: 3px; top: 3px; width: 4px; height: 4px; }
.w-radio--large { font-size: var(--w-font-size-medium); }
.w-radio--large .w-radio__input { width: 16px; height: 16px; }
.w-radio--large .w-radio__inner { width: 16px; height: 16px; }
.w-radio--large.is-checked .w-radio__inner::after { left: 5px; top: 5px; width: 5px; height: 5px; }
</style>
