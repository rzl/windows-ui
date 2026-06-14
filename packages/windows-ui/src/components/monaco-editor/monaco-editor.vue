<template>
  <div class="w-monaco-editor" :style="{ height: height + 'px' }">
    <iframe
      ref="iframeRef"
      class="w-monaco-editor__iframe"
      :src="iframeUrl"
      frameborder="0"
      @load="handleLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineOptions({ name: 'WMonacoEditor' })

const props = defineProps({
  modelValue: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  height: { type: Number, default: 300 },
  readOnly: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

const iframeRef = ref<HTMLIFrameElement>()
const iframeUrl = '/monaco-editor.html'
const isReady = ref(false)

function postMessage(message: any) {
  iframeRef.value?.contentWindow?.postMessage(message, '*')
}

function handleLoad() {
  postMessage({
    type: 'init',
    value: props.modelValue,
    language: props.language,
    readOnly: props.readOnly
  })
}

watch(() => props.modelValue, (value) => {
  if (isReady.value) {
    postMessage({ type: 'setValue', value })
  }
})

watch(() => props.language, (language) => {
  if (isReady.value) {
    postMessage({ type: 'setLanguage', language })
  }
})

if (typeof window !== 'undefined') {
  window.addEventListener('message', (e) => {
    if (e.source !== iframeRef.value?.contentWindow) return
    const data = e.data || {}
    if (data.type === 'ready') {
      isReady.value = true
    } else if (data.type === 'change') {
      emit('update:modelValue', data.value)
      emit('change', data.value)
    }
  })
}
</script>

<style scoped>
.w-monaco-editor { border: 1px solid #7f9db9; background: #fff; }
.w-monaco-editor__iframe { width: 100%; height: 100%; display: block; }
</style>
