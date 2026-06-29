<template>
  <div :class="['w-popconfirm', `w-popconfirm--${size}`]" v-click-outside="close">
    <div @click="open = true"><slot /></div>
    <div v-show="open" class="w-popconfirm__popper" :style="popperStyle">
      <div class="w-popconfirm__content">
        <slot name="title">
          <w-icon :name="type === 'warning' ? 'warning' : 'info'" />
          <span>{{ title }}</span>
        </slot>
      </div>
      <div class="w-popconfirm__actions">
        <slot name="action">
          <w-button :size="size" @click="cancel">{{ cancelButtonText }}</w-button>
          <w-button :size="size" type="primary" @click="confirm">{{ confirmButtonText }}</w-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WIcon from '../icon/icon.vue'
import WButton from '../button/button.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WPopconfirm' })
const props = defineProps({
  title: { type: String, default: '确认操作？' },
  type: { type: String, default: 'warning' },
  size: { type: String, default: undefined },
  confirmButtonText: { type: String, default: '确定' },
  cancelButtonText: { type: String, default: '取消' },
  placement: { type: String, default: 'bottom' }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['confirm', 'cancel'])

const open = ref(false)
const confirm = () => { emit('confirm'); open.value = false }
const cancel = () => { emit('cancel'); open.value = false }
const close = () => { open.value = false }

const popperStyle = computed(() => {
  const style: Record<string, string> = { position: 'absolute', zIndex: 'var(--w-index-popper)' }
  switch (props.placement) {
    case 'top': style.bottom = '100%'; style.left = '50%'; style.transform = 'translateX(-50%)'; style.marginBottom = '8px'; break
    case 'left': style.right = '100%'; style.top = '50%'; style.transform = 'translateY(-50%)'; style.marginRight = '8px'; break
    case 'right': style.left = '100%'; style.top = '50%'; style.transform = 'translateY(-50%)'; style.marginLeft = '8px'; break
    default: style.top = '100%'; style.left = '50%'; style.transform = 'translateX(-50%)'; style.marginTop = '8px'
  }
  return style
})

const vClickOutside = {
  mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) },
  unmounted(el: any) { document.removeEventListener('click', el._clickOutside) }
}
</script>

<style scoped>
.w-popconfirm { position: relative; display: inline-block; }
.w-popconfirm__popper { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); z-index: var(--w-index-popper); margin-top: 8px; background: var(--w-bg-color); border: 1px solid #808080; box-shadow: var(--w-box-shadow); padding: 10px; min-width: 180px; }
.w-popconfirm__content { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: var(--w-font-size-base); }
.w-popconfirm__actions { display: flex; justify-content: flex-end; gap: 6px; }
.w-popconfirm--small .w-popconfirm__popper { padding: 6px; font-size: var(--w-font-size-small); min-width: 160px; }
.w-popconfirm--large .w-popconfirm__popper { padding: 14px; font-size: var(--w-font-size-medium); min-width: 200px; }
</style>
