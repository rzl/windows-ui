<template>
  <div :class="['w-tooltip', `w-tooltip--${size}`]" v-click-outside="close">
    <div @mouseenter="open = true" @mouseleave="open = false" @click="open = !open"><slot /></div>
    <div v-show="open" class="w-tooltip__popper" :style="popperStyle">{{ content }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGlobalSize } from '../../utils/prefix'
defineOptions({ name: 'WTooltip' })
const props = defineProps({ content: String, placement: { type: String, default: 'top' }, size: { type: String, default: undefined } })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const open = ref(false)
const close = () => { open.value = false }
const popperStyle = computed(() => {
  const style: Record<string, string> = { position: 'absolute', zIndex: 'var(--w-index-popper)' }
  switch (props.placement) {
    case 'bottom': style.top = '100%'; style.left = '50%'; style.transform = 'translateX(-50%)'; style.marginTop = '6px'; break
    case 'left': style.right = '100%'; style.top = '50%'; style.transform = 'translateY(-50%)'; style.marginRight = '6px'; break
    case 'right': style.left = '100%'; style.top = '50%'; style.transform = 'translateY(-50%)'; style.marginLeft = '6px'; break
    default: style.bottom = '100%'; style.left = '50%'; style.transform = 'translateX(-50%)'; style.marginBottom = '6px'
  }
  return style
})
const vClickOutside = { mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) }, unmounted(el: any) { document.removeEventListener('click', el._clickOutside) } }
</script>

<style scoped>
.w-tooltip { position: relative; display: inline-block; }
.w-tooltip__popper { background: #ffffe1; border: 1px solid #000; padding: 4px 8px; font-size: var(--w-font-size-small); white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
.w-tooltip--small .w-tooltip__popper { padding: 2px 6px; font-size: var(--w-font-size-extra-small); }
.w-tooltip--large .w-tooltip__popper { padding: 6px 12px; font-size: var(--w-font-size-base); }
</style>
