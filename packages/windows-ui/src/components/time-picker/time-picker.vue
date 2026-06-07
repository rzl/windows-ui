<template>
  <div class="w-time-picker" v-click-outside="close">
    <w-input :model-value="displayValue" readonly :placeholder="placeholder" :clearable="clearable" @click="open = !open" @clear="handleClear" />
    <div v-show="open" class="w-time-picker__popper">
      <div class="w-time-picker__panel">
        <div class="w-time-picker__column"><div v-for="h in 24" :key="h" :class="['w-time-picker__cell', { 'is-active': h - 1 === hour }]" @click="hour = h - 1">{{ String(h - 1).padStart(2, '0') }}</div></div>
        <div class="w-time-picker__column"><div v-for="m in 60" :key="m" :class="['w-time-picker__cell', { 'is-active': m - 1 === minute }]" @click="minute = m - 1">{{ String(m - 1).padStart(2, '0') }}</div></div>
        <div class="w-time-picker__column"><div v-for="s in 60" :key="s" :class="['w-time-picker__cell', { 'is-active': s - 1 === second }]" @click="second = s - 1">{{ String(s - 1).padStart(2, '0') }}</div></div>
      </div>
      <div class="w-time-picker__footer"><w-button size="small" @click="confirm">确定</w-button><w-button size="small" @click="open = false">取消</w-button></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WInput from '../input/input.vue'
import WButton from '../button/button.vue'
defineOptions({ name: 'WTimePicker' })
const props = defineProps({ modelValue: String, placeholder: { type: String, default: '选择时间' }, clearable: { type: Boolean, default: true } })
const emit = defineEmits(['update:modelValue', 'change', 'clear'])
const open = ref(false)
const parts = props.modelValue?.split(':').map(Number) || [0, 0, 0]
const hour = ref(parts[0] || 0)
const minute = ref(parts[1] || 0)
const second = ref(parts[2] || 0)
const displayValue = computed(() => props.modelValue || '')
const confirm = () => { const val = `${String(hour.value).padStart(2, '0')}:${String(minute.value).padStart(2, '0')}:${String(second.value).padStart(2, '0')}`; emit('update:modelValue', val); emit('change', val); open.value = false }
const handleClear = () => { emit('update:modelValue', ''); emit('change', ''); emit('clear') }
const close = () => { open.value = false }
const vClickOutside = { mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) }, unmounted(el: any) { document.removeEventListener('click', el._clickOutside) } }
</script>

<style scoped>
.w-time-picker { position: relative; display: inline-block; }
.w-time-picker__popper { position: absolute; top: 100%; left: 0; z-index: var(--w-index-popper); margin-top: 4px; background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
.w-time-picker__panel { display: flex; height: 180px; }
.w-time-picker__column { flex: 1; overflow-y: auto; border-right: 1px solid #d4d0c8; }
.w-time-picker__column:last-child { border-right: none; }
.w-time-picker__cell { padding: 4px 8px; text-align: center; cursor: pointer; font-size: var(--w-font-size-base); }
.w-time-picker__cell:hover { background: var(--w-xp-blue-light); color: #fff; }
.w-time-picker__cell.is-active { background: var(--w-color-primary); color: #fff; }
.w-time-picker__footer { display: flex; justify-content: flex-end; gap: 4px; padding: 6px; border-top: 1px solid #d4d0c8; }
</style>
