<template>
  <div :class="['w-input-tag', { 'is-disabled': disabled }]" @click="focusInput">
    <w-tag
      v-for="(tag, i) in modelValue"
      :key="i"
      closable
      size="small"
      @close="removeTag(i)"
    >{{ tag }}</w-tag>
    <input
      ref="inputRef"
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @keydown.enter="addTag"
      @keydown.backspace="handleBackspace"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WTag from '../tag/tag.vue'

defineOptions({ name: 'WInputTag' })
const props = defineProps({
  modelValue: { type: Array as () => string[], default: () => [] },
  placeholder: String,
  disabled: Boolean,
  max: Number
})
const emit = defineEmits(['update:modelValue'])

const inputRef = ref<HTMLInputElement>()
const inputValue = ref('')

const addTag = () => {
  const val = inputValue.value.trim()
  if (!val) return
  if (props.max && props.modelValue.length >= props.max) return
  if (!props.modelValue.includes(val)) {
    emit('update:modelValue', [...props.modelValue, val])
  }
  inputValue.value = ''
}
const removeTag = (i: number) => {
  const arr = [...props.modelValue]
  arr.splice(i, 1)
  emit('update:modelValue', arr)
}
const handleBackspace = () => { if (!inputValue.value && props.modelValue.length) removeTag(props.modelValue.length - 1) }
const focusInput = () => { if (!props.disabled) inputRef.value?.focus() }
</script>

<style scoped>
.w-input-tag { display: inline-flex; flex-wrap: wrap; gap: 4px; align-items: center; border: 1px solid #7f9db9; background: #fff; padding: 2px 4px; min-height: 28px; cursor: text; }
.w-input-tag input { border: none; outline: none; flex: 1; min-width: 60px; font-family: var(--w-font-family); font-size: var(--w-font-size-base); background: transparent; }
.w-input-tag.is-disabled { background: #ebebe4; cursor: not-allowed; }
</style>
