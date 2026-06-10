<template>
  <div class="rich-editor">
    <textarea :id="editorId" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const editorId = 'tinymce-editor-' + Math.random().toString(36).slice(2)
let editor: any = null

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js'
  script.onload = () => {
    initEditor()
  }
  document.head.appendChild(script)
})

function initEditor() {
  const win = window as any
  if (!win.tinymce) return
  win.tinymce.init({
    selector: '#' + editorId,
    language: 'zh_CN',
    language_url: 'https://cdn.jsdelivr.net/npm/tinymce@7/langs/zh_CN.js',
    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    height: 400,
    menubar: false,
    setup: (ed: any) => {
      editor = ed
      ed.on('change input', () => {
        emit('update:modelValue', ed.getContent())
      })
    }
  })
}

watch(() => props.modelValue, (val) => {
  if (editor && editor.getContent() !== val) {
    editor.setContent(val || '')
  }
})

onBeforeUnmount(() => {
  const win = window as any
  if (win.tinymce && editor) {
    win.tinymce.remove('#' + editorId)
  }
})
</script>

<style scoped>
.rich-editor { border: 1px solid #7f9db9; }
</style>
