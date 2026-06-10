<template>
  <ul :class="['w-menu', `w-menu--${props.mode}`, { 'w-menu--collapsed': props.collapse }]">
    <li
      v-for="(item, i) in props.items"
      :key="i"
      :class="['w-menu__item', { 'is-active': activeIndex === i || (subActive && subActive.startsWith(`${i}-`)), 'is-open': openSet.has(i) }]"
      @mouseenter="handleMouseEnter(i)"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove(i)"
    >
      <div class="w-menu__title" @click="handleClick(item, i)">
        <w-icon v-if="item.icon" :name="item.icon" size="small" />
        <span v-else class="w-menu__icon-placeholder">{{ item.label.charAt(0) }}</span>
        <span class="w-menu__label">{{ item.label }}</span>
        <w-icon v-if="item.children?.length && !props.collapse" :name="openSet.has(i) ? 'arrowDown' : 'arrowRight'" size="small" class="w-menu__arrow" />
      </div>
      <SubMenu
        v-if="item.children?.length && isSubmenuVisible(i)"
        :items="item.children"
        :parent-path="`${i}`"
        :level="0"
        :mode="props.mode"
        :collapse="props.collapse"
        :active-path="subActive"
        @select="handleSubSelect"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WIcon from '../icon/icon.vue'
import SubMenu from './sub-menu.vue'

defineOptions({ name: 'WMenu' })
const props = defineProps({
  items: { type: Array as () => any[], default: () => [] },
  mode: { type: String, default: 'vertical' },
  defaultActive: [String, Number] as any,
  collapse: Boolean
})
const emit = defineEmits(['select'])

const activeIndex = ref<number | null>(null)
const subActive = ref<string | undefined>(undefined)
const openSet = ref(new Set<number>())
const hoverIndex = ref<number | null>(null)

const isSubmenuVisible = (i: number) => {
  if (props.collapse) return hoverIndex.value === i
  return openSet.value.has(i)
}

const handleMouseEnter = (i: number) => {
  if (props.collapse) hoverIndex.value = i
}

const handleMouseLeave = () => {
  if (props.collapse) hoverIndex.value = null
}

const handleMouseMove = (i: number) => {
  if (props.collapse && hoverIndex.value !== i) {
    hoverIndex.value = i
  }
}

const handleClick = (item: any, i: number) => {
  if (item.children?.length) {
    if (props.collapse) return
    if (openSet.value.has(i)) openSet.value.delete(i)
    else openSet.value.add(i)
  } else {
    activeIndex.value = i
    subActive.value = undefined
    emit('select', item.value || item.label)
  }
}

const handleSubSelect = (value: string, path: string) => {
  subActive.value = path
  activeIndex.value = null
  emit('select', value)
  openSet.value.delete(parseInt(path.split('-')[0]))
  if (props.collapse) hoverIndex.value = null
}
</script>

<style scoped>
.w-menu { list-style: none; margin: 0; padding: 2px; background: var(--w-bg-color); border: 1px solid #808080; font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
.w-menu__item { cursor: pointer; position: relative; }
.w-menu__title { display: flex; align-items: center; gap: 6px; padding: 4px 8px; }
.w-menu__title:hover { background: var(--w-xp-blue-light); color: #fff; }
.w-menu__item.is-active > .w-menu__title { background: var(--w-color-primary); color: #fff; }
.w-menu__arrow { margin-left: auto; }

/* horizontal */
.w-menu--horizontal { display: flex; }
.w-menu--horizontal .w-menu__item { position: relative; }

/* collapsed */
.w-menu--collapsed { width: 48px; padding: 2px 0; }
.w-menu--collapsed .w-menu__title { justify-content: center; padding: 6px 0; gap: 0; }
.w-menu--collapsed .w-menu__label,
.w-menu--collapsed .w-menu__arrow { display: none; }
.w-menu--collapsed .w-menu__icon-placeholder { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; font-size: 12px; font-weight: bold; border-radius: 2px; background: var(--w-color-primary); color: #fff; }

/* vertical 模式下嵌套子菜单缩进 */
.w-menu--vertical :deep(.w-menu__submenu .w-menu__submenu) { padding-left: 16px; }
</style>
