<template>
  <div class="w-date-picker" v-click-outside="close">
    <w-input v-model="displayValue" readonly :placeholder="placeholder" @click="open = !open" />
    <div v-show="open" class="w-date-picker__popper">
      <w-date-picker-panel v-model="inputValue" @change="handleChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WInput from '../input/input.vue'
import WDatePickerPanel from '../date-picker-panel/date-picker-panel.vue'
defineOptions({ name: 'WDatePicker' })
const props = defineProps({ modelValue: String, placeholder: { type: String, default: '选择日期' } })
const emit = defineEmits(['update:modelValue', 'change'])
const open = ref(false)
const inputValue = ref(props.modelValue || '')
const displayValue = computed(() => inputValue.value)
const handleChange = (v: string) => { inputValue.value = v; emit('update:modelValue', v); emit('change', v); open.value = false }
const close = () => { open.value = false }
const vClickOutside = { mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) }, unmounted(el: any) { document.removeEventListener('click', el._clickOutside) } }
</script>

<style scoped>
.w-date-picker { position: relative; display: inline-block; }
.w-date-picker__popper { position: absolute; top: 100%; left: 0; z-index: var(--w-index-popper); margin-top: 4px; }
</style>
