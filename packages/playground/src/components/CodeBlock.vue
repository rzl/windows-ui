<template>
  <div class="code-block">
    <div class="code-block__header" @click="toggle">
      <span class="code-block__title">{{ expanded ? '收起代码' : '展开代码' }}</span>
      <span class="code-block__icon" :class="{ expanded: expanded }">▼</span>
    </div>
    <transition name="code-slide">
      <pre v-show="expanded" class="code-block__body"><code ref="codeEl" class="hljs" v-html="highlighted"></code></pre>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import 'highlight.js/styles/github.css'

hljs.registerLanguage('xml', xml)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)

const props = defineProps({
  code: { type: String, required: true }
})

const expanded = ref(false)
const codeEl = ref<HTMLElement>()
const toggle = () => { expanded.value = !expanded.value }

const normalized = computed(() => {
  return (props.code || '').replace(/\\n/g, '\n').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
})

const highlighted = computed(() => {
  const code = normalized.value
  if (!code) return ''
  // Auto-detect language; fallback to xml for Vue SFC code
  const result = hljs.highlightAuto(code, ['xml', 'javascript', 'css'])
  return result.value
})

// Re-highlight on content change
watch(() => props.code, () => {
  nextTick(() => {
    if (codeEl.value) {
      hljs.highlightElement(codeEl.value)
    }
  })
})
</script>

<style scoped>
.code-block {
  margin-top: 8px;
  border: 1px solid #d4d0c8;
  background: #fff;
  border-radius: 0;
  box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #808080;
}
.code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: linear-gradient(to bottom, #245edb 0%, #3a6ee5 100%);
  color: #fff;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  border-bottom: 1px solid #d4d0c8;
}
.code-block__title { font-weight: 600; }
.code-block__icon {
  display: inline-block;
  width: 16px;
  text-align: center;
  font-size: 11px;
  transition: transform .2s ease;
}
.code-block__icon.expanded { transform: rotate(180deg); }
.code-block__body {
  margin: 0;
  padding: 0;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
  background: #f8f8f8;
  border-top: 1px solid #d4d0c8;
}
.code-block__body code {
  display: block;
  padding: 12px;
  font-family: Consolas, Menlo, 'Courier New', monospace;
  white-space: pre;
}

.code-slide-enter-active, .code-slide-leave-active { transition: all .2s ease; }
.code-slide-enter-from, .code-slide-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
