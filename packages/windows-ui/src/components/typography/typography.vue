<template>
  <div class="w-typography"><slot /></div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WTypography' })
</script>

<style scoped>
.w-typography { font-family: var(--w-font-family); font-size: var(--w-font-size-base); line-height: 1.6; color: var(--w-text-color-primary); }
.w-typography :deep(h1) { font-size: 24px; margin: 12px 0; color: var(--w-color-primary); }
.w-typography :deep(h2) { font-size: 20px; margin: 10px 0; color: var(--w-color-primary); }
.w-typography :deep(h3) { font-size: 16px; margin: 8px 0; }
.w-typography :deep(p) { margin: 6px 0; }
.w-typography :deep(strong) { font-weight: bold; }
.w-typography :deep(em) { font-style: italic; }
.w-typography :deep(code) { background: #f0f0f0; padding: 1px 4px; border: 1px solid #c0c0c0; font-family: monospace; font-size: var(--w-font-size-small); }
</style>
