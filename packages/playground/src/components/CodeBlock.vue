<template>
  <div class="code-block">
    <div class="code-block__header" @click="toggle">
      <span class="code-block__title">{{ expanded ? '收起代码' : '展开代码' }}</span>
      <span class="code-block__icon" :class="{ expanded: expanded }">▼</span>
    </div>
    <transition name="code-slide">
      <pre v-show="expanded" class="code-block__body"><code class="language-html">{{ normalized }}</code></pre>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  code: { type: String, required: true }
})

const expanded = ref(false)
const toggle = () => { expanded.value = !expanded.value }

const normalized = computed(() => {
  return (props.code || '').replace(/\\n/g, '\n').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
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
  padding: 12px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
  color: #1a1a1a;
  background: #f8f8f8;
  border-top: 1px solid #d4d0c8;
}
.code-block__body code { font-family: Consolas, Menlo, 'Courier New', monospace; white-space: pre; }

.code-slide-enter-active, .code-slide-leave-active { transition: all .2s ease; }
.code-slide-enter-from, .code-slide-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
