<template>
  <div class="w-color-picker-panel">
    <div class="w-color-picker-panel__palette" @mousedown="startPick">
      <div class="w-color-picker-panel__white" />
      <div class="w-color-picker-panel__black" />
      <div class="w-color-picker-panel__cursor" :style="cursorStyle" />
    </div>
    <div class="w-color-picker-panel__hue" @mousedown="startHue">
      <div class="w-color-picker-panel__hue-bar" :style="{ background: hueGradient }" />
      <div class="w-color-picker-panel__hue-cursor" :style="hueCursorStyle" />
    </div>
    <div class="w-color-picker-panel__preview">
      <div class="w-color-picker-panel__color" :style="{ backgroundColor: color }" />
      <input :value="color" readonly />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({ name: 'WColorPickerPanel' })
const emit = defineEmits(['change'])

const hue = ref(0)
const saturation = ref(100)
const value = ref(100)

const hueGradient = 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'

const color = computed(() => hsvToRgb(hue.value, saturation.value, value.value))

const cursorStyle = computed(() => ({
  left: `${saturation.value}%`,
  top: `${100 - value.value}%`
}))
const hueCursorStyle = computed(() => ({ left: `${(hue.value / 360) * 100}%` }))

const hsvToRgb = (h: number, s: number, v: number) => {
  s /= 100; v /= 100
  const c = v * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = v - c
  let r = 0, g = 0, b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const startPick = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const update = (ev: MouseEvent) => {
    saturation.value = Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100))
    value.value = Math.max(0, Math.min(100, (1 - (ev.clientY - rect.top) / rect.height) * 100))
    emit('change', color.value)
  }
  update(e)
  const up = () => { window.removeEventListener('mousemove', update); window.removeEventListener('mouseup', up) }
  window.addEventListener('mousemove', update)
  window.addEventListener('mouseup', up)
}

const startHue = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const update = (ev: MouseEvent) => {
    hue.value = Math.max(0, Math.min(360, ((ev.clientX - rect.left) / rect.width) * 360))
    emit('change', color.value)
  }
  update(e)
  const up = () => { window.removeEventListener('mousemove', update); window.removeEventListener('mouseup', up) }
  window.addEventListener('mousemove', update)
  window.addEventListener('mouseup', up)
}
</script>

<style scoped>
.w-color-picker-panel { width: 220px; padding: 8px; background: var(--w-bg-color); border: 1px solid #808080; }
.w-color-picker-panel__palette { position: relative; width: 100%; height: 140px; background: #f00; margin-bottom: 8px; cursor: crosshair; }
.w-color-picker-panel__white { position: absolute; inset: 0; background: linear-gradient(to right, #fff, transparent); }
.w-color-picker-panel__black { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, #000); }
.w-color-picker-panel__cursor { position: absolute; width: 10px; height: 10px; border: 1px solid #fff; box-shadow: 0 0 2px rgba(0,0,0,0.5); transform: translate(-50%, -50%); pointer-events: none; }
.w-color-picker-panel__hue { position: relative; height: 12px; margin-bottom: 8px; cursor: pointer; }
.w-color-picker-panel__hue-bar { height: 100%; }
.w-color-picker-panel__hue-cursor { position: absolute; top: -2px; width: 4px; height: 16px; background: #fff; border: 1px solid #000; transform: translateX(-50%); pointer-events: none; }
.w-color-picker-panel__preview { display: flex; align-items: center; gap: 8px; }
.w-color-picker-panel__color { width: 32px; height: 20px; border: 1px solid #808080; }
.w-color-picker-panel__preview input { flex: 1; border: 1px solid #7f9db9; padding: 2px 4px; font-family: var(--w-font-family); font-size: var(--w-font-size-small); }
</style>
