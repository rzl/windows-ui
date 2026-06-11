<template>
  <div :class="['w-input-tag', `w-input-tag--${size}`, { 'is-disabled': disabled }]" @click="focusInput">
    <w-tag
      v-for="(tag, i) in modelValue"
      :key="i"
      closable
      :size="size"
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
    <w-icon v-if="clearable && modelValue.length" name="close" :size="size" class="w-input-tag__clear" @click="handleClear" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WTag from '../tag/tag.vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WInputTag' })
const props = defineProps({
  modelValue: { type: Array as () => string[], default: () => [] },
  placeholder: String,
  disabled: Boolean,
  max: Number,
  clearable: { type: Boolean, default: true },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'clear'])

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
const handleClear = () => { emit('update:modelValue', []); emit('clear') }
</script>

<style scoped>
.w-input-tag { display: inline-flex; flex-wrap: wrap; gap: 4px; align-items: center; box-sizing: border-box; border: 1px solid #7f9db9; background: #fff; padding: 2px 4px; min-height: var(--w-component-size); cursor: text; }
.w-input-tag input { border: none; outline: none; flex: 1; min-width: 60px; font-family: var(--w-font-family); font-size: var(--w-font-size-base); background: transparent; }
.w-input-tag--small { min-height: var(--w-component-size-small); padding: 1px 2px; }
.w-input-tag--small input { font-size: var(--w-font-size-small); }
.w-input-tag--large { min-height: var(--w-component-size-large); padding: 4px 6px; }
.w-input-tag--large input { font-size: var(--w-font-size-medium); }
.w-input-tag.is-disabled { background: #ebebe4; cursor: not-allowed; }
.w-input-tag__clear { cursor: pointer; margin-left: 4px; }
</style>
