<template>
  <div class="w-virtualized-select" v-click-outside="close">
    <div class="w-virtualized-select__trigger" @click="open = !open">
      <span v-if="selectedLabel">{{ selectedLabel }}</span>
      <span v-else class="w-virtualized-select__placeholder">{{ placeholder }}</span>
      <w-icon name="arrowDown" size="small" />
    </div>
    <div v-show="open" class="w-virtualized-select__dropdown">
      <div class="w-virtualized-select__viewport" :style="{ height: `${itemHeight * Math.min(visibleCount, totalItems)}px` }" @scroll="handleScroll">
        <div class="w-virtualized-select__list" :style="{ height: `${totalItems * itemHeight}px`, transform: `translateY(${startIndex * itemHeight}px)` }">
          <div v-for="opt in visibleOptions" :key="opt.value" :class="['w-virtualized-select__option', { 'is-selected': modelValue === opt.value }]" :style="{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }" @click="select(opt)">{{ opt.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WVirtualizedSelect' })
const props = defineProps({
  modelValue: [String, Number] as any,
  options: { type: Array as () => { label: string; value: any }[], default: () => [] },
  placeholder: { type: String, default: '请选择' },
  itemHeight: { type: Number, default: 28 },
  visibleCount: { type: Number, default: 8 }
})
const emit = defineEmits(['update:modelValue', 'change'])

const open = ref(false)
const scrollTop = ref(0)
const selectedLabel = computed(() => props.options.find(o => o.value === props.modelValue)?.label)
const totalItems = computed(() => props.options.length)
const startIndex = computed(() => Math.floor(scrollTop.value / props.itemHeight))
const visibleOptions = computed(() => props.options.slice(startIndex.value, startIndex.value + props.visibleCount + 1))
const select = (opt: any) => { emit('update:modelValue', opt.value); emit('change', opt.value); open.value = false }
const close = () => { open.value = false }
const handleScroll = (e: Event) => { scrollTop.value = (e.target as HTMLDivElement).scrollTop }

const vClickOutside = {
  mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) },
  unmounted(el: any) { document.removeEventListener('click', el._clickOutside) }
}
</script>

<style scoped>
.w-virtualized-select { position: relative; display: inline-block; min-width: 120px; }
.w-virtualized-select__trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 3px 8px; border: 1px solid #7f9db9; background: #fff; cursor: pointer; font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
.w-virtualized-select__placeholder { color: var(--w-text-color-placeholder); }
.w-virtualized-select__dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: var(--w-index-popper); background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
.w-virtualized-select__viewport { overflow-y: auto; }
.w-virtualized-select__option { padding: 0 8px; cursor: pointer; font-size: var(--w-font-size-base); }
.w-virtualized-select__option:hover, .w-virtualized-select__option.is-selected { background: var(--w-xp-blue); color: #fff; }
</style>
