<template>
  <ul :class="[
    'w-menu__submenu',
    {
      'w-menu__submenu--popup-h': isPopup && props.mode === 'horizontal' && props.level === 0,
      'w-menu__submenu--popup-c': isPopup && props.collapse && props.level === 0,
      'w-menu__submenu--popup': isPopup && props.level > 0,
      [`w-menu__submenu--level-${props.level}`]: true
    }
  ]">
    <li
      v-for="(item, i) in props.items"
      :key="i"
      :class="['w-menu__subitem', { 'is-active': isActive(i), 'is-open': isOpen(i) }]"
      @mouseenter="handleMouseEnter(i)"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove(i)"
    >
      <div class="w-menu__sub-title" @click.stop="handleClick(item, i)">
        <span>{{ item.label }}</span>
        <w-icon v-if="item.children?.length && !isPopup" :name="isOpen(i) ? 'arrowDown' : 'arrowRight'" :size="size" class="w-menu__arrow" />
        <w-icon v-else-if="item.children?.length" :name="isOpen(i) ? 'arrowDown' : 'arrowRight'" :size="size" class="w-menu__arrow" />
      </div>
      <SubMenu
        v-if="item.children?.length && isSubmenuVisible(i)"
        :items="item.children"
        :parent-path="`${props.parentPath}-${i}`"
        :level="props.level + 1"
        :mode="props.mode"
        :collapse="props.collapse"
        :active-path="props.activePath"
        :size="size"
        @select="(val: string, path: string) => emit('select', val, path)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed, inject, type Ref } from 'vue'
import WIcon from '../icon/icon.vue'
import SubMenu from './sub-menu.vue'

defineOptions({ name: 'WSubMenu' })

const props = defineProps({
  items: { type: Array as () => any[], default: () => [] },
  parentPath: { type: String, default: '' },
  level: { type: Number, default: 0 },
  mode: { type: String, default: 'vertical' },
  collapse: Boolean,
  activePath: { type: String, default: '' },
  size: { type: String, default: undefined }
})
const injectedSize = inject<Ref<string>>('menuSize')
const size = computed(() => props.size || injectedSize?.value || 'default')

const emit = defineEmits(['select'])

const openSet = ref(new Set<number>())
const hoverIndex = ref<number | null>(null)

const isPopup = computed(() => props.mode === 'horizontal' || props.collapse)

const isOpen = (i: number) => {
  if (isPopup.value) return hoverIndex.value === i
  return openSet.value.has(i)
}

const isSubmenuVisible = (i: number) => isOpen(i)

const isActive = (i: number) => {
  const currentPath = `${props.parentPath}-${i}`
  return props.activePath === currentPath || (props.activePath && props.activePath.startsWith(`${currentPath}-`))
}

const handleMouseEnter = (i: number) => {
  if (isPopup.value) hoverIndex.value = i
}

const handleMouseLeave = () => {
  if (isPopup.value) hoverIndex.value = null
}

const handleMouseMove = (i: number) => {
  if (isPopup.value && hoverIndex.value !== i) {
    hoverIndex.value = i
  }
}

const handleClick = (item: any, i: number) => {
  if (item.children?.length) {
    if (isPopup.value) return
    if (openSet.value.has(i)) openSet.value.delete(i)
    else openSet.value.add(i)
  } else {
    if (isPopup.value) hoverIndex.value = null
    emit('select', item.value || item.label, `${props.parentPath}-${i}`)
  }
}
</script>

<style scoped>
.w-menu__submenu { list-style: none; padding: 0; margin: 0; background: #f0f0f0; }
.w-menu__subitem { cursor: pointer; position: relative; }
.w-menu__sub-title { display: flex; align-items: center; gap: 6px; padding: 4px 8px 4px 28px; }
.w-menu__sub-title:hover { background: var(--w-xp-blue-light); color: #fff; }
.w-menu__subitem.is-active > .w-menu__sub-title { background: var(--w-color-primary); color: #fff; }
.w-menu__subitem .w-menu__arrow { margin-left: auto; }

/* popup 定位 */
.w-menu__submenu--popup-h { position: absolute; top: 100%; left: 0; min-width: 140px; border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); z-index: var(--w-index-popper); background: var(--w-bg-color); padding: 2px 0; }
.w-menu__submenu--popup-c { position: absolute; left: 100%; top: 0; min-width: 140px; border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); z-index: var(--w-index-popper); background: var(--w-bg-color); padding: 2px 0; }
.w-menu__submenu--popup { position: absolute; top: 0; left: 100%; min-width: 140px; border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); z-index: var(--w-index-popper); background: var(--w-bg-color); padding: 2px 0; }

/* popup 模式下的子菜单项 padding */
.w-menu__submenu--popup-h .w-menu__sub-title,
.w-menu__submenu--popup-c .w-menu__sub-title,
.w-menu__submenu--popup .w-menu__sub-title { padding: 4px 12px; }

/* 不同层级背景色区分 */
.w-menu__submenu--level-1 { background: #e8e8e8; }
.w-menu__submenu--level-2 { background: #e0e0e0; }
.w-menu__submenu--level-3 { background: #d8d8d8; }
</style>
