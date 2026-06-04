<template>
  <div class="demo-section">
    <div class="demo-section__header">
      <h2 class="demo-section__title">{{ title }}</h2>
      <p v-if="description" class="demo-section__desc">{{ description }}</p>
    </div>
    <div class="demo-section__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  description: String
})
</script>

<style scoped>
.demo-section { margin-bottom: 24px; background: #fff; border: 2px solid; border-color: #fff #808080 #808080 #fff; }
.demo-section__header { padding: 12px 16px; background: linear-gradient(180deg, #f8f8f8, #e0e0e0); border-bottom: 1px solid #d4d0c8; }
.demo-section__title { font-size: 18px; color: #245edb; margin: 0; }
.demo-section__desc { font-size: 12px; color: #666; margin: 4px 0 0; }
.demo-section__body { padding: 16px; }
</style>
