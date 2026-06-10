<template>
  <div class="w-page-container">
    <div class="w-page-container__header">
      <div class="w-page-container__title">
        <h2>{{ title }}</h2>
        <w-breadcrumb v-if="breadcrumb.length" :items="breadcrumb" />
      </div>
      <div class="w-page-container__extra">
        <slot name="extra" />
      </div>
    </div>
    <div class="w-page-container__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import WBreadcrumb from '../breadcrumb/breadcrumb.vue'

defineOptions({ name: 'WPageContainer' })
defineProps({
  title: { type: String, default: '' },
  breadcrumb: { type: Array as () => { label: string; path?: string }[], default: () => [] }
})
</script>

<style scoped>
.w-page-container { padding: 8px; }
.w-page-container__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.w-page-container__title h2 { margin: 0 0 4px; font-size: 18px; color: var(--w-color-primary); }
.w-page-container__extra { display: flex; gap: 8px; }
.w-page-container__body { background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; padding: 12px; }
</style>
