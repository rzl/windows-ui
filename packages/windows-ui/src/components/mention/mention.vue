<template>
  <div class="w-mention" v-click-outside="close">
    <w-input v-model="inputValue" :placeholder="placeholder" :clearable="clearable" @input="handleInput" @keydown="handleKeydown" @clear="handleClear" />
    <div v-show="open && filtered.length" class="w-mention__list">
      <div v-for="item in filtered" :key="item.value" :class="['w-mention__item', { 'is-active': item.value === activeValue }]" @click="select(item)">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WInput from '../input/input.vue'

defineOptions({ name: 'WMention' })
const props = defineProps({
  modelValue: String,
  placeholder: String,
  prefix: { type: String, default: '@' },
  options: { type: Array as () => { label: string; value: string }[], default: () => [] },
  clearable: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue', 'select', 'clear'])

const inputValue = ref(props.modelValue || '')
const open = ref(false)
const activeValue = ref('')
const prefixIndex = ref(-1)

const filtered = computed(() => {
  if (prefixIndex.value === -1) return []
  const query = inputValue.value.slice(prefixIndex.value + 1).toLowerCase()
  return props.options.filter(o => o.label.toLowerCase().includes(query)).slice(0, 8)
})

const handleInput = (v: string) => {
  inputValue.value = v
  emit('update:modelValue', v)
  const idx = inputValue.value.lastIndexOf(props.prefix)
  if (idx !== -1) { prefixIndex.value = idx; open.value = true }
  else { prefixIndex.value = -1; open.value = false }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!open.value) return
  if (e.key === 'Enter' && activeValue.value) { e.preventDefault(); const item = props.options.find(o => o.value === activeValue.value); if (item) select(item) }
  else if (e.key === 'ArrowDown') { e.preventDefault(); const idx = filtered.value.findIndex(o => o.value === activeValue.value); activeValue.value = filtered.value[(idx + 1) % filtered.value.length]?.value || '' }
  else if (e.key === 'ArrowUp') { e.preventDefault(); const idx = filtered.value.findIndex(o => o.value === activeValue.value); activeValue.value = filtered.value[(idx - 1 + filtered.value.length) % filtered.value.length]?.value || '' }
  else if (e.key === 'Escape') { open.value = false }
}

const select = (item: any) => {
  const before = inputValue.value.slice(0, prefixIndex.value)
  inputValue.value = before + props.prefix + item.label + ' '
  emit('update:modelValue', inputValue.value)
  emit('select', item)
  open.value = false
  prefixIndex.value = -1
}
const close = () => { open.value = false }
const handleClear = () => { emit('update:modelValue', ''); emit('clear') }

const vClickOutside = {
  mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) },
  unmounted(el: any) { document.removeEventListener('click', el._clickOutside) }
}
</script>

<style scoped>
.w-mention { position: relative; display: inline-block; }
.w-mention__list { position: absolute; top: 100%; left: 0; right: 0; z-index: var(--w-index-popper); background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
.w-mention__item { padding: 4px 8px; cursor: pointer; font-size: var(--w-font-size-base); }
.w-mention__item:hover, .w-mention__item.is-active { background: var(--w-xp-blue); color: #fff; }
</style>
