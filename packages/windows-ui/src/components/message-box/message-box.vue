<template>
  <teleport to="body">
    <transition name="w-msgbox-fade">
      <div v-if="visible" class="w-message-box__wrapper" @click.self="handleWrapperClick">
        <div class="w-message-box">
          <div class="w-message-box__header">
            <slot name="header">
              <span class="w-message-box__title">{{ title }}</span>
            </slot>
            <div class="w-message-box__actions">
              <slot name="action" />
              <w-icon name="close" size="small" class="w-message-box__close" @click="cancel" />
            </div>
          </div>
          <div class="w-message-box__body">
            <w-icon v-if="type" :name="type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'" />
            <span>{{ message }}</span>
          </div>
          <div class="w-message-box__footer">
            <w-button v-if="showCancelButton" @click="cancel">{{ cancelButtonText }}</w-button>
            <w-button type="primary" @click="confirm">{{ confirmButtonText }}</w-button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WIcon from '../icon/icon.vue'
import WButton from '../button/button.vue'
defineOptions({ name: 'WMessageBox' })
const visible = ref(false)
const title = ref('提示')
const message = ref('')
const type = ref('')
const showCancelButton = ref(false)
const confirmButtonText = ref('确定')
const cancelButtonText = ref('取消')
let resolveFn: any = null
const open = (opts: any) => {
  title.value = opts.title || '提示'
  message.value = opts.message || ''
  type.value = opts.type || ''
  showCancelButton.value = opts.showCancelButton || false
  confirmButtonText.value = opts.confirmButtonText || '确定'
  cancelButtonText.value = opts.cancelButtonText || '取消'
  visible.value = true
  return new Promise(r => { resolveFn = r })
}
const confirm = () => { visible.value = false; resolveFn?.(true) }
const cancel = () => { visible.value = false; resolveFn?.(false) }
const handleWrapperClick = () => { if (!showCancelButton.value) cancel() }
defineExpose({ open, confirm, cancel })
</script>

<style scoped>
.w-message-box__wrapper { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; }
.w-message-box { width: 360px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #404040 #404040 #fff; box-shadow: var(--w-box-shadow-dark); font-family: var(--w-font-family); }
.w-message-box__header { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--w-xp-title-bar); color: #fff; font-weight: bold; font-size: var(--w-font-size-medium); }
.w-message-box__actions { display: flex; align-items: center; gap: 8px; }
.w-message-box__close { cursor: pointer; }
.w-message-box__body { display: flex; align-items: center; gap: 12px; padding: 20px 16px; font-size: var(--w-font-size-base); }
.w-message-box__footer { display: flex; justify-content: flex-end; gap: 8px; padding: 10px 16px; border-top: 1px solid #d4d0c8; }
.w-msgbox-fade-enter-active, .w-msgbox-fade-leave-active { transition: opacity 0.3s; }
.w-msgbox-fade-enter-from, .w-msgbox-fade-leave-to { opacity: 0; }
</style>
