<template>
  <div class="w-watermark" :style="watermarkStyle"><slot /></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'WWatermark' })
const props = defineProps({
  content: { type: String, default: 'Watermark' },
  fontSize: { type: Number, default: 14 },
  color: { type: String, default: 'rgba(0,0,0,0.1)' },
  font: { type: Object as () => { size?: number; color?: string; family?: string }, default: () => ({}) },
  rotate: { type: Number, default: -30 },
  gap: { type: Array as () => [number, number], default: () => [100, 100] },
  zIndex: { type: Number, default: 1000 }
})

const watermarkStyle = computed(() => {
  const canvas = document.createElement('canvas')
  const gapX = props.gap[0]
  const gapY = props.gap[1]
  canvas.width = gapX
  canvas.height = gapY
  const ctx = canvas.getContext('2d')!
  const fontSize = props.font.size || props.fontSize
  ctx.font = `${fontSize}px ${props.font.family || 'sans-serif'}`
  ctx.fillStyle = props.font.color || props.color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.translate(gapX / 2, gapY / 2)
  ctx.rotate((props.rotate * Math.PI) / 180)
  ctx.fillText(props.content, 0, 0)
  return {
    backgroundImage: `url(${canvas.toDataURL()})`,
    zIndex: props.zIndex
  }
})
</script>

<style scoped>
.w-watermark { position: relative; }
</style>
