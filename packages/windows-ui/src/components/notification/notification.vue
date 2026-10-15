<template>
  <transition-group name="w-notify" tag="div" class="w-notification__container" :style="{ zIndex }">
    <div v-for="n in notifications" :key="n.id" :class="['w-notification', `w-notification--${n.type}`]" :style="{ top: `${n.top}px` }">
      <div class="w-notification__header">
        <span class="w-notification__title">{{ n.title }}</span>
        <w-icon name="close" class="w-notification__close" @click="remove(n.id)" />
      </div>
      <div class="w-notification__body">{{ n.message }}</div>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import WIcon from '../icon/icon.vue'
import { nextZIndex } from '../../hooks'
defineOptions({ name: 'WNotification' })
const notifications = ref<{ id: number; title: string; message: string; type: string; top: number }[]>([])
let id = 0
const timers = new Map<number, ReturnType<typeof setTimeout>>()
// 容器层级：每次弹出时取全局递增 z-index，保证覆盖当前所有弹层
const zIndex = ref(2000)
const show = (opts: { title?: string; message: string; type?: string; duration?: number }) => {
  zIndex.value = nextZIndex()
  const nid = ++id
  const top = notifications.value.length * 80 + 20
  notifications.value.push({ id: nid, title: opts.title || '通知', message: opts.message, type: opts.type || 'info', top })
  timers.set(nid, setTimeout(() => {
    timers.delete(nid)
    remove(nid)
  }, opts.duration || 4500))
}
const remove = (nid: number) => {
  const timer = timers.get(nid)
  if (timer) {
    clearTimeout(timer)
    timers.delete(nid)
  }
  notifications.value = notifications.value.filter(n => n.id !== nid)
}
onUnmounted(() => {
  timers.forEach(timer => clearTimeout(timer))
  timers.clear()
})
defineExpose({ show, remove })
</script>

<style scoped>
.w-notification__container { position: fixed; top: 0; right: 0; }
.w-notification { position: relative; right: 20px; width: 280px; margin-bottom: 12px; background: var(--w-bg-color); border: 1px solid #808080; box-shadow: var(--w-box-shadow); font-family: var(--w-font-family); }
.w-notification--info { border-left: 4px solid var(--w-color-primary); }
.w-notification--success { border-left: 4px solid var(--w-color-success); }
.w-notification--warning { border-left: 4px solid var(--w-color-warning); }
.w-notification--error { border-left: 4px solid var(--w-color-danger); }
.w-notification__header { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-bottom: 1px solid var(--w-fill-color-darker); font-weight: bold; }
.w-notification__close { cursor: pointer; }
.w-notification__body { padding: 10px; font-size: var(--w-font-size-base); }
.w-notify-enter-active, .w-notify-leave-active { transition: all 0.3s; }
.w-notify-enter-from, .w-notify-leave-to { opacity: 0; transform: translateX(100%); }
</style>
