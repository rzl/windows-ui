<template>
  <div class="w-watermark" :style="watermarkStyle"><slot /></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'WWatermark' })
const props = defineProps({ content: { type: String, default: 'Watermark' }, fontSize: { type: Number, default: 14 }, color: { type: String, default: 'rgba(0,0,0,0.1)' }, rotate: { type: Number, default: -30 } })
const watermarkStyle = computed(() => {
  const canvas = document.createElement('canvas')
  canvas.width = 200; canvas.height = 200
  const ctx = canvas.getContext('2d')!
  ctx.font = `${props.fontSize}px sans-serif`
  ctx.fillStyle = props.color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.translate(100, 100)
  ctx.rotate((props.rotate * Math.PI) / 180)
  ctx.fillText(props.content, 0, 0)
  return { backgroundImage: `url(${canvas.toDataURL()})` }
})
</script>

<style scoped>
.w-watermark { position: relative; }
</style>
