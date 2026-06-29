<template>
  <div :class="['w-dropdown', `w-dropdown--${size}`]" v-click-outside="close">
    <div class="w-dropdown__trigger" @click="open = !open">
      <slot name="trigger">
        <w-button :size="size">{{ triggerText }} <w-icon name="arrowDown" :size="size" /></w-button>
      </slot>
    </div>
    <div v-show="open" class="w-dropdown__menu">
      <template v-if="items.length">
        <div
          v-for="(item, i) in items"
          :key="i"
          :class="['w-dropdown__item', { 'is-disabled': item.disabled }]"
          @click="handleClick(item)"
        >
          <w-icon v-if="item.icon" :name="item.icon" :size="size" />
          {{ item.label }}
        </div>
      </template>
      <slot v-else name="dropdown" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import WButton from '../button/button.vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WDropdown' })
const props = defineProps({
  items: { type: Array as () => { label: string; value?: any; icon?: string; disabled?: boolean }[], default: () => [] },
  triggerText: { type: String, default: '下拉菜单' },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['command'])

const open = ref(false)
const handleCommand = (command: any) => { emit('command', command); open.value = false }
const handleClick = (item: any) => { if (item.disabled) return; handleCommand(item.value || item.label) }
const close = () => { open.value = false }

provide('dropdown', {
  size,
  handleCommand
})

const vClickOutside = {
  mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) },
  unmounted(el: any) { document.removeEventListener('click', el._clickOutside) }
}
</script>

<style scoped>
.w-dropdown { position: relative; display: inline-block; }
.w-dropdown__menu { position: absolute; top: 100%; left: 0; z-index: var(--w-index-popper); min-width: 120px; background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); padding: 2px; }
.w-dropdown__item { display: flex; align-items: center; gap: 6px; padding: 4px 12px; cursor: pointer; font-size: var(--w-font-size-base); line-height: 1.5; }
.w-dropdown__item:hover { background: var(--w-xp-blue); color: #fff; }
.w-dropdown--small .w-dropdown__item { padding: 2px 10px; font-size: var(--w-font-size-small); }
.w-dropdown--large .w-dropdown__item { padding: 6px 14px; font-size: var(--w-font-size-medium); }
.w-dropdown__item.is-disabled { opacity: 0.5; cursor: not-allowed; }
</style>
