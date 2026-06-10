<template>
  <div class="breadcrumb-bar">
    <w-breadcrumb :items="items" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const items = computed(() => {
  const matched = route.matched
  const result: { label: string; path?: string }[] = [{ label: '首页', path: '/' }]
  matched.forEach((m) => {
    if (m.meta?.title) {
      result.push({ label: m.meta.title as string, path: m.path !== '/' ? m.path : undefined })
    }
  })
  return result
})
</script>

<style scoped>
.breadcrumb-bar { margin-bottom: 12px; }
</style>
