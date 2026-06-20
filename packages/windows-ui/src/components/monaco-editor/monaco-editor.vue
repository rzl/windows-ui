<template>
  <div class="w-monaco-editor" :style="{ height: height + 'px' }">
    <iframe
      v-if="!hasError"
      ref="iframeRef"
      class="w-monaco-editor__iframe"
      :src="iframeUrl"
      frameborder="0"
      @load="handleLoad"
    />
    <textarea
      v-else
      class="w-monaco-editor__fallback"
      :value="modelValue"
      :readonly="readOnly"
      @input="handleFallbackInput"
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
  readOnly: { type: Boolean, default: false },
  cdn: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const iframeRef = ref<HTMLIFrameElement>()
const iframeUrl = computedCdnUrl()
const isReady = ref(false)
const hasError = ref(false)

function computedCdnUrl(): string {
  const base = '/monaco-editor.html'
  if (props.cdn) {
    return base + '?cdn=' + encodeURIComponent(props.cdn)
  }
  return base
}

function postMessage(message: any) {
  iframeRef.value?.contentWindow?.postMessage(message, '*')
}

function sendInit() {
  postMessage({
    type: 'init',
    value: props.modelValue,
    language: props.language,
    readOnly: props.readOnly
  })
}

function handleLoad() {
  // 如果 iframe 已经发过 ready，则直接 init；否则等待 ready
  if (isReady.value) {
    sendInit()
  }
}

function handleFallbackInput(e: Event) {
  const value = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', value)
  emit('change', value)
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
      sendInit()
    } else if (data.type === 'change') {
      emit('update:modelValue', data.value)
      emit('change', data.value)
    } else if (data.type === 'error') {
      // 只记录错误，不自动切换到 fallback，避免 worker 等小错误导致编辑器不可用
      console.error('[MonacoEditor]', data.message)
    }
  })
}
</script>

<style scoped>
.w-monaco-editor { border: 1px solid #7f9db9; background: #fff; }
.w-monaco-editor__iframe { width: 100%; height: 100%; display: block; }
.w-monaco-editor__fallback { width: 100%; height: 100%; display: block; border: none; padding: 8px; font-family: monospace; font-size: 13px; resize: none; outline: none; }
</style>
