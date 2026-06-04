<template>
  <div class="w-tabs">
    <div class="w-tabs__header">
      <div v-for="(tab, i) in tabs" :key="i" :class="['w-tabs__item', { 'is-active': activeIndex === i }]" @click="activeIndex = i; emit('change', i)">
        <w-icon v-if="tab.icon" :name="tab.icon" size="small" />
        {{ tab.label }}
      </div>
    </div>
    <div class="w-tabs__content"><slot :active="activeIndex" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WIcon from '../icon/icon.vue'
defineOptions({ name: 'WTabs' })
const props = defineProps({ tabs: { type: Array as () => { label: string; icon?: string }[], default: () => [] }, modelValue: { type: Number, default: 0 } })
const emit = defineEmits(['update:modelValue', 'change'])
const activeIndex = ref(props.modelValue)
</script>

<style scoped>
.w-tabs { border: 1px solid #919b9c; }
.w-tabs__header { display: flex; background: linear-gradient(180deg, #f8f8f8, #e0e0e0); border-bottom: 1px solid #919b9c; }
.w-tabs__item { padding: 6px 16px; cursor: pointer; font-size: var(--w-font-size-base); display: flex; align-items: center; gap: 4px; border-right: 1px solid #d4d0c8; }
.w-tabs__item:hover { background: #f0f0f0; }
.w-tabs__item.is-active { background: var(--w-bg-color); border-bottom: 1px solid var(--w-bg-color); position: relative; top: 1px; font-weight: bold; }
.w-tabs__content { padding: 12px; background: var(--w-bg-color); }
</style>
