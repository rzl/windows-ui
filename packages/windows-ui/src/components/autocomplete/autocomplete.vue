<template>
  <div :class="['w-autocomplete', `w-autocomplete--${size}`]" v-click-outside="close">
    <w-input v-model="inputValue" :placeholder="placeholder" :clearable="clearable" :size="size" :disabled="disabled" @focus="open = true" @input="handleInput" @clear="handleClear" />
    <div v-show="open && filtered.length" class="w-autocomplete__suggestions" :style="{ zIndex }">
      <div v-for="item in filtered" :key="item.value" class="w-autocomplete__item" @click="select(item)">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import WInput from '../input/input.vue'
import { useGlobalSize } from '../../utils/prefix'
import { vClickOutside } from '../../directives/click-outside'
import { nextZIndex } from '../../hooks'
defineOptions({ name: 'WAutocomplete' })
const props = defineProps({ modelValue: String, placeholder: String, options: { type: Array as () => { label: string; value: string }[], default: () => [] }, clearable: { type: Boolean, default: true }, size: { type: String, default: undefined }, disabled: Boolean })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'select', 'clear'])
const inputValue = ref(props.modelValue || '')
const open = ref(false)
// 弹层层级：每次打开时取全局递增 z-index，保证后打开的弹层在上
const zIndex = ref(2000)
watch(open, (v) => { if (v) zIndex.value = nextZIndex() })
const filtered = computed(() => {
  if (!inputValue.value) return props.options.slice(0, 10)
  return props.options.filter(o => o.label.toLowerCase().includes(inputValue.value.toLowerCase())).slice(0, 10)
})
const handleInput = () => { emit('update:modelValue', inputValue.value); open.value = true }
const select = (item: any) => { inputValue.value = item.label; emit('update:modelValue', item.value); emit('select', item); open.value = false }
const close = () => { open.value = false }
const handleClear = () => { emit('update:modelValue', ''); emit('clear') }
</script>

<style scoped>
.w-autocomplete { position: relative; display: inline-block; }
.w-autocomplete__suggestions { position: absolute; top: 100%; left: 0; right: 0; z-index: var(--w-index-popper); background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); max-height: 200px; overflow-y: auto; }
.w-autocomplete__item { padding: 4px 8px; cursor: pointer; font-size: var(--w-font-size-base); line-height: 1.5; }
.w-autocomplete__item:hover { background: var(--w-xp-blue); color: #fff; }
.w-autocomplete--small .w-autocomplete__item { padding: 2px 6px; font-size: var(--w-font-size-small); }
.w-autocomplete--large .w-autocomplete__item { padding: 6px 10px; font-size: var(--w-font-size-medium); }
</style>
