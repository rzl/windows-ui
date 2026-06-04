<template>
  <div class="w-tooltip" v-click-outside="close">
    <div @mouseenter="open = true" @mouseleave="open = false" @click="open = !open"><slot /></div>
    <div v-show="open" class="w-tooltip__popper">{{ content }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({ name: 'WTooltip' })
defineProps({ content: String })
const open = ref(false)
const close = () => { open.value = false }
const vClickOutside = { mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) }, unmounted(el: any) { document.removeEventListener('click', el._clickOutside) } }
</script>

<style scoped>
.w-tooltip { position: relative; display: inline-block; }
.w-tooltip__popper { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 6px; background: #ffffe1; border: 1px solid #000; padding: 4px 8px; font-size: var(--w-font-size-small); white-space: nowrap; z-index: var(--w-index-popper); box-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
</style>
