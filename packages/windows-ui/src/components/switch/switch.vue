<template>
  <button :class="['w-switch', { 'is-checked': modelValue, 'is-disabled': disabled }]" :disabled="disabled" @click="toggle">
    <span class="w-switch__core"><span class="w-switch__thumb" /></span>
    <span v-if="activeText || inactiveText" class="w-switch__label">{{ modelValue ? activeText : inactiveText }}</span>
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'WSwitch' })
const props = defineProps({ modelValue: Boolean, disabled: Boolean, activeText: String, inactiveText: String })
const emit = defineEmits(['update:modelValue', 'change'])
const toggle = () => { const v = !props.modelValue; emit('update:modelValue', v); emit('change', v) }
</script>

<style scoped>
.w-switch { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; font-family: var(--w-font-family); padding: 2px; }
.w-switch__core { display: inline-block; width: 36px; height: 18px; background: #c0c0c0; border: 1px solid #808080; border-radius: 9px; position: relative; transition: background 0.2s; }
.w-switch.is-checked .w-switch__core { background: var(--w-color-primary); border-color: var(--w-color-primary); }
.w-switch__thumb { position: absolute; top: 1px; left: 1px; width: 14px; height: 14px; background: #fff; border-radius: 50%; transition: left 0.2s; box-shadow: 1px 1px 2px rgba(0,0,0,0.2); }
.w-switch.is-checked .w-switch__thumb { left: 19px; }
.w-switch__label { font-size: var(--w-font-size-base); color: var(--w-text-color-primary); }
.w-switch.is-disabled { opacity: 0.5; cursor: not-allowed; }
</style>
