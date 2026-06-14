<template>
  <div :class="['w-input-otp', `w-input-otp--${size}`]">
    <input
      v-for="i in length"
      :key="i"
      :ref="el => setItemRef(el as HTMLInputElement, i - 1)"
      v-model="values[i - 1]"
      maxlength="1"
      class="w-input-otp__digit"
      @input="handleInput(i - 1)"
      @keydown="handleKeydown($event, i - 1)"
      @paste="handlePaste"
    />
    <w-icon v-if="clearable && modelValue" name="close" :size="size" class="w-input-otp__clear" @click="handleClear" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WInputOTP' })
const props = defineProps({
  modelValue: String,
  length: { type: Number, default: 6 },
  clearable: { type: Boolean, default: true },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'complete', 'clear'])

const values = ref<string[]>(new Array(props.length).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])

const setItemRef = (el: HTMLInputElement, index: number) => { if (el) inputRefs.value[index] = el }

watch(() => props.modelValue, (v) => {
  if (v) values.value = v.split('').concat(new Array(props.length).fill('')).slice(0, props.length)
}, { immediate: true })

watch(values, (v) => {
  const code = v.join('')
  emit('update:modelValue', code)
  if (code.length === props.length) emit('complete', code)
}, { deep: true })

const handleInput = (index: number) => {
  const val = values.value[index]
  if (val && index < props.length - 1) inputRefs.value[index + 1]?.focus()
}
const handleKeydown = (e: KeyboardEvent, index: number) => {
  if (e.key === 'Backspace' && !values.value[index] && index > 0) inputRefs.value[index - 1]?.focus()
}
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text') || ''
  const chars = text.split('').slice(0, props.length)
  chars.forEach((c, i) => { values.value[i] = c })
  inputRefs.value[Math.min(chars.length, props.length - 1)]?.focus()
}
const handleClear = () => {
  values.value = new Array(props.length).fill('')
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.w-input-otp { display: inline-flex; align-items: center; gap: 6px; }
.w-input-otp__digit { width: 32px; height: 36px; border: 1px solid #7f9db9; text-align: center; font-size: 18px; font-family: var(--w-font-family); background: #fff; }
.w-input-otp__digit:focus { border-color: var(--w-color-primary); outline: 1px solid #a5c2e8; outline-offset: -2px; }
.w-input-otp__clear { cursor: pointer; margin-left: 4px; }
.w-input-otp--small .w-input-otp__digit { width: 28px; height: 30px; font-size: 14px; }
.w-input-otp--large .w-input-otp__digit { width: 36px; height: 42px; font-size: 22px; }
</style>
