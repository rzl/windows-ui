<template>
  <div :class="['w-input', `w-input--${size}`, { 'is-disabled': disabled }]">
    <w-icon v-if="prefixIcon" :name="prefixIcon" size="small" class="w-input__prefix" />
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
    <w-icon v-if="suffixIcon" :name="suffixIcon" size="small" class="w-input__suffix" />
    <w-icon v-if="clearable && modelValue" name="close" size="small" class="w-input__clear" @click="handleClear" />
  </div>
</template>

<script setup lang="ts">
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WInput' })
defineProps({
  modelValue: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  size: { type: String, default: 'default' },
  disabled: Boolean,
  readonly: Boolean,
  clearable: Boolean,
  prefixIcon: String,
  suffixIcon: String
})
const emit = defineEmits(['update:modelValue', 'input', 'focus', 'blur', 'clear'])

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', val)
  emit('input', val)
}
const handleClear = () => { emit('update:modelValue', ''); emit('clear') }
</script>

<style scoped>
.w-input { display: inline-flex; align-items: center; border: 1px solid #7f9db9; background: #fff; padding: 2px 4px; }
.w-input input { border: none; outline: none; flex: 1; font-family: var(--w-font-family); font-size: var(--w-font-size-base); background: transparent; }
.w-input--small input { font-size: var(--w-font-size-small); padding: 1px 2px; }
.w-input--large input { font-size: var(--w-font-size-medium); padding: 4px 6px; }
.w-input:focus-within { border-color: var(--w-color-primary); outline: 1px solid #a5c2e8; outline-offset: -2px; }
.w-input.is-disabled { background: #ebebe4; }
.w-input.is-disabled input { color: #a0a0a0; cursor: not-allowed; }
.w-input__prefix, .w-input__suffix { margin: 0 4px; cursor: default; }
.w-input__clear { cursor: pointer; margin-left: 4px; }
</style>
