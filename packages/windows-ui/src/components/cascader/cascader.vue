<template>
  <div class="w-cascader" v-click-outside="close">
    <w-input :model-value="displayValue" readonly :placeholder="placeholder" :clearable="clearable" @click="open = !open" @clear="handleClear" />
    <div v-show="open" class="w-cascader__dropdown">
      <div class="w-cascader__menu">
        <div v-for="opt in currentOptions" :key="opt.value" :class="['w-cascader__item', { 'is-active': selected[0] === opt.value }]" @click="select(opt, 0)">{{ opt.label }}<span v-if="opt.children">&nbsp;&gt;</span></div>
      </div>
      <div v-if="selected.length && childOptions.length" class="w-cascader__menu">
        <div v-for="opt in childOptions" :key="opt.value" :class="['w-cascader__item', { 'is-active': selected[1] === opt.value }]" @click="select(opt, 1)">{{ opt.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WInput from '../input/input.vue'
defineOptions({ name: 'WCascader' })
const props = defineProps({ modelValue: Array as () => string[], options: { type: Array as () => any[], default: () => [] }, placeholder: String, clearable: { type: Boolean, default: true } })
const emit = defineEmits(['update:modelValue', 'change', 'clear'])
const open = ref(false)
const selected = ref<string[]>(props.modelValue || [])
const currentOptions = computed(() => props.options)
const childOptions = computed(() => { const p = props.options.find(o => o.value === selected.value[0]); return p?.children || [] })
const displayValue = computed(() => {
  const labels: string[] = []
  let list: any[] = props.options
  for (const v of selected.value) { const found = list.find(o => o.value === v); if (found) { labels.push(found.label); list = found.children || [] } }
  return labels.join(' / ')
})
const select = (opt: any, level: number) => {
  selected.value = selected.value.slice(0, level)
  selected.value.push(opt.value)
  if (!opt.children) { emit('update:modelValue', [...selected.value]); emit('change', [...selected.value]); open.value = false }
}
const handleClear = () => { selected.value = []; emit('update:modelValue', []); emit('change', []); emit('clear') }
const close = () => { open.value = false }
const vClickOutside = { mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) }, unmounted(el: any) { document.removeEventListener('click', el._clickOutside) } }
</script>

<style scoped>
.w-cascader { position: relative; display: inline-block; }
.w-cascader__dropdown { position: absolute; top: 100%; left: 0; z-index: var(--w-index-popper); display: flex; background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
.w-cascader__menu { min-width: 140px; border-right: 1px solid #d4d0c8; max-height: 200px; overflow-y: auto; }
.w-cascader__menu:last-child { border-right: none; }
.w-cascader__item { padding: 4px 8px; cursor: pointer; font-size: var(--w-font-size-base); display: flex; justify-content: space-between; }
.w-cascader__item:hover, .w-cascader__item.is-active { background: var(--w-xp-blue); color: #fff; }
</style>
