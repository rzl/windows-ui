<template>
  <div :class="['w-popover', `w-popover--${size}`]" v-click-outside="close">
    <div @mouseenter="trigger === 'hover' && (open = true)" @mouseleave="trigger === 'hover' && (open = false)" @click="trigger === 'click' && (open = !open)"><slot /></div>
    <div v-show="open" class="w-popover__popper" :style="popperStyle">
      <div class="w-popover__header" v-if="title || $slots.header || $slots.action">
        <div class="w-popover__header-content">
          <slot name="header">
            <div v-if="title" class="w-popover__title">{{ title }}</div>
          </slot>
        </div>
        <div v-if="$slots.action" class="w-popover__actions">
          <slot name="action" />
        </div>
      </div>
      <div class="w-popover__content"><slot name="content">{{ content }}</slot></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGlobalSize } from '../../utils/prefix'
defineOptions({ name: 'WPopover' })
const props = defineProps({ title: String, content: String, placement: { type: String, default: 'bottom' }, trigger: { type: String, default: 'click' }, width: { type: [String, Number], default: '' }, size: { type: String, default: undefined } })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const open = ref(false)
const popperStyle = computed(() => {
  const style: Record<string, string> = { position: 'absolute' }
  if (props.width) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  switch (props.placement) {
    case 'top': style.bottom = '100%'; style.left = '50%'; style.transform = 'translateX(-50%)'; style.marginBottom = '8px'; break
    case 'left': style.right = '100%'; style.top = '50%'; style.transform = 'translateY(-50%)'; style.marginRight = '8px'; break
    case 'right': style.left = '100%'; style.top = '50%'; style.transform = 'translateY(-50%)'; style.marginLeft = '8px'; break
    default: style.top = '100%'; style.left = '50%'; style.transform = 'translateX(-50%)'; style.marginTop = '8px'
  }
  return style
})
const close = () => { open.value = false }
const vClickOutside = { mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) }, unmounted(el: any) { document.removeEventListener('click', el._clickOutside) } }
</script>

<style scoped>
.w-popover { position: relative; display: inline-block; }
.w-popover__popper { position: absolute; z-index: var(--w-index-popper); background: var(--w-bg-color); border: 1px solid #808080; box-shadow: var(--w-box-shadow); padding: 10px; min-width: 150px; }
.w-popover__header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; margin-bottom: 6px; font-size: var(--w-font-size-base); border-bottom: 1px solid #d4d0c8; padding-bottom: 4px; }
.w-popover__header-content { flex: 1; }
.w-popover__actions { display: flex; align-items: center; gap: 8px; margin-left: 8px; }
.w-popover__title { font-weight: bold; }
.w-popover__content { font-size: var(--w-font-size-base); }
.w-popover--small .w-popover__popper { padding: 6px; font-size: var(--w-font-size-small); }
.w-popover--small .w-popover__title { font-size: var(--w-font-size-small); }
.w-popover--large .w-popover__popper { padding: 14px; font-size: var(--w-font-size-medium); }
.w-popover--large .w-popover__title { font-size: var(--w-font-size-large); }
</style>
