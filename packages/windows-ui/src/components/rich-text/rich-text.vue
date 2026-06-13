<template>
  <div :class="['w-rich-text', `w-rich-text--${size}`]">
    <div class="w-rich-text__toolbar">
      <w-button type="default" size="small" @click="exec('bold')">B</w-button>
      <w-button type="default" size="small" @click="exec('italic')">I</w-button>
      <w-button type="default" size="small" @click="exec('underline')">U</w-button>
    </div>
    <div
      ref="editorRef"
      class="w-rich-text__editor"
      contenteditable="true"
      :placeholder="placeholder"
      @input="handleInput"
      v-html="modelValue"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import WButton from '../button/button.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WRichText' })

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '请输入内容' },
  disabled: Boolean,
  size: { type: String as () => 'large' | 'default' | 'small', default: undefined }
})

const emit = defineEmits(['update:modelValue', 'change'])
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const editorRef = ref<HTMLDivElement>()

function exec(command: string) {
  if (props.disabled) return
  document.execCommand(command, false)
  handleInput()
}

function handleInput() {
  const html = editorRef.value?.innerHTML || ''
  emit('update:modelValue', html)
  emit('change', html)
}
</script>

<style scoped>
.w-rich-text { border: 2px solid; border-color: #808080 #fff #fff #808080; background: #fff; }
.w-rich-text__toolbar { display: flex; gap: 4px; padding: 4px; background: var(--w-bg-color); border-bottom: 1px solid #d4d0c8; }
.w-rich-text__editor { min-height: 120px; padding: 8px; outline: none; font-size: var(--w-font-size-base); line-height: 1.5; }
.w-rich-text__editor:empty:before { content: attr(placeholder); color: #999; }
.w-rich-text--small .w-rich-text__editor { font-size: var(--w-font-size-small); min-height: 80px; }
.w-rich-text--large .w-rich-text__editor { font-size: var(--w-font-size-medium); min-height: 160px; }
</style>
