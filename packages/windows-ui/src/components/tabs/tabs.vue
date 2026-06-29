<template>
  <div :class="['w-tabs', `w-tabs--${size}`]">
    <div class="w-tabs__header">
      <template v-if="props.tabs.length">
        <div
          v-for="(tab, i) in props.tabs"
          :key="i"
          :class="['w-tabs__item', { 'is-active': activeIndex === i }]"
          @click="selectIndex(i)"
        >
          <w-icon v-if="tab.icon" :name="tab.icon" :size="size" />
          {{ tab.label }}
        </div>
      </template>
      <template v-else>
        <div
          v-for="pane in panes"
          :key="pane.name"
          :class="['w-tabs__item', { 'is-active': activeName === pane.name, 'is-disabled': pane.disabled }]"
          @click="selectName(pane.name, pane.disabled)"
        >
          <w-icon v-if="pane.icon" :name="pane.icon" :size="size" />
          {{ pane.label }}
        </div>
      </template>
    </div>
    <div class="w-tabs__content">
      <template v-if="props.tabs.length">
        <slot :active="activeIndex" />
      </template>
      <slot v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WTabs' })
const props = defineProps({
  tabs: { type: Array as () => { label: string; icon?: string }[], default: () => [] },
  modelValue: { type: [String, Number], default: 0 },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'change'])

const activeIndex = computed(() => props.tabs.length ? Number(props.modelValue) : -1)
const activeName = computed(() => props.tabs.length ? undefined : props.modelValue)

const panes = ref<{ label?: string; name: string | number; icon?: string; disabled?: boolean }[]>([])
const register = (pane: { label?: string; name: string | number; icon?: string; disabled?: boolean }) => {
  if (!panes.value.some(p => p.name === pane.name)) panes.value.push(pane)
}
const unregister = (name: string | number) => {
  panes.value = panes.value.filter(p => p.name !== name)
}

provide('tabs', {
  activeName,
  size,
  register,
  unregister
})

const selectIndex = (i: number) => { emit('update:modelValue', i); emit('change', i) }
const selectName = (name: string | number, disabled?: boolean) => {
  if (disabled) return
  emit('update:modelValue', name)
  emit('change', name)
}

watch(() => props.tabs, () => { panes.value = [] }, { immediate: true })
</script>

<style scoped>
.w-tabs { border: 1px solid #919b9c; }
.w-tabs__header { display: flex; background: linear-gradient(180deg, #f8f8f8, #e0e0e0); border-bottom: 1px solid #919b9c; }
.w-tabs__item { padding: 6px 16px; cursor: pointer; font-size: var(--w-font-size-base); display: flex; align-items: center; gap: 4px; border-right: 1px solid #d4d0c8; }
.w-tabs__item:hover { background: #f0f0f0; }
.w-tabs__item.is-active { background: var(--w-bg-color); border-bottom: 1px solid var(--w-bg-color); position: relative; top: 1px; font-weight: bold; }
.w-tabs__item.is-disabled { opacity: 0.5; cursor: not-allowed; }
.w-tabs__content { background: var(--w-bg-color); }
.w-tabs--small .w-tabs__item { padding: 4px 12px; font-size: var(--w-font-size-small); }
.w-tabs--large .w-tabs__item { padding: 8px 20px; font-size: var(--w-font-size-medium); }
</style>
