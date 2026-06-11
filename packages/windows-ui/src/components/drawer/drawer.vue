<template>
  <teleport to="body">
    <transition name="w-drawer-fade">
      <div v-if="modelValue" class="w-drawer__wrapper" @click.self="closeOnClickModal && close()">
        <div :class="['w-drawer', `w-drawer--${direction}`]" :style="drawerStyle">
          <div class="w-drawer__header">
            <slot name="header">
              <span class="w-drawer__title">{{ title }}</span>
            </slot>
            <div class="w-drawer__actions">
              <slot name="action" />
              <w-icon name="close" class="w-drawer__close" @click="close" />
            </div>
          </div>
          <div class="w-drawer__body">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WDrawer' })
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  direction: { type: String, default: 'right' },
  size: { type: [String, Number], default: '300px' },
  closeOnClickModal: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue', 'close'])

const drawerStyle = computed(() => {
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size
  if (props.direction === 'left' || props.direction === 'right') return { width: s, height: '100%' }
  return { height: s, width: '100%' }
})

const close = () => { emit('update:modelValue', false); emit('close') }
</script>

<style scoped>
.w-drawer__wrapper { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; }
.w-drawer { position: absolute; background: var(--w-bg-color); box-shadow: var(--w-box-shadow-dark); font-family: var(--w-font-family); display: flex; flex-direction: column; }
.w-drawer--left { left: 0; top: 0; bottom: 0; }
.w-drawer--right { right: 0; top: 0; bottom: 0; }
.w-drawer--top { top: 0; left: 0; right: 0; }
.w-drawer--bottom { bottom: 0; left: 0; right: 0; }
.w-drawer__header { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-bottom: 1px solid #d4d0c8; font-weight: bold; font-size: var(--w-font-size-medium); background: var(--w-xp-title-bar); color: #fff; }
.w-drawer__actions { display: flex; align-items: center; gap: 8px; }
.w-drawer__close { cursor: pointer; }
.w-drawer__body { flex: 1; padding: 16px; overflow: auto; }
.w-drawer-fade-enter-active, .w-drawer-fade-leave-active { transition: opacity 0.3s; }
.w-drawer-fade-enter-from, .w-drawer-fade-leave-to { opacity: 0; }
</style>
