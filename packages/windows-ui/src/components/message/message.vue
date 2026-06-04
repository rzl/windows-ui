<template>
  <transition-group name="w-message" tag="div" class="w-message__container">
    <div v-for="msg in messages" :key="msg.id" :class="['w-message', `w-message--${msg.type}`]">
      <w-icon :name="msg.type === 'success' ? 'success' : msg.type === 'error' ? 'error' : msg.type === 'warning' ? 'warning' : 'info'" />
      <span>{{ msg.message }}</span>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WIcon from '../icon/icon.vue'
defineOptions({ name: 'WMessage' })
const messages = ref<{ id: number; message: string; type: string }[]>([])
let id = 0
const show = (message: string, type = 'info', duration = 3000) => {
  const mid = ++id
  messages.value.push({ id: mid, message, type })
  setTimeout(() => { messages.value = messages.value.filter(m => m.id !== mid) }, duration)
}
const info = (msg: string, duration?: number) => show(msg, 'info', duration)
const success = (msg: string, duration?: number) => show(msg, 'success', duration)
const warning = (msg: string, duration?: number) => show(msg, 'warning', duration)
const error = (msg: string, duration?: number) => show(msg, 'error', duration)
defineExpose({ info, success, warning, error, show })
</script>

<style scoped>
.w-message__container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; display: flex; flex-direction: column; gap: 8px; }
.w-message { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: var(--w-bg-color); border: 1px solid #808080; box-shadow: var(--w-box-shadow); font-family: var(--w-font-family); font-size: var(--w-font-size-base); min-width: 200px; }
.w-message--info { border-left: 4px solid var(--w-color-primary); }
.w-message--success { border-left: 4px solid var(--w-color-success); }
.w-message--warning { border-left: 4px solid var(--w-color-warning); }
.w-message--error { border-left: 4px solid var(--w-color-danger); }
.w-message-enter-active, .w-message-leave-active { transition: all 0.3s; }
.w-message-enter-from, .w-message-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
