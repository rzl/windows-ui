<template>
  <div class="w-autocomplete" v-click-outside="close">
    <w-input v-model="inputValue" :placeholder="placeholder" @focus="open = true" @input="handleInput" />
    <div v-show="open && filtered.length" class="w-autocomplete__suggestions">
      <div v-for="item in filtered" :key="item.value" class="w-autocomplete__item" @click="select(item)">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WInput from '../input/input.vue'
defineOptions({ name: 'WAutocomplete' })
const props = defineProps({ modelValue: String, placeholder: String, options: { type: Array as () => { label: string; value: string }[], default: () => [] } })
const emit = defineEmits(['update:modelValue', 'select'])
const inputValue = ref(props.modelValue || '')
const open = ref(false)
const filtered = computed(() => {
  if (!inputValue.value) return props.options.slice(0, 10)
  return props.options.filter(o => o.label.toLowerCase().includes(inputValue.value.toLowerCase())).slice(0, 10)
})
const handleInput = (e: Event) => { inputValue.value = (e.target as HTMLInputElement).value; emit('update:modelValue', inputValue.value); open.value = true }
const select = (item: any) => { inputValue.value = item.label; emit('update:modelValue', item.value); emit('select', item); open.value = false }
const close = () => { open.value = false }
const vClickOutside = { mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) }, unmounted(el: any) { document.removeEventListener('click', el._clickOutside) } }
</script>

<style scoped>
.w-autocomplete { position: relative; display: inline-block; }
.w-autocomplete__suggestions { position: absolute; top: 100%; left: 0; right: 0; z-index: var(--w-index-popper); background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); max-height: 200px; overflow-y: auto; }
.w-autocomplete__item { padding: 4px 8px; cursor: pointer; font-size: var(--w-font-size-base); }
.w-autocomplete__item:hover { background: var(--w-xp-blue); color: #fff; }
</style>
