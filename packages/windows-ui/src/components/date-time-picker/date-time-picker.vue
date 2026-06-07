<template>
  <div class="w-date-time-picker" v-click-outside="close">
    <w-input v-model="displayValue" readonly :placeholder="placeholder" @click="open = !open" />
    <div v-show="open" class="w-date-time-picker__popper">
      <w-date-picker-panel v-model="dateValue" @change="handleDateChange" />
      <div class="w-date-time-picker__time">
        <w-input-number v-model="hour" :min="0" :max="23" size="small" />
        <span>:</span>
        <w-input-number v-model="minute" :min="0" :max="59" size="small" />
        <span>:</span>
        <w-input-number v-model="second" :min="0" :max="59" size="small" />
        <w-button size="small" @click="confirm">确定</w-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WInput from '../input/input.vue'
import WDatePickerPanel from '../date-picker-panel/date-picker-panel.vue'
import WInputNumber from '../input-number/input-number.vue'
import WButton from '../button/button.vue'
defineOptions({ name: 'WDateTimePicker' })
const props = defineProps({ modelValue: String, placeholder: { type: String, default: '选择日期时间' } })
const emit = defineEmits(['update:modelValue', 'change'])
const open = ref(false)
const now = new Date()
const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const dateValue = ref(props.modelValue ? props.modelValue.split(' ')[0] : todayStr)
const parts = props.modelValue?.split(' ')?.[1]?.split(':').map(Number) || [now.getHours(), now.getMinutes(), now.getSeconds()]
const hour = ref(parts[0] || 0)
const minute = ref(parts[1] || 0)
const second = ref(parts[2] || 0)
const displayValue = computed(() => props.modelValue || '')
const handleDateChange = (v: string) => { dateValue.value = v }
const confirm = () => { const time = `${String(hour.value).padStart(2, '0')}:${String(minute.value).padStart(2, '0')}:${String(second.value).padStart(2, '0')}`; const val = `${dateValue.value} ${time}`; emit('update:modelValue', val); emit('change', val); open.value = false }
const close = () => { open.value = false }
const vClickOutside = { mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) }, unmounted(el: any) { document.removeEventListener('click', el._clickOutside) } }
</script>

<style scoped>
.w-date-time-picker { position: relative; display: inline-block; }
.w-date-time-picker__popper { position: absolute; top: 100%; left: 0; z-index: var(--w-index-popper); margin-top: 4px; background: var(--w-bg-color); border: 1px solid #808080; width: 258px; box-sizing: border-box; padding: 0; }
.w-date-time-picker__time { display: flex; align-items: center; gap: 4px; padding: 8px; justify-content: center; width: 100%; box-sizing: border-box; }
:deep(.w-date-picker-panel.w-date-picker-panel) { border: none; }
:deep(.w-input-number) { flex: 1; min-width: 0; }
:deep(.w-input-number input) { width: 100%; min-width: 0; font-size: var(--w-font-size-small); }
:deep(.w-input-number button) { width: 16px; padding: 0; flex-shrink: 0; }
</style>
