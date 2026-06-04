<template>
  <div class="w-slider">
    <div ref="trackRef" class="w-slider__track" @click="handleTrackClick">
      <div class="w-slider__bar" :style="{ width: `${percent}%` }" />
      <div class="w-slider__thumb" :style="{ left: `${percent}%` }" @mousedown="startDrag" />
    </div>
    <div v-if="showStops" class="w-slider__stops">
      <span v-for="(s, i) in stops" :key="i" class="w-slider__stop" :style="{ left: `${s}%` }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
defineOptions({ name: 'WSlider' })
const props = defineProps({ modelValue: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 }, step: { type: Number, default: 1 }, showStops: Boolean, disabled: Boolean })
const emit = defineEmits(['update:modelValue', 'change'])
const trackRef = ref<HTMLDivElement>()
const percent = computed(() => ((props.modelValue - props.min) / (props.max - props.min)) * 100)
const stops = computed(() => { const count = (props.max - props.min) / props.step; const arr: number[] = []; for (let i = 1; i < count; i++) arr.push((i / count) * 100); return arr })
const updateValue = (clientX: number) => { if (!trackRef.value || props.disabled) return; const rect = trackRef.value.getBoundingClientRect(); let p = (clientX - rect.left) / rect.width; p = Math.max(0, Math.min(1, p)); let val = props.min + p * (props.max - props.min); val = Math.round(val / props.step) * props.step; emit('update:modelValue', val); emit('change', val) }
const startDrag = (e: MouseEvent) => { e.stopPropagation(); const move = (ev: MouseEvent) => updateValue(ev.clientX); const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }; window.addEventListener('mousemove', move); window.addEventListener('mouseup', up) }
const handleTrackClick = (e: MouseEvent) => updateValue(e.clientX)
</script>

<style scoped>
.w-slider { padding: 8px 0; }
.w-slider__track { position: relative; height: 4px; background: #c0c0c0; border: 1px solid #808080; cursor: pointer; }
.w-slider__bar { height: 100%; background: linear-gradient(180deg, var(--w-xp-blue-light), var(--w-color-primary)); }
.w-slider__thumb { position: absolute; top: 50%; width: 12px; height: 20px; background: linear-gradient(180deg, #fff, #ecebe5, #d6d0c5); border: 1px solid #808080; border-radius: 2px; transform: translate(-50%, -50%); cursor: grab; box-shadow: inset 1px 1px 0 #fff; }
.w-slider__thumb:active { cursor: grabbing; }
.w-slider__stops { position: relative; height: 4px; }
.w-slider__stop { position: absolute; top: 0; width: 4px; height: 4px; background: #fff; border-radius: 50%; }
</style>
