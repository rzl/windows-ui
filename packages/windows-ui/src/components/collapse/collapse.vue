<template>
  <div class="w-collapse">
    <div v-for="(item, i) in items" :key="i" :class="['w-collapse__item', { 'is-active': isActive(i) }]">
      <div class="w-collapse__header" @click="toggle(i)">
        <w-icon :name="isActive(i) ? 'arrowDown' : 'arrowRight'" size="small" />
        <span>{{ item.title }}</span>
      </div>
      <div v-show="isActive(i)" class="w-collapse__content">
        <slot :item="item" :index="i">{{ item.content }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WIcon from '../icon/icon.vue'
defineOptions({ name: 'WCollapse' })
const props = defineProps({ items: { type: Array as () => { title: string; content?: string }[], default: () => [] }, modelValue: { type: Array as () => number[], default: () => [] }, accordion: Boolean })
const emit = defineEmits(['update:modelValue', 'change'])
const activeSet = ref(new Set(props.modelValue))
const isActive = (i: number) => activeSet.value.has(i)
const toggle = (i: number) => {
  if (props.accordion) { if (activeSet.value.has(i)) activeSet.value.clear(); else { activeSet.value.clear(); activeSet.value.add(i) } }
  else { if (activeSet.value.has(i)) activeSet.value.delete(i); else activeSet.value.add(i) }
  const arr = Array.from(activeSet.value)
  emit('update:modelValue', arr)
  emit('change', arr)
}
</script>

<style scoped>
.w-collapse { border: 1px solid #919b9c; }
.w-collapse__item { border-bottom: 1px solid #d4d0c8; }
.w-collapse__item:last-child { border-bottom: none; }
.w-collapse__header { display: flex; align-items: center; gap: 6px; padding: 6px 8px; background: linear-gradient(180deg, #f8f8f8, #e0e0e0); cursor: pointer; font-size: var(--w-font-size-base); font-weight: bold; }
.w-collapse__header:hover { background: linear-gradient(180deg, #fff, #f0f0f0); }
.w-collapse__content { padding: 8px; background: #fff; font-size: var(--w-font-size-base); }
</style>
