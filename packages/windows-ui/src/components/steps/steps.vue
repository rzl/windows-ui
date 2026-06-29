<template>
  <div :class="['w-steps', `w-steps--${size}`]">
    <template v-if="items.length">
      <div v-for="(step, i) in items" :key="i" :class="['w-steps__item', { 'is-finish': i < active, 'is-active': i === active, 'is-wait': i > active }]">
      <div class="w-steps__icon">{{ i < active ? '✓' : i + 1 }}</div>
      <div class="w-steps__content">
        <div class="w-steps__title">{{ step.title }}</div>
        <div v-if="step.description" class="w-steps__desc">{{ step.description }}</div>
      </div>
      <div v-if="i < items.length - 1" class="w-steps__line" />
      </div>
    </template>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useGlobalSize } from '../../utils/prefix'
defineOptions({ name: 'WSteps' })
const props = defineProps({ items: { type: Array as () => { title: string; description?: string }[], default: () => [] }, active: { type: Number, default: 0 }, size: { type: String, default: undefined } })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
provide('steps', { active: computed(() => props.active), size })
</script>

<style scoped>
.w-steps { display: flex; }
.w-steps__item { flex: 1; display: flex; align-items: center; position: relative; }
.w-steps__icon { width: 24px; height: 24px; border-radius: 50%; background: #c0c0c0; color: #fff; display: flex; align-items: center; justify-content: center; font-size: var(--w-font-size-small); font-weight: bold; flex-shrink: 0; }
.w-steps__item.is-finish .w-steps__icon { background: var(--w-color-success); }
.w-steps__item.is-active .w-steps__icon { background: var(--w-color-primary); }
.w-steps__content { margin-left: 8px; }
.w-steps__title { font-size: var(--w-font-size-base); font-weight: bold; color: var(--w-text-color-primary); }
.w-steps__desc { font-size: var(--w-font-size-small); color: var(--w-text-color-secondary); }
.w-steps__line { flex: 1; height: 2px; background: #c0c0c0; margin: 0 8px; }
.w-steps__item.is-finish + .w-steps__item .w-steps__line { background: var(--w-color-success); }
.w-steps--small .w-steps__icon { width: 20px; height: 20px; font-size: var(--w-font-size-extra-small); }
.w-steps--small .w-steps__title { font-size: var(--w-font-size-small); }
.w-steps--small .w-steps__desc { font-size: var(--w-font-size-extra-small); }
.w-steps--large .w-steps__icon { width: 28px; height: 28px; font-size: var(--w-font-size-base); }
.w-steps--large .w-steps__title { font-size: var(--w-font-size-medium); }
.w-steps--large .w-steps__desc { font-size: var(--w-font-size-base); }
</style>
