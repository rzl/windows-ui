<template>
  <div :class="['w-tree-select', `w-tree-select--${size}`]" v-click-outside="close">
    <div class="w-tree-select__trigger" @click="open = !open">
      <span v-if="selectedLabel">{{ selectedLabel }}</span>
      <span v-else class="w-tree-select__placeholder">{{ placeholder }}</span>
      <div class="w-tree-select__icons">
        <w-icon v-if="clearable && selectedLabel" name="close" :size="size" class="w-tree-select__clear" @click.stop="handleClear" />
        <w-icon name="arrowDown" :size="size" />
      </div>
    </div>
    <div v-show="open" class="w-tree-select__dropdown" :style="{ zIndex }"><w-tree :data="data" :expand-all="expandAll" @node-click="handleNodeClick" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import WIcon from '../icon/icon.vue'
import WTree from '../tree/tree.vue'
import { useGlobalSize } from '../../utils/prefix'
import { vClickOutside } from '../../directives/click-outside'
import { nextZIndex } from '../../hooks'
defineOptions({ name: 'WTreeSelect' })
const props = defineProps({ modelValue: [String, Number] as any, data: { type: Array as () => any[], default: () => [] }, placeholder: { type: String, default: '请选择' }, expandAll: Boolean, clearable: { type: Boolean, default: true }, size: { type: String, default: undefined } })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'change', 'clear'])
const open = ref(false)
// 弹层层级：每次打开时取全局递增 z-index，保证后打开的弹层在上
const zIndex = ref(2000)
watch(open, (v) => { if (v) zIndex.value = nextZIndex() })
const findLabel = (data: any[], value: any): string | undefined => { for (const item of data) { if (item.value === value) return item.label; if (item.children) { const found = findLabel(item.children, value); if (found) return found } } return undefined }
const selectedLabel = computed(() => findLabel(props.data, props.modelValue))
const handleNodeClick = (node: any) => { emit('update:modelValue', node.value); emit('change', node.value); open.value = false }
const close = () => { open.value = false }
const handleClear = () => { emit('update:modelValue', undefined); emit('change', undefined); emit('clear') }
</script>

<style scoped>
.w-tree-select { position: relative; display: inline-block; min-width: 160px; }
.w-tree-select__trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; box-sizing: border-box; padding: 2px 4px; border: 1px solid var(--w-xp-input-border); background: var(--w-bg-color); cursor: pointer; font-family: var(--w-font-family); font-size: var(--w-font-size-base); height: var(--w-component-size); }
.w-tree-select--small .w-tree-select__trigger { padding: 1px 2px; height: var(--w-component-size-small); font-size: var(--w-font-size-small); }
.w-tree-select--large .w-tree-select__trigger { padding: 4px 6px; height: var(--w-component-size-large); font-size: var(--w-font-size-medium); }
.w-tree-select__placeholder { color: var(--w-text-color-placeholder); }
.w-tree-select__dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: var(--w-index-popper); background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); max-height: 240px; overflow-y: auto; }
.w-tree-select__icons { display: flex; align-items: center; gap: 4px; }
.w-tree-select__clear { cursor: pointer; }
</style>
