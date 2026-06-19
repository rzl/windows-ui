<template>
  <div class="page-runner-page">
    <page-renderer :code="code" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageRenderer from '@/components/page-designer/PageRenderer.vue'

const route = useRoute()
const code = computed(() => route.params.code as string)
</script>

<style scoped>
.page-runner-page { padding: 8px; }
</style>
