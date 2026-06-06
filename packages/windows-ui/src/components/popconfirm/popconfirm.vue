<template>
  <div class="w-popconfirm" v-click-outside="close">
    <div @click="open = true"><slot /></div>
    <div v-show="open" class="w-popconfirm__popper">
      <div class="w-popconfirm__content">
        <slot name="title">
          <w-icon :name="type === 'warning' ? 'warning' : 'info'" />
          <span>{{ title }}</span>
        </slot>
      </div>
      <div class="w-popconfirm__actions">
        <slot name="action">
          <w-button size="small" @click="cancel">取消</w-button>
          <w-button size="small" type="primary" @click="confirm">确定</w-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WIcon from '../icon/icon.vue'
import WButton from '../button/button.vue'

defineOptions({ name: 'WPopconfirm' })
defineProps({ title: { type: String, default: '确认操作？' }, type: { type: String, default: 'warning' } })
const emit = defineEmits(['confirm', 'cancel'])

const open = ref(false)
const confirm = () => { emit('confirm'); open.value = false }
const cancel = () => { emit('cancel'); open.value = false }
const close = () => { open.value = false }

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
</style>
