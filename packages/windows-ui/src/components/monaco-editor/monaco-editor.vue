<template>
  <div class="w-monaco-editor" :style="containerStyle">
    <div v-if="loading || iframeLoading" class="w-monaco-editor__loading">
      <w-icon name="loading" /> 编辑器加载中...
    </div>
    <iframe
      v-if="!hasError"
      ref="iframeRef"
      class="w-monaco-editor__iframe"
      :src="iframeUrl"
      frameborder="0"
      @load="handleLoad"
      @error="handleError"
    />
    <textarea
      v-if="hasError"
      class="w-monaco-editor__fallback"
      :value="modelValue"
      :readonly="readOnly"
      @input="handleFallbackInput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WMonacoEditor' })

const props = defineProps({
  modelValue: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  height: { type: [String, Number], default: 300 },
  width: { type: [String, Number], default: '100%' },
  readOnly: { type: Boolean, default: false },
  cdn: { type: String, default: '' },
  theme: { type: String, default: 'vs' },
  options: { type: Object as () => Record<string, any>, default: () => ({}) },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

const iframeRef = ref<HTMLIFrameElement>()
const iframeUrl = computedCdnUrl()
const isReady = ref(false)
const hasError = ref(false)
const iframeLoading = ref(true)

const containerStyle = computed(() => {
  const h = typeof props.height === 'number' ? `${props.height}px` : props.height
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width
  return { height: h, width: w }
})

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
    readOnly: props.readOnly,
    theme: props.theme,
    options: props.options
  })
}

function handleLoad() {
  iframeLoading.value = false
  if (isReady.value) {
    sendInit()
  }
}

function handleError() {
  hasError.value = true
  iframeLoading.value = false
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

watch(() => props.theme, (theme) => {
  if (isReady.value) {
    postMessage({ type: 'setTheme', theme })
  }
})

watch(() => props.options, (options) => {
  if (isReady.value) {
    postMessage({ type: 'setOptions', options })
  }
}, { deep: true })

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
      console.error('[MonacoEditor]', data.message)
      hasError.value = true
    }
  })
}
</script>

<style scoped>
.w-monaco-editor { position: relative; border: 1px solid #7f9db9; background: #fff; }
.w-monaco-editor__iframe { width: 100%; height: 100%; display: block; }
.w-monaco-editor__fallback { width: 100%; height: 100%; display: block; border: none; padding: 8px; font-family: monospace; font-size: 13px; resize: none; outline: none; }
.w-monaco-editor__loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.8); color: var(--w-text-color-secondary); font-size: var(--w-font-size-base); z-index: 1; }
</style>
