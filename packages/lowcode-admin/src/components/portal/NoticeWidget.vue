<template>
  <p class="notice-content">{{ content }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  widget: any
}>()

const content = computed(() => props.widget.content || '暂无公告')
</script>

<style scoped>
.notice-content { padding: 8px; color: #666; margin: 0; }
</style>
