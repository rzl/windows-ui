<template>
  <div :class="['w-steps__item', { 'is-finish': isFinish, 'is-active': isActive, 'is-wait': isWait }]">
    <div class="w-steps__icon">{{ isFinish ? '✓' : index + 1 }}</div>
    <div class="w-steps__content">
      <div class="w-steps__title"><slot name="title">{{ title }}</slot></div>
      <div v-if="description || $slots.description" class="w-steps__desc">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
    <div v-if="!isLast" class="w-steps__line" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, getCurrentInstance, onMounted, onUpdated } from 'vue'

defineOptions({ name: 'WStep' })
defineProps({
  title: String,
  description: String
})
const steps = inject<any>('steps', null)
const index = ref(0)
const active = computed(() => steps?.active?.value || 0)
const isFinish = computed(() => index.value < active.value)
const isActive = computed(() => index.value === active.value)
const isWait = computed(() => index.value > active.value)
const isLast = ref(false)

const updateIndex = () => {
  const el = (getCurrentInstance()?.proxy?.$el as HTMLElement)
  if (!el?.parentElement) return
  const siblings = Array.from(el.parentElement.children)
  index.value = siblings.indexOf(el)
  isLast.value = el === el.parentElement.lastElementChild
}

onMounted(updateIndex)
onUpdated(updateIndex)
</script>
