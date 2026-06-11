<template>
  <div :class="['w-select', `w-select--${size}`]" v-click-outside="close">
    <div class="w-select__trigger" @click="open = !open">
      <span v-if="selectedLabel">{{ selectedLabel }}</span>
      <span v-else class="w-select__placeholder">{{ placeholder }}</span>
      <div class="w-select__icons">
        <w-icon v-if="clearable && selectedLabel" name="close" :size="size" class="w-select__clear" @click.stop="handleClear" />
        <w-icon name="arrowDown" :size="size" />
      </div>
    </div>
    <div v-show="open" class="w-select__dropdown">
      <div
        v-for="opt in options"
        :key="opt.value"
        :class="['w-select__option', { 'is-selected': modelValue === opt.value }]"
        @click="select(opt)"
      >{{ opt.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WSelect' })
const props = defineProps({
  modelValue: [String, Number] as any,
  options: { type: Array as () => { label: string; value: any }[], default: () => [] },
  placeholder: { type: String, default: '请选择' },
  clearable: { type: Boolean, default: true },
  size: { type: String, default: undefined }
})
const emit = defineEmits(['update:modelValue', 'change', 'clear'])
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)

const open = ref(false)
const selectedLabel = computed(() => props.options.find(o => o.value === props.modelValue)?.label)

const select = (opt: any) => {
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  open.value = false
}
const close = () => { open.value = false }
const handleClear = () => {
  emit('update:modelValue', undefined)
  emit('change', undefined)
  emit('clear')
}

const vClickOutside = {
  mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) },
  unmounted(el: any) { document.removeEventListener('click', el._clickOutside) }
}
</script>

<style scoped>
.w-select { position: relative; display: inline-block; min-width: 120px; }
.w-select__trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; box-sizing: border-box; padding: 2px 4px; border: 1px solid #7f9db9; background: #fff; cursor: pointer; font-family: var(--w-font-family); font-size: var(--w-font-size-base); height: var(--w-component-size); }
.w-select--small .w-select__trigger { padding: 1px 2px; height: var(--w-component-size-small); font-size: var(--w-font-size-small); }
.w-select--large .w-select__trigger { padding: 4px 6px; height: var(--w-component-size-large); font-size: var(--w-font-size-medium); }
.w-select__placeholder { color: var(--w-text-color-placeholder); }
.w-select__dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: var(--w-index-popper); background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); max-height: 200px; overflow-y: auto; }
.w-select__option { padding: 4px 8px; cursor: pointer; font-size: var(--w-font-size-base); line-height: 1.5; }
.w-select__option:hover, .w-select__option.is-selected { background: var(--w-xp-blue); color: #fff; }
.w-select--small .w-select__option { padding: 2px 6px; font-size: var(--w-font-size-small); }
.w-select--large .w-select__option { padding: 6px 10px; font-size: var(--w-font-size-medium); }
.w-select__icons { display: flex; align-items: center; gap: 4px; }
.w-select__clear { cursor: pointer; }
</style>
