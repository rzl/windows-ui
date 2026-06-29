<template>
  <div ref="itemRef" :class="['w-timeline__item', { 'is-last': isLast, [`w-timeline__item--${placement}`]: true }]">
    <div class="w-timeline__node" :style="{ background: color || '#c0c0c0' }" />
    <div class="w-timeline__content">
      <div class="w-timeline__time"><slot name="timestamp">{{ timestamp }}</slot></div>
      <div class="w-timeline__title"><slot name="title">{{ title }}</slot></div>
      <div v-if="$slots.default" class="w-timeline__text">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'

defineOptions({ name: 'WTimelineItem' })
defineProps({
  timestamp: String,
  title: String,
  placement: { type: String, default: 'top' },
  color: String
})
const itemRef = ref<HTMLElement>()
const isLast = ref(false)
const updateLast = () => {
  const el = itemRef.value
  if (!el?.parentElement) return
  isLast.value = el === el.parentElement.lastElementChild
}
onMounted(updateLast)
onUpdated(updateLast)
</script>
