<template>
  <section :id="id" class="demo-section">
    <div class="demo-section__header">
      <h2 class="demo-section__title">{{ title }}</h2>
      <p v-if="description" class="demo-section__desc">{{ description }}</p>
    </div>
    <div class="demo-section__body">
      <slot />
    </div>
    <div v-if="doc" class="demo-section__docs">
      <div class="docs-header" @click="toggleDocs">
        <span>📄 {{ t('使用说明') }}</span>
        <span class="docs-icon" :class="{ expanded: showDocs }">▼</span>
      </div>
      <transition name="docs-slide">
        <div v-show="showDocs" class="docs-body markdown-body" v-html="renderedDoc" />
      </transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import typescript from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github-dark.css'

hljs.registerLanguage('xml', xml)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)

const props = defineProps({
  id: String,
  title: String,
  description: String,
  doc: String
})

const { t } = useI18n()
const showDocs = ref(true)
const docContent = ref('')
const toggleDocs = () => { showDocs.value = !showDocs.value }

const renderer = new marked.Renderer()
renderer.code = (token: any) => {
  const code = token.text || ''
  const lang = token.lang || ''
  let highlighted = ''
  if (lang && hljs.getLanguage(lang)) {
    highlighted = hljs.highlight(code, { language: lang }).value
  } else {
    highlighted = hljs.highlightAuto(code).value
  }
  return `<pre><code class="hljs language-${lang || 'plaintext'}">${highlighted}</code></pre>`
}
marked.use({ renderer })

const renderedDoc = computed(() => {
  return marked.parse(docContent.value || '暂无文档内容', { async: false })
})

watch(() => props.doc, async (name) => {
  if (!name) return
  try {
    const res = await fetch(`/docs/${name}/usage.md`)
    docContent.value = res.ok ? await res.text() : '文档加载失败'
  } catch (e) {
    docContent.value = '文档加载失败'
  }
}, { immediate: true })

const register = inject<(s: { id: string; title: string }) => void>('tocRegister', () => {})
const unregister = inject<(id: string) => void>('tocUnregister', () => {})

onMounted(() => {
  if (props.id && props.title) {
    register({ id: props.id, title: props.title })
  }
})

onUnmounted(() => {
  if (props.id) {
    unregister(props.id)
  }
})
</script>

<style scoped>
.demo-section { margin-bottom: 24px; background: var(--w-bg-color); border: 2px solid; border-color: var(--w-border-color-light) var(--w-border-color-dark) var(--w-border-color-dark) var(--w-border-color-light); }
.demo-section__header { padding: 12px 16px; background: linear-gradient(180deg, var(--w-fill-color-lighter), var(--w-fill-color-dark)); border-bottom: 1px solid var(--w-border-color); }
.demo-section__title { font-size: 18px; color: var(--w-color-primary); margin: 0; }
.demo-section__desc { font-size: 12px; color: var(--w-text-color-secondary); margin: 4px 0 0; }
.demo-section__body { padding: 16px; }

.demo-section__docs { border-top: 1px solid var(--w-border-color); }
.docs-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: var(--w-fill-color); cursor: pointer; user-select: none; font-size: 13px; color: var(--w-text-color-regular); }
.docs-header:hover { background: var(--w-fill-color-dark); }
.docs-icon { display: inline-block; width: 16px; text-align: center; font-size: 11px; transition: transform .2s ease; }
.docs-icon.expanded { transform: rotate(180deg); }
.docs-body { padding: 16px; background: var(--w-fill-color-lighter); border-top: 1px solid var(--w-border-color); }

.docs-slide-enter-active, .docs-slide-leave-active { transition: all .2s ease; }
.docs-slide-enter-from, .docs-slide-leave-to { opacity: 0; transform: translateY(-4px); }
</style>

<style>
.markdown-body h1, .markdown-body h2, .markdown-body h3 { margin-top: 0; color: var(--w-text-color-primary); }
.markdown-body h1 { font-size: 18px; border-bottom: 2px solid var(--w-color-primary); padding-bottom: 6px; }
.markdown-body h2 { font-size: 16px; margin-top: 16px; color: var(--w-color-primary); }
.markdown-body h3 { font-size: 14px; margin-top: 12px; }
.markdown-body p { margin: 8px 0; line-height: 1.6; }
.markdown-body pre { background: #1e1e1e; color: #d4d4d4; padding: 12px; overflow-x: auto; border-radius: 0; }
.markdown-body code { font-family: Consolas, Menlo, monospace; font-size: 12px; }
.markdown-body pre code { display: block; }
.markdown-body table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
.markdown-body th, .markdown-body td { border: 1px solid var(--w-border-color); padding: 6px 10px; text-align: left; }
.markdown-body th { background: var(--w-fill-color-dark); }
.markdown-body ul, .markdown-body ol { padding-left: 20px; }
.markdown-body blockquote { margin: 8px 0; padding-left: 12px; border-left: 3px solid var(--w-color-primary); color: var(--w-text-color-secondary); }
</style>
