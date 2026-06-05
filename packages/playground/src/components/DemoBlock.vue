<template>
  <div class="demo-block">
    <div class="demo-block__title">{{ title }}</div>
    <div class="demo-block__content">
      <slot />
    </div>
    <code-block v-if="code" :code="code" />
    <slot name="code" />
  </div>
</template>

<script setup lang="ts">
import CodeBlock from './CodeBlock.vue'

defineProps({
  title: String,
  code: String
})
</script>

<style scoped>
.demo-block { margin-bottom: 16px; }
.demo-block:last-child { margin-bottom: 0; }
.demo-block__title { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px; padding-left: 8px; border-left: 3px solid var(--w-color-primary); }
.demo-block__content { padding: 12px; background: #fafafa; border: 1px solid #e0e0e0; }
</style>
