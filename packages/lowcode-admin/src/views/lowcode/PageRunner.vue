<template>
  <div class="page-runner-page">
    <w-card :header="pageTitle">
      <page-renderer :code="code" />
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageRenderer from '@/components/page-designer/PageRenderer.vue'

const route = useRoute()
const code = computed(() => route.params.code as string)
const pageTitle = computed(() => route.query.title as string || code.value || '自定义页面')
</script>

<style scoped>
.page-runner-page { padding: 8px; }
</style>
