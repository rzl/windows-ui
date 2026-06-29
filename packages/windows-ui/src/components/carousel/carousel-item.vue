<template>
  <div :class="['w-carousel__item', { 'is-active': isActive }]" :style="itemStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, getCurrentInstance, onMounted, onUpdated } from 'vue'

defineOptions({ name: 'WCarouselItem' })
const carousel = inject<any>('carousel', null)
const index = ref(0)
const activeIndex = computed(() => carousel?.activeIndex?.value || 0)
const isActive = computed(() => index.value === activeIndex.value)
const itemStyle = computed(() => carousel ? carousel.itemStyle(index.value) : {})

const updateIndex = () => {
  const el = (getCurrentInstance()?.proxy?.$el as HTMLElement)
  if (!el?.parentElement) return
  const siblings = Array.from(el.parentElement.querySelectorAll('.w-carousel__item'))
  index.value = siblings.indexOf(el)
}

onMounted(updateIndex)
onUpdated(updateIndex)
</script>

<style scoped>
.w-carousel__item { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.5s; display: flex; align-items: center; justify-content: center; color: #fff; }
.w-carousel__item.is-active { opacity: 1; }
</style>
