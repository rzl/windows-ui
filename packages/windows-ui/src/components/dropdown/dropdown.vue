<template>
  <div class="w-dropdown" v-click-outside="close">
    <div class="w-dropdown__trigger" @click="open = !open">
      <slot name="trigger">
        <w-button>{{ triggerText }} <w-icon name="arrowDown" size="small" /></w-button>
      </slot>
    </div>
    <div v-show="open" class="w-dropdown__menu">
      <div
        v-for="(item, i) in items"
        :key="i"
        :class="['w-dropdown__item', { 'is-disabled': item.disabled }]"
        @click="handleClick(item)"
      >
        <w-icon v-if="item.icon" :name="item.icon" size="small" />
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WButton from '../button/button.vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WDropdown' })
const props = defineProps({
  items: { type: Array as () => { label: string; value?: any; icon?: string; disabled?: boolean }[], default: () => [] },
  triggerText: { type: String, default: '下拉菜单' }
})
const emit = defineEmits(['command'])

const open = ref(false)
const handleClick = (item: any) => { if (item.disabled) return; emit('command', item.value || item.label); open.value = false }
const close = () => { open.value = false }

const vClickOutside = {
  mounted(el: any, binding: any) { el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }; document.addEventListener('click', el._clickOutside) },
  unmounted(el: any) { document.removeEventListener('click', el._clickOutside) }
}
</script>

<style scoped>
.w-dropdown { position: relative; display: inline-block; }
.w-dropdown__menu { position: absolute; top: 100%; left: 0; z-index: var(--w-index-popper); min-width: 120px; background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); padding: 2px; }
.w-dropdown__item { display: flex; align-items: center; gap: 6px; padding: 4px 12px; cursor: pointer; font-size: var(--w-font-size-base); }
.w-dropdown__item:hover { background: var(--w-xp-blue); color: #fff; }
.w-dropdown__item.is-disabled { opacity: 0.5; cursor: not-allowed; }
</style>
