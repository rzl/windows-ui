<template>
  <div class="w-timeline">
    <div v-for="(item, i) in items" :key="i" :class="['w-timeline__item', { 'is-last': i === items.length - 1 }]">
      <div class="w-timeline__node" :style="{ background: item.color || '#c0c0c0' }" />
      <div class="w-timeline__content">
        <div class="w-timeline__time">{{ item.time }}</div>
        <div class="w-timeline__title">{{ item.title }}</div>
        <div v-if="item.content" class="w-timeline__text">{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WTimeline' })
defineProps({ items: { type: Array as () => { time: string; title: string; content?: string; color?: string }[], default: () => [] } })
</script>

<style scoped>
.w-timeline { padding-left: 8px; }
.w-timeline__item { position: relative; padding-left: 20px; padding-bottom: 16px; }
.w-timeline__node { position: absolute; left: 0; top: 4px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 2px rgba(0,0,0,0.3); }
.w-timeline__item:not(.is-last)::before { content: ''; position: absolute; left: 4px; top: 14px; bottom: 0; width: 2px; background: #d4d0c8; }
.w-timeline__time { font-size: var(--w-font-size-small); color: var(--w-text-color-secondary); }
.w-timeline__title { font-size: var(--w-font-size-base); font-weight: bold; color: var(--w-text-color-primary); margin-top: 2px; }
.w-timeline__text { font-size: var(--w-font-size-base); color: var(--w-text-color-secondary); margin-top: 2px; }
</style>
