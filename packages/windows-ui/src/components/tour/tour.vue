<template>
  <div v-if="visible" class="w-tour">
    <div class="w-tour__mask" @click="close" />
    <div class="w-tour__highlight" :style="highlightStyle" />
    <div class="w-tour__content" :style="contentStyle">
      <div class="w-tour__header">
        <slot name="header" :step="steps[current]" :index="current">
          <span class="w-tour__title">{{ steps[current].title }}</span>
        </slot>
        <div class="w-tour__actions">
          <slot name="action" :step="steps[current]" :index="current" />
          <w-icon name="close" class="w-tour__close" @click="close" />
        </div>
      </div>
      <div class="w-tour__body">{{ steps[current].description }}</div>
      <div class="w-tour__footer">
        <w-button v-if="current > 0" size="small" @click="prev">上一步</w-button>
        <w-button size="small" @click="next">{{ current < steps.length - 1 ? '下一步' : '完成' }}</w-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUpdated } from 'vue'
import WIcon from '../icon/icon.vue'
import WButton from '../button/button.vue'

defineOptions({ name: 'WTour' })
const props = defineProps({
  visible: Boolean,
  steps: { type: Array as () => { title: string; description: string; target?: string | (() => Element | null) }[], default: () => [] }
})
const emit = defineEmits(['update:visible', 'finish'])

const current = ref(0)
const targetRect = ref<DOMRect | null>(null)

const currentStep = computed(() => props.steps[current.value])

const resolveTarget = (target?: string | (() => Element | null)) => {
  if (!target) return null
  if (typeof target === 'string') return document.querySelector(target)
  return target()
}

const updateTargetRect = () => {
  const el = resolveTarget(currentStep.value?.target)
  targetRect.value = el ? el.getBoundingClientRect() : null
}

onMounted(updateTargetRect)
onUpdated(updateTargetRect)
watchEffect(updateTargetRect)

const highlightStyle = computed(() => {
  if (!targetRect.value) return { display: 'none' }
  const r = targetRect.value
  return {
    position: 'fixed' as const,
    top: `${r.top - 4}px`,
    left: `${r.left - 4}px`,
    width: `${r.width + 8}px`,
    height: `${r.height + 8}px`,
    boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
    borderRadius: '4px',
    zIndex: 9999,
    pointerEvents: 'none' as const
  }
})

const contentStyle = computed(() => {
  if (!targetRect.value) {
    return {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10000
    }
  }
  const r = targetRect.value
  return {
    position: 'fixed' as const,
    top: `${r.bottom + 12}px`,
    left: `${Math.max(8, Math.min(window.innerWidth - 328, r.left))}px`,
    zIndex: 10000
  }
})

const next = () => {
  if (current.value < props.steps.length - 1) current.value++
  else { emit('finish'); close() }
}
const prev = () => { if (current.value > 0) current.value-- }
const close = () => { emit('update:visible', false); current.value = 0 }
</script>

<style scoped>
.w-tour__mask { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; }
.w-tour__content { width: 320px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; box-shadow: var(--w-box-shadow-dark); z-index: 10000; }
.w-tour__header { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--w-xp-title-bar); color: #fff; font-weight: bold; font-size: var(--w-font-size-medium); }
.w-tour__actions { display: flex; align-items: center; gap: 8px; }
.w-tour__close { cursor: pointer; }
.w-tour__body { padding: 12px; font-size: var(--w-font-size-base); }
.w-tour__footer { display: flex; justify-content: flex-end; gap: 6px; padding: 8px; border-top: 1px solid #d4d0c8; }
</style>
