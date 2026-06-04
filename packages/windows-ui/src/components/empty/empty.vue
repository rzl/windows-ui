<template>
  <div class="w-empty">
    <w-icon name="folder" size="large" />
    <p class="w-empty__description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import WIcon from '../icon/icon.vue'
defineOptions({ name: 'WEmpty' })
defineProps({ description: { type: String, default: '暂无数据' } })
</script>

<style scoped>
.w-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; color: var(--w-text-color-secondary); }
.w-empty__description { margin-top: 8px; font-size: var(--w-font-size-base); }
</style>
