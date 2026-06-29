<template>
  <div :class="['w-rich-text', `w-rich-text--${size}`]">
    <div class="w-rich-text__toolbar">
      <w-select
        :model-value="blockType"
        :options="headingOptions"
        size="small"
        style="width: 80px"
        @change="setBlock"
      />
      <w-button type="default" size="small" title="加粗" @click="exec('bold')">B</w-button>
      <w-button type="default" size="small" title="斜体" @click="exec('italic')">I</w-button>
      <w-button type="default" size="small" title="下划线" @click="exec('underline')">U</w-button>
      <w-button type="default" size="small" title="无序列表" @click="exec('insertUnorderedList')">• 列表</w-button>
      <w-button type="default" size="small" title="有序列表" @click="exec('insertOrderedList')">1. 列表</w-button>
      <w-button type="default" size="small" title="插入链接" @click="insertLink">链接</w-button>
      <w-button type="default" size="small" title="插入图片" @click="insertImage">图片</w-button>
      <w-button type="default" size="small" title="清除格式" @click="exec('removeFormat')">清除</w-button>
    </div>
    <div
      ref="editorRef"
      class="w-rich-text__editor"
      :placeholder="placeholder"
      :contenteditable="!props.disabled"
      @input="handleInput"
      v-html="modelValue"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import WButton from '../button/button.vue'
import WSelect from '../select/select.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WRichText' })

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '请输入内容' },
  disabled: Boolean,
  size: { type: String as () => 'large' | 'default' | 'small', default: undefined },
  plainText: Boolean
})

const emit = defineEmits(['update:modelValue', 'change'])
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const editorRef = ref<HTMLDivElement>()
const blockType = ref('p')

const headingOptions = [
  { label: '正文', value: 'p' },
  { label: '标题 1', value: 'H1' },
  { label: '标题 2', value: 'H2' },
  { label: '标题 3', value: 'H3' },
  { label: '标题 4', value: 'H4' },
  { label: '标题 5', value: 'H5' },
  { label: '标题 6', value: 'H6' }
]

function exec(command: string, value?: string) {
  if (props.disabled) return
  document.execCommand(command, false, value)
  handleInput()
}

function setBlock(tag: string) {
  if (props.disabled) return
  exec('formatBlock', tag)
  blockType.value = tag
}

function insertLink() {
  if (props.disabled) return
  const url = window.prompt('请输入链接地址', 'https://')
  if (url) exec('createLink', url)
}

function insertImage() {
  if (props.disabled) return
  const url = window.prompt('请输入图片地址', 'https://')
  if (url) exec('insertImage', url)
}

function toPlainText(html: string) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

function handleInput() {
  const html = editorRef.value?.innerHTML || ''
  const value = props.plainText ? toPlainText(html) : html
  emit('update:modelValue', value)
  emit('change', value)
}

watch(() => props.modelValue, (v) => {
  if (editorRef.value && editorRef.value.innerHTML !== v) {
    editorRef.value.innerHTML = v || ''
  }
})
</script>

<style scoped>
.w-rich-text { border: 2px solid; border-color: #808080 #fff #fff #808080; background: #fff; }
.w-rich-text__toolbar { display: flex; gap: 4px; padding: 4px; background: var(--w-bg-color); border-bottom: 1px solid #d4d0c8; flex-wrap: wrap; }
.w-rich-text__editor { min-height: 120px; padding: 8px; outline: none; font-size: var(--w-font-size-base); line-height: 1.5; }
.w-rich-text__editor:empty:before { content: attr(placeholder); color: #999; }
.w-rich-text--small .w-rich-text__editor { font-size: var(--w-font-size-small); min-height: 80px; }
.w-rich-text--large .w-rich-text__editor { font-size: var(--w-font-size-medium); min-height: 160px; }
</style>
