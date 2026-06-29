<template>
  <div :class="['w-cascader', `w-cascader--${size}`]" v-click-outside="close">
    <w-input :model-value="displayValue" readonly :placeholder="placeholder" :clearable="clearable" :size="size" @click="open = !open" @clear="handleClear" />
    <div v-show="open" class="w-cascader__dropdown">
      <div v-for="(menu, level) in menus" :key="level" class="w-cascader__menu">
        <div
          v-for="opt in menu"
          :key="opt.value"
          :class="['w-cascader__item', { 'is-active': selected[level] === opt.value }]"
          @click="select(opt, level)"
        >
          {{ opt.label }}
          <span v-if="opt.children?.length">&nbsp;&gt;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import WInput from '../input/input.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WCascader' })
const props = defineProps({
  modelValue: Array as () => string[],
  options: { type: Array as () => any[], default: () => [] },
  placeholder: String,
  clearable: { type: Boolean, default: true },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'change', 'clear'])
const open = ref(false)
const selected = ref<string[]>(props.modelValue || [])

watch(() => props.modelValue, (v) => { selected.value = v || [] })

const menus = computed(() => {
  const result: any[][] = [props.options]
  let list: any[] = props.options
  for (const v of selected.value) {
    const found = list.find(o => o.value === v)
    if (found?.children?.length) {
      result.push(found.children)
      list = found.children
    } else {
      break
    }
  }
  return result
})

const displayValue = computed(() => {
  const labels: string[] = []
  let list: any[] = props.options
  for (const v of selected.value) {
    const found = list.find(o => o.value === v)
    if (found) {
      labels.push(found.label)
      list = found.children || []
    } else {
      break
    }
  }
  return labels.join(' / ')
})

const select = (opt: any, level: number) => {
  selected.value = selected.value.slice(0, level)
  selected.value.push(opt.value)
  if (!opt.children?.length) {
    emit('update:modelValue', [...selected.value])
    emit('change', [...selected.value])
    open.value = false
  }
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
.w-cascader__item { padding: 4px 8px; cursor: pointer; font-size: var(--w-font-size-base); line-height: 1.5; display: flex; justify-content: space-between; }
.w-cascader--small .w-cascader__item { padding: 2px 6px; font-size: var(--w-font-size-small); }
.w-cascader--large .w-cascader__item { padding: 6px 10px; font-size: var(--w-font-size-medium); }
.w-cascader__item:hover, .w-cascader__item.is-active { background: var(--w-xp-blue); color: #fff; }
</style>
