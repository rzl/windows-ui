<template>
  <div class="w-page-container">
    <div class="w-page-container__header">
      <div class="w-page-container__title">
        <h2>{{ title }}</h2>
        <w-breadcrumb v-if="breadcrumb.length" :items="breadcrumb" />
      </div>
      <div v-if="tabs.length" class="w-page-container__tabs">
        <div
          v-for="tab in tabs"
          :key="tab.name"
          :class="['w-page-container__tab', { 'is-active': activeName === tab.name }]"
          @click="selectTab(tab.name)"
        >{{ tab.label }}</div>
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
import { computed } from 'vue'
import WBreadcrumb from '../breadcrumb/breadcrumb.vue'

defineOptions({ name: 'WPageContainer' })
const props = defineProps({
  title: { type: String, default: '' },
  breadcrumb: { type: Array as () => { label: string; path?: string }[], default: () => [] },
  tabs: { type: Array as () => { label: string; name: string }[], default: () => [] },
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'tab-change'])

const activeName = computed(() => props.modelValue || (props.tabs[0]?.name))
const selectTab = (name: string) => {
  emit('update:modelValue', name)
  emit('tab-change', name)
}
</script>

<style scoped>
.w-page-container { padding: 8px; }
.w-page-container__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.w-page-container__title h2 { margin: 0 0 4px; font-size: 18px; color: var(--w-color-primary); }
.w-page-container__extra { display: flex; gap: 8px; }
.w-page-container__body { background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; padding: 12px; }
.w-page-container__tabs { display: flex; gap: 4px; }
.w-page-container__tab { padding: 4px 12px; cursor: pointer; border: 1px solid #d4d0c8; background: #f0f0f0; font-size: var(--w-font-size-base); }
.w-page-container__tab.is-active { background: var(--w-color-primary); color: #fff; border-color: var(--w-color-primary); }

@media (max-width: 768px) {
  .w-page-container__header { flex-direction: column; align-items: flex-start; }
  .w-page-container__extra { width: 100%; justify-content: flex-start; flex-wrap: wrap; }
  .w-page-container__tabs { width: 100%; overflow-x: auto; }
}
</style>
