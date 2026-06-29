<template>
  <div :class="['w-collapse', `w-collapse--${size}`]">
    <template v-if="items.length">
      <div v-for="(item, i) in items" :key="i" :class="['w-collapse__item', { 'is-active': isActive(i) }]">
      <div class="w-collapse__header" @click="toggle(i)">
        <div class="w-collapse__header-content">
          <slot name="header" :item="item" :index="i">
            <w-icon :name="isActive(i) ? 'arrowDown' : 'arrowRight'" :size="size" />
            <span>{{ item.title }}</span>
          </slot>
        </div>
        <div class="w-collapse__actions" @click.stop>
          <slot name="action" :item="item" :index="i" />
        </div>
      </div>
      <div v-show="isActive(i)" class="w-collapse__content">
        <slot :item="item" :index="i">{{ item.content }}</slot>
      </div>
      </div>
    </template>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'
defineOptions({ name: 'WCollapse' })
const props = defineProps({ items: { type: Array as () => { title: string; content?: string }[], default: () => [] }, modelValue: { type: Array as () => (number | string)[], default: () => [] }, accordion: Boolean, size: { type: String, default: undefined } })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'change'])
const activeSet = ref(new Set<number | string>(props.modelValue))
const isActive = (name: number | string) => activeSet.value.has(name)
const toggle = (name: number | string) => {
  if (props.accordion) { if (activeSet.value.has(name)) activeSet.value.clear(); else { activeSet.value.clear(); activeSet.value.add(name) } }
  else { if (activeSet.value.has(name)) activeSet.value.delete(name); else activeSet.value.add(name) }
  const arr = Array.from(activeSet.value)
  emit('update:modelValue', arr)
  emit('change', arr)
}

provide('collapse', {
  isActive,
  toggle,
  size,
  accordion: computed(() => props.accordion)
})
</script>

<style scoped>
.w-collapse { border: 1px solid #919b9c; }
.w-collapse__item { border-bottom: 1px solid #d4d0c8; }
.w-collapse__item:last-child { border-bottom: none; }
.w-collapse__header { display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: linear-gradient(180deg, #f8f8f8, #e0e0e0); cursor: pointer; font-size: var(--w-font-size-base); font-weight: bold; }
.w-collapse__header-content { display: flex; align-items: center; gap: 6px; flex: 1; }
.w-collapse__actions { display: flex; align-items: center; gap: 8px; }
.w-collapse__header:hover { background: linear-gradient(180deg, #fff, #f0f0f0); }
.w-collapse__content { padding: 8px; background: #fff; font-size: var(--w-font-size-base); }
.w-collapse--small .w-collapse__header { padding: 4px 6px; font-size: var(--w-font-size-small); }
.w-collapse--small .w-collapse__content { padding: 6px; font-size: var(--w-font-size-small); }
.w-collapse--large .w-collapse__header { padding: 8px 10px; font-size: var(--w-font-size-medium); }
.w-collapse--large .w-collapse__content { padding: 12px; font-size: var(--w-font-size-medium); }
</style>
