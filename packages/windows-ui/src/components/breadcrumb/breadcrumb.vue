<template>
  <nav class="w-breadcrumb">
    <span
      v-for="(item, i) in items"
      :key="i"
      :class="['w-breadcrumb__item', { 'is-last': i === items.length - 1 }]"
    >
      <a v-if="item.href && i < items.length - 1" :href="item.href">{{ item.label }}</a>
      <span v-else>{{ item.label }}</span>
      <span v-if="i < items.length - 1" class="w-breadcrumb__separator">{{ separator }}</span>
    </span>
  </nav>
</template>

<script setup lang="ts">
defineOptions({ name: 'WBreadcrumb' })
defineProps({
  items: { type: Array as () => { label: string; href?: string }[], default: () => [] },
  separator: { type: String, default: '>' }
})
</script>

<style scoped>
.w-breadcrumb { display: flex; align-items: center; flex-wrap: wrap; font-size: var(--w-font-size-base); color: var(--w-text-color-secondary); }
.w-breadcrumb__item a { color: var(--w-color-primary); text-decoration: none; }
.w-breadcrumb__item a:hover { text-decoration: underline; }
.w-breadcrumb__item.is-last { color: var(--w-text-color-primary); font-weight: bold; }
.w-breadcrumb__separator { margin: 0 6px; color: #c0c0c0; }
</style>
