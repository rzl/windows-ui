<template>
  <div :class="['w-input-number', { 'is-disabled': disabled }]">
    <button class="w-input-number__decrease" :disabled="disabled || modelValue <= min" @click="decrease">-</button>
    <input
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      @input="handleInput"
    />
    <button class="w-input-number__increase" :disabled="disabled || modelValue >= max" @click="increase">+</button>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WInputNumber' })
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 },
  disabled: Boolean
})
const emit = defineEmits(['update:modelValue', 'change'])

const handleInput = (e: Event) => {
  let val = Number((e.target as HTMLInputElement).value)
  val = Math.max(props.min, Math.min(props.max, val))
  emit('update:modelValue', val)
  emit('change', val)
}
const decrease = () => { const val = Math.max(props.min, props.modelValue - props.step); emit('update:modelValue', val); emit('change', val) }
const increase = () => { const val = Math.min(props.max, props.modelValue + props.step); emit('update:modelValue', val); emit('change', val) }
</script>

<style scoped>
.w-input-number { display: inline-flex; border: 1px solid #7f9db9; background: #fff; }
.w-input-number input { border: none; outline: none; width: 60px; text-align: center; font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
.w-input-number button { width: 22px; border: 1px solid #7f9db9; background: linear-gradient(180deg, #fff, #ecebe5); cursor: pointer; font-family: var(--w-font-family); }
.w-input-number button:hover { background: linear-gradient(180deg, #fff, #f0f8ff); }
.w-input-number button:disabled { opacity: 0.5; cursor: not-allowed; }
.w-input-number__decrease { border-right: none; }
.w-input-number__increase { border-left: none; }
</style>
