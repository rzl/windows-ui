<template>
  <label :class="['w-checkbox', `w-checkbox--${size}`, { 'is-checked': isChecked, 'is-disabled': isDisabled, 'is-indeterminate': indeterminate }]">
    <span class="w-checkbox__input">
      <input
        type="checkbox"
        :checked="isChecked"
        :disabled="isDisabled"
        :value="label"
        @change="handleChange"
      />
      <span class="w-checkbox__inner" />
    </span>
    <span class="w-checkbox__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WCheckbox' })
const props = defineProps({
  modelValue: { type: [Boolean, Array] as any, default: false },
  label: [String, Number],
  disabled: Boolean,
  indeterminate: Boolean,
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const group = inject<any>('checkboxGroup', null)
const size = computed(() => props.size || group?.size?.value || globalSize.value)
const emit = defineEmits(['update:modelValue', 'change'])

const isChecked = computed(() => {
  if (group) return props.label !== undefined && group.modelValue.value.includes(props.label)
  if (Array.isArray(props.modelValue)) return props.label !== undefined && props.modelValue.includes(props.label)
  return props.modelValue
})

const isDisabled = computed(() => props.disabled || group?.disabled?.value)

const handleChange = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  if (group) {
    group.change(props.label, checked)
    return
  }
  if (Array.isArray(props.modelValue)) {
    const arr = [...props.modelValue]
    if (checked) arr.push(props.label)
    else {
      const idx = arr.indexOf(props.label)
      if (idx > -1) arr.splice(idx, 1)
    }
    emit('update:modelValue', arr)
    emit('change', arr)
  } else {
    emit('update:modelValue', checked)
    emit('change', checked)
  }
}
</script>

<style scoped>
.w-checkbox { display: inline-flex; align-items: center; cursor: pointer; font-family: var(--w-font-family); font-size: var(--w-font-size-base); margin-right: 12px; }
.w-checkbox__input { position: relative; display: inline-block; width: 13px; height: 13px; margin-right: 4px; }
.w-checkbox__input input { opacity: 0; position: absolute; width: 100%; height: 100%; cursor: pointer; }
.w-checkbox__inner { display: block; width: 13px; height: 13px; border: 1px solid #808080; background: #fff; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1); }
.w-checkbox.is-checked .w-checkbox__inner { background: var(--w-color-primary); border-color: var(--w-color-primary); }
.w-checkbox.is-checked .w-checkbox__inner::after { content: ''; position: absolute; left: 4px; top: 1px; width: 4px; height: 7px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.w-checkbox.is-indeterminate .w-checkbox__inner::after { content: ''; position: absolute; left: 2px; top: 5px; width: 7px; height: 2px; background: #fff; border: none; transform: none; }
.w-checkbox.is-disabled { opacity: 0.5; cursor: not-allowed; }
.w-checkbox__label { user-select: none; }
.w-checkbox--small { font-size: var(--w-font-size-small); }
.w-checkbox--small .w-checkbox__input { width: 11px; height: 11px; }
.w-checkbox--small .w-checkbox__inner { width: 11px; height: 11px; }
.w-checkbox--small.is-checked .w-checkbox__inner::after { left: 3px; top: 0px; width: 3px; height: 6px; }
.w-checkbox--small.is-indeterminate .w-checkbox__inner::after { left: 1px; top: 4px; width: 7px; height: 2px; }
.w-checkbox--large { font-size: var(--w-font-size-medium); }
.w-checkbox--large .w-checkbox__input { width: 16px; height: 16px; }
.w-checkbox--large .w-checkbox__inner { width: 16px; height: 16px; }
.w-checkbox--large.is-checked .w-checkbox__inner::after { left: 5px; top: 2px; width: 5px; height: 9px; }
.w-checkbox--large.is-indeterminate .w-checkbox__inner::after { left: 3px; top: 6px; width: 8px; height: 3px; }
</style>
