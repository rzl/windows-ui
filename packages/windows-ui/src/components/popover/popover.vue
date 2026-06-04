<template>
  <div class="w-popover" v-click-outside="close">
    <div @mouseenter="trigger === 'hover' && (open = true)" @mouseleave="trigger === 'hover' && (open = false)" @click="trigger === 'click' && (open = !open)"><slot /></div>
    <div v-show="open" class="w-popover__popper" :style="popperStyle">
      <div class="w-popover__title" v-if="title">{{ title }}</div>
      <div class="w-popover__content"><slot name="content">{{ content }}</slot></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
defineOptions({ name: 'WPopover' })
const props = defineProps({ title: String, content: String, placement: { type: String, default: 'bottom' }, trigger: { type: String, default: 'click' }, width: { type: [String, Number], default: '' } })
const open = ref(false)
const popperStyle = computed(() => { const style: Record<string, string> = {}; if (props.width) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width; style.top = '100%'; style.left = '50%'; style.transform = 'translateX(-50%)'; style.marginTop = '8px'; style.position = 'absolute'; return style })
const close = () => { open.value = false }
const vClickOutside = { mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) }, unmounted(el: any) { document.removeEventListener('click', el._clickOutside) } }
</script>

<style scoped>
.w-popover { position: relative; display: inline-block; }
.w-popover__popper { position: absolute; z-index: var(--w-index-popper); background: var(--w-bg-color); border: 1px solid #808080; box-shadow: var(--w-box-shadow); padding: 10px; min-width: 150px; }
.w-popover__title { font-weight: bold; margin-bottom: 6px; font-size: var(--w-font-size-base); border-bottom: 1px solid #d4d0c8; padding-bottom: 4px; }
.w-popover__content { font-size: var(--w-font-size-base); }
</style>
