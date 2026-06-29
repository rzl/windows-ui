<template>
  <div :class="['w-timeline', `w-timeline--${size}`]">
    <template v-if="items.length">
      <div v-for="(item, i) in items" :key="i" :class="['w-timeline__item', { 'is-last': i === items.length - 1 }]">
      <div class="w-timeline__node" :style="{ background: item.color || '#c0c0c0' }" />
      <div class="w-timeline__content">
        <div class="w-timeline__time">{{ item.time }}</div>
        <div class="w-timeline__title">{{ item.title }}</div>
        <div v-if="item.content" class="w-timeline__text">{{ item.content }}</div>
      </div>
      </div>
    </template>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalSize } from '../../utils/prefix'
defineOptions({ name: 'WTimeline' })
const props = defineProps({ items: { type: Array as () => { time: string; title: string; content?: string; color?: string }[], default: () => [] }, size: { type: String, default: undefined } })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
</script>

<style scoped>
.w-timeline { padding-left: 8px; }
.w-timeline__item { position: relative; padding-left: 20px; padding-bottom: 16px; }
.w-timeline__node { position: absolute; left: 0; top: 4px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 2px rgba(0,0,0,0.3); }
.w-timeline__item:not(.is-last)::before { content: ''; position: absolute; left: 4px; top: 14px; bottom: 0; width: 2px; background: #d4d0c8; }
.w-timeline__time { font-size: var(--w-font-size-small); color: var(--w-text-color-secondary); }
.w-timeline__title { font-size: var(--w-font-size-base); font-weight: bold; color: var(--w-text-color-primary); margin-top: 2px; }
.w-timeline__text { font-size: var(--w-font-size-base); color: var(--w-text-color-secondary); margin-top: 2px; }
.w-timeline--small .w-timeline__node { width: 8px; height: 8px; top: 3px; }
.w-timeline--small .w-timeline__item { padding-left: 18px; }
.w-timeline--small .w-timeline__item:not(.is-last)::before { left: 3px; top: 12px; }
.w-timeline--small .w-timeline__time { font-size: var(--w-font-size-extra-small); }
.w-timeline--small .w-timeline__title { font-size: var(--w-font-size-small); }
.w-timeline--small .w-timeline__text { font-size: var(--w-font-size-small); }
.w-timeline--large .w-timeline__node { width: 12px; height: 12px; top: 5px; }
.w-timeline--large .w-timeline__item { padding-left: 22px; }
.w-timeline--large .w-timeline__item:not(.is-last)::before { left: 5px; top: 16px; }
.w-timeline--large .w-timeline__time { font-size: var(--w-font-size-base); }
.w-timeline--large .w-timeline__title { font-size: var(--w-font-size-medium); }
.w-timeline--large .w-timeline__text { font-size: var(--w-font-size-base); }
</style>
