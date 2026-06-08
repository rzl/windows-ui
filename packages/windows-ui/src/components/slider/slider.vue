<template>
  <div class="w-slider">
    <div ref="trackRef" class="w-slider__track" @click="handleTrackClick">
      <div v-if="rangeMin !== undefined" class="w-slider__range-mask" :style="{ left: '0', width: `${rangePercent.left}%` }" />
      <div v-if="rangeMax !== undefined" class="w-slider__range-mask" :style="{ left: `${rangePercent.left + rangePercent.width}%`, width: `${100 - rangePercent.left - rangePercent.width}%` }" />
      <div class="w-slider__bar" :style="{ width: `${percent}%` }" />
      <div
        class="w-slider__thumb"
        :class="{ 'is-dragging': dragging }"
        :style="{ left: `${percent}%` }"
        @mousedown="startDrag"
        @touchstart.passive="startTouchDrag"
      >
        <div class="w-slider__tooltip">
          <slot name="tooltip" :value="modelValue">{{ modelValue }}</slot>
        </div>
      </div>
    </div>
    <div v-if="showStops" class="w-slider__stops">
      <span v-for="(s, i) in stops" :key="i" class="w-slider__stop-item" :style="{ left: `${s.percent}%` }">
        <span class="w-slider__stop-dot" />
        <span class="w-slider__stop-value">{{ s.value }}</span>
      </span>
    </div>
    <div v-if="showMinMax" class="w-slider__limits">
      <span class="w-slider__min">
        <slot name="min" :value="min">{{ min }}</slot>
      </span>
      <span class="w-slider__max">
        <slot name="max" :value="max">{{ max }}</slot>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
defineOptions({ name: 'WSlider' })
const props = defineProps({ modelValue: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 }, step: { type: Number, default: 1 }, rangeMin: { type: Number, default: undefined }, rangeMax: { type: Number, default: undefined }, showStops: Boolean, showMinMax: Boolean, disabled: Boolean })
const emit = defineEmits(['update:modelValue', 'change'])
const trackRef = ref<HTMLDivElement>()
const dragging = ref(false)
const percent = computed(() => ((props.modelValue - props.min) / (props.max - props.min)) * 100)
const rangePercent = computed(() => {
  const rMin = props.rangeMin !== undefined ? props.rangeMin : props.min
  const rMax = props.rangeMax !== undefined ? props.rangeMax : props.max
  return {
    left: ((rMin - props.min) / (props.max - props.min)) * 100,
    width: ((rMax - rMin) / (props.max - props.min)) * 100
  }
})
const stops = computed(() => { const count = (props.max - props.min) / props.step; const arr: { percent: number; value: number }[] = []; for (let i = 1; i < count; i++) arr.push({ percent: (i / count) * 100, value: props.min + i * props.step }); return arr })
const updateValue = (clientX: number) => { if (!trackRef.value || props.disabled) return; const rect = trackRef.value.getBoundingClientRect(); let p = (clientX - rect.left) / rect.width; p = Math.max(0, Math.min(1, p)); let val = props.min + p * (props.max - props.min); val = props.min + Math.round((val - props.min) / props.step) * props.step; const rMin = props.rangeMin !== undefined ? props.rangeMin : props.min; const rMax = props.rangeMax !== undefined ? props.rangeMax : props.max; val = Math.max(rMin, Math.min(rMax, val)); emit('update:modelValue', val); emit('change', val) }
const startDrag = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); dragging.value = true; const move = (ev: MouseEvent) => updateValue(ev.clientX); const up = () => { dragging.value = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }; window.addEventListener('mousemove', move); window.addEventListener('mouseup', up) }
const startTouchDrag = (e: TouchEvent) => { dragging.value = true; const touch = e.touches[0]; const move = (ev: TouchEvent) => { const t = ev.touches[0]; if (t) updateValue(t.clientX) }; const up = () => { dragging.value = false; window.removeEventListener('touchmove', move); window.removeEventListener('touchend', up); window.removeEventListener('touchcancel', up) }; window.addEventListener('touchmove', move); window.addEventListener('touchend', up); window.addEventListener('touchcancel', up) }
const handleTrackClick = (e: MouseEvent) => updateValue(e.clientX)
</script>

<style scoped>
.w-slider { padding: 8px 0; }
.w-slider__track { position: relative; height: 4px; background: #c0c0c0; border: 1px solid #808080; cursor: pointer; }
.w-slider__range-mask { position: absolute; top: 0; height: 100%; background: #a0a0a0; }
.w-slider__bar { height: 100%; background: linear-gradient(180deg, var(--w-xp-blue-light), var(--w-color-primary)); }
.w-slider__thumb { position: absolute; top: 50%; width: 12px; height: 20px; background: linear-gradient(180deg, #fff, #ecebe5, #d6d0c5); border: 1px solid #808080; border-radius: 2px; transform: translate(-50%, -50%); cursor: grab; box-shadow: inset 1px 1px 0 #fff; }
.w-slider__thumb:active { cursor: grabbing; }
.w-slider__tooltip { position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); padding: 2px 6px; background: #ffffe1; border: 1px solid #000; border-radius: 2px; font-size: 11px; color: #000; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .15s ease; box-shadow: 1px 1px 2px rgba(0,0,0,.2); }
.w-slider__tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border-width: 4px; border-style: solid; border-color: #000 transparent transparent transparent; }
.w-slider__thumb:hover .w-slider__tooltip, .w-slider__thumb.is-dragging .w-slider__tooltip { opacity: 1; }
.w-slider__stops { position: relative; pointer-events: none; }
.w-slider__stop-item { position: absolute; top: 0; display: flex; flex-direction: column; align-items: center; transform: translateX(-50%); }
.w-slider__stop-dot { width: 4px; height: 4px; background: #fff; border-radius: 50%; }
.w-slider__stop-value { margin-top: 2px; font-size: 10px; color: #666; white-space: nowrap; }
.w-slider__limits { display: flex; justify-content: space-between; margin-top: 4px; font-size: 11px; color: #666; }
</style>
