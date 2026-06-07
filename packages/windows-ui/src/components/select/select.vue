<template>
  <div class="w-select" v-click-outside="close">
    <div class="w-select__trigger" @click="open = !open">
      <span v-if="selectedLabel">{{ selectedLabel }}</span>
      <span v-else class="w-select__placeholder">{{ placeholder }}</span>
      <div class="w-select__icons">
        <w-icon v-if="clearable && selectedLabel" name="close" size="small" class="w-select__clear" @click.stop="handleClear" />
        <w-icon name="arrowDown" size="small" />
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

defineOptions({ name: 'WSelect' })
const props = defineProps({
  modelValue: [String, Number] as any,
  options: { type: Array as () => { label: string; value: any }[], default: () => [] },
  placeholder: { type: String, default: '请选择' },
  clearable: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue', 'change', 'clear'])

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
.w-select__trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 3px 8px; border: 1px solid #7f9db9; background: #fff; cursor: pointer; font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
.w-select__placeholder { color: var(--w-text-color-placeholder); }
.w-select__dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: var(--w-index-popper); background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); max-height: 200px; overflow-y: auto; }
.w-select__option { padding: 4px 8px; cursor: pointer; font-size: var(--w-font-size-base); }
.w-select__option:hover, .w-select__option.is-selected { background: var(--w-xp-blue); color: #fff; }
.w-select__icons { display: flex; align-items: center; gap: 4px; }
.w-select__clear { cursor: pointer; }
</style>
