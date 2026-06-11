<template>
  <teleport to="body">
    <transition name="w-dialog-fade">
      <div v-if="modelValue" class="w-dialog__wrapper" @click.self="handleWrapperClick">
        <div
          ref="dialogRef"
          class="w-dialog"
          :class="{ 'is-dragging': isDragging, 'is-fullscreen': isFullscreen }"
          :style="dialogStyle"
        >
          <div
            class="w-dialog__header"
            :class="{ 'is-draggable': draggable && !isFullscreen }"
            @mousedown="handleMouseDown"
            @touchstart.passive="handleTouchStart"
          >
            <slot name="header">
              <span class="w-dialog__title">{{ title }}</span>
            </slot>
            <div class="w-dialog__actions">
              <slot name="action" />
              <w-icon
                :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
                class="w-dialog__fullscreen"
                @click="toggleFullscreen"
              />
              <w-icon name="close" class="w-dialog__close" @click="close" />
            </div>
          </div>
          <div class="w-dialog__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="w-dialog__footer">
            <slot name="footer">
              <w-button @click="close">取消</w-button>
              <w-button type="primary" @click="confirm">确定</w-button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import WIcon from '../icon/icon.vue'
import WButton from '../button/button.vue'

defineOptions({ name: 'WDialog' })

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '提示' },
  width: { type: Number, default: 420 },
  closeOnClickModal: { type: Boolean, default: true },
  draggable: { type: Boolean, default: true },
  fullscreen: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

const dialogRef = ref<HTMLElement>()
const offset = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragMoved = ref(false)
const isFullscreen = ref(props.fullscreen)

const dialogStyle = computed(() => {
  if (isFullscreen.value) {
    return {
      width: '100%',
      height: '100%',
      transform: 'none'
    }
  }
  return {
    width: `${props.width}px`,
    transform: `translate(${offset.value.x}px, ${offset.value.y}px)`
  }
})

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

let startX = 0
let startY = 0
let startOffsetX = 0
let startOffsetY = 0

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const confirm = () => {
  emit('confirm')
  close()
}

const handleWrapperClick = () => {
  if (dragMoved.value) return
  if (props.closeOnClickModal) close()
}

const startDrag = (clientX: number, clientY: number) => {
  isDragging.value = true
  dragMoved.value = false
  startX = clientX
  startY = clientY
  startOffsetX = offset.value.x
  startOffsetY = offset.value.y
}

const moveDrag = (clientX: number, clientY: number) => {
  if (!isDragging.value) return
  const dx = clientX - startX
  const dy = clientY - startY
  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
    dragMoved.value = true
  }
  offset.value = {
    x: startOffsetX + dx,
    y: startOffsetY + dy
  }
}

const endDrag = () => {
  isDragging.value = false
  setTimeout(() => { dragMoved.value = false }, 100)
}

const handleMouseDown = (e: MouseEvent) => {
  if (!props.draggable || isFullscreen.value) return
  startDrag(e.clientX, e.clientY)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  moveDrag(e.clientX, e.clientY)
}

const handleMouseUp = () => {
  endDrag()
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
}

const handleTouchStart = (e: TouchEvent) => {
  if (!props.draggable || isFullscreen.value) return
  const touch = e.touches[0]
  startDrag(touch.clientX, touch.clientY)
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('touchend', handleTouchEnd)
}

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  const touch = e.touches[0]
  moveDrag(touch.clientX, touch.clientY)
}

const handleTouchEnd = () => {
  endDrag()
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
}

watch(() => props.modelValue, (val) => {
  if (val) {
    offset.value = { x: 0, y: 0 }
    isFullscreen.value = props.fullscreen
  }
})
</script>

<style scoped>
.w-dialog__wrapper {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.w-dialog {
  background: var(--w-bg-color);
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  box-shadow: var(--w-box-shadow-dark);
  font-family: var(--w-font-family);
  transition: transform 0s;
}

.w-dialog.is-dragging {
  transition: none;
}

.w-dialog.is-fullscreen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  width: 100% !important;
  height: 100% !important;
  border: none;
  border-radius: 0;
}

.w-dialog.is-fullscreen .w-dialog__body {
  flex: 1;
  overflow: auto;
}

.w-dialog__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: var(--w-xp-title-bar);
  color: #fff;
  font-weight: bold;
  font-size: var(--w-font-size-medium);
  user-select: none;
}

.w-dialog__header.is-draggable {
  cursor: move;
  touch-action: none;
}

.w-dialog__header.is-draggable:active {
  cursor: grabbing;
}

.w-dialog__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.w-dialog__fullscreen,
.w-dialog__close {
  cursor: pointer;
}

.w-dialog__body {
  padding: 16px;
  font-size: var(--w-font-size-base);
}

.w-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid #d4d0c8;
}

.w-dialog-fade-enter-active,
.w-dialog-fade-leave-active {
  transition: opacity 0.3s;
}

.w-dialog-fade-enter-from,
.w-dialog-fade-leave-to {
  opacity: 0;
}
</style>
