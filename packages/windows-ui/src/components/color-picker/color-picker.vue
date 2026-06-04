<template>
  <div class="w-color-picker" v-click-outside="close">
    <div class="w-color-picker__trigger" @click="open = !open">
      <div class="w-color-picker__color" :style="{ backgroundColor: modelValue }" />
      <span>{{ modelValue || '选择颜色' }}</span>
    </div>
    <div v-show="open" class="w-color-picker__popper">
      <w-color-picker-panel @change="handleChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WColorPickerPanel from '../color-picker-panel/color-picker-panel.vue'

defineOptions({ name: 'WColorPicker' })
defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue', 'change'])

const open = ref(false)
const handleChange = (v: string) => { emit('update:modelValue', v); emit('change', v) }
const close = () => { open.value = false }

const vClickOutside = {
  mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) },
  unmounted(el: any) { document.removeEventListener('click', el._clickOutside) }
}
</script>

<style scoped>
.w-color-picker { position: relative; display: inline-block; }
.w-color-picker__trigger { display: inline-flex; align-items: center; gap: 6px; padding: 2px 6px; border: 1px solid #7f9db9; background: #fff; cursor: pointer; font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
.w-color-picker__color { width: 20px; height: 14px; border: 1px solid #808080; }
.w-color-picker__popper { position: absolute; top: 100%; left: 0; z-index: var(--w-index-popper); margin-top: 4px; }
</style>
