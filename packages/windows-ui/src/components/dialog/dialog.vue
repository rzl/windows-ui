<template>
  <teleport to="body">
    <transition name="w-dialog-fade">
      <div v-if="modelValue" class="w-dialog__wrapper" @click.self="handleWrapperClick">
        <div class="w-dialog" :style="{ width: `${width}px` }">
          <div class="w-dialog__header">
            <span class="w-dialog__title">{{ title }}</span>
            <w-icon name="close" size="small" class="w-dialog__close" @click="close" />
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
import WIcon from '../icon/icon.vue'
import WButton from '../button/button.vue'

defineOptions({ name: 'WDialog' })
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '提示' },
  width: { type: Number, default: 420 },
  closeOnClickModal: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

const close = () => { emit('update:modelValue', false); emit('close') }
const confirm = () => { emit('confirm'); close() }
const handleWrapperClick = () => { if (props.closeOnClickModal) close() }
</script>

<style scoped>
.w-dialog__wrapper { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; }
.w-dialog { background: var(--w-bg-color); border: 2px solid; border-color: #fff #404040 #404040 #fff; box-shadow: var(--w-box-shadow-dark); font-family: var(--w-font-family); }
.w-dialog__header { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: linear-gradient(180deg, #1f91e5, #1a6fdc, #1a5dc6); color: #fff; font-weight: bold; font-size: var(--w-font-size-medium); }
.w-dialog__close { cursor: pointer; }
.w-dialog__body { padding: 16px; font-size: var(--w-font-size-base); }
.w-dialog__footer { display: flex; justify-content: flex-end; gap: 8px; padding: 10px 16px; border-top: 1px solid #d4d0c8; }
.w-dialog-fade-enter-active, .w-dialog-fade-leave-active { transition: opacity 0.3s; }
.w-dialog-fade-enter-from, .w-dialog-fade-leave-to { opacity: 0; }
</style>
