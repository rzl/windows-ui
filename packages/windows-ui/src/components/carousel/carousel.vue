<template>
  <div class="w-carousel" @mouseenter="pause" @mouseleave="resume">
    <div class="w-carousel__container" :style="containerStyle">
      <div v-for="(item, i) in items" :key="i" class="w-carousel__item" :style="itemStyle(i)">
        <slot :item="item" :index="i" />
      </div>
    </div>
    <div v-if="showIndicators" class="w-carousel__indicators">
      <span v-for="(_, i) in items" :key="i" :class="['w-carousel__indicator', { 'is-active': i === activeIndex }]" @click="goTo(i)" />
    </div>
    <div v-if="showArrows" class="w-carousel__arrows">
      <span class="w-carousel__arrow" @click="prev">&lt;</span>
      <span class="w-carousel__arrow" @click="next">&gt;</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
defineOptions({ name: 'WCarousel' })
const props = defineProps({ items: { type: Array as () => any[], default: () => [] }, autoplay: { type: Boolean, default: true }, interval: { type: Number, default: 3000 }, showIndicators: { type: Boolean, default: true }, showArrows: { type: Boolean, default: true } })
const activeIndex = ref(0)
let timer: any = null
const containerStyle = computed(() => ({ height: '100%', position: 'relative' as const, overflow: 'hidden' }))
const itemStyle = (i: number) => ({ position: 'absolute' as const, top: 0, left: 0, width: '100%', height: '100%', opacity: i === activeIndex.value ? 1 : 0, transition: 'opacity 0.5s' })
const next = () => { activeIndex.value = (activeIndex.value + 1) % props.items.length }
const prev = () => { activeIndex.value = (activeIndex.value - 1 + props.items.length) % props.items.length }
const goTo = (i: number) => { activeIndex.value = i }
const pause = () => { if (timer) clearInterval(timer) }
const resume = () => { if (props.autoplay) timer = setInterval(next, props.interval) }
onMounted(() => { if (props.autoplay) timer = setInterval(next, props.interval) })
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.w-carousel { position: relative; width: 100%; height: 200px; overflow: hidden; border: 2px solid; border-color: #fff #808080 #808080 #fff; background: #000; }
.w-carousel__container { width: 100%; height: 100%; }
.w-carousel__item { display: flex; align-items: center; justify-content: center; color: #fff; }
.w-carousel__indicators { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
.w-carousel__indicator { width: 8px; height: 8px; background: rgba(255,255,255,0.5); border-radius: 50%; cursor: pointer; }
.w-carousel__indicator.is-active { background: #fff; }
.w-carousel__arrows { position: absolute; top: 50%; left: 0; right: 0; display: flex; justify-content: space-between; padding: 0 8px; transform: translateY(-50%); }
.w-carousel__arrow { width: 24px; height: 24px; background: rgba(0,0,0,0.4); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; border-radius: 50%; }
.w-carousel__arrow:hover { background: rgba(0,0,0,0.6); }
</style>
