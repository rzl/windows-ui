<template>
  <ul :class="['w-menu', `w-menu--${props.mode}`, `w-menu--${size}`, { 'w-menu--collapsed': props.collapse }]">
    <li
      v-for="(item, i) in props.items"
      :key="i"
      :class="['w-menu__item', { 'is-active': activeIndex === i || (subActive && subActive.startsWith(`${i}-`)), 'is-open': openSet.has(i) }]"
      @mouseenter="handleMouseEnter(i)"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove(i)"
    >
      <div class="w-menu__title" @click="handleClick(item, i)">
        <w-icon v-if="item.icon" :name="item.icon" :size="size" />
        <span v-else class="w-menu__icon-placeholder">{{ item.label.charAt(0) }}</span>
        <span class="w-menu__label">{{ item.label }}</span>
        <w-icon v-if="item.children?.length && !props.collapse" :name="openSet.has(i) ? 'arrowDown' : 'arrowRight'" :size="size" class="w-menu__arrow" />
      </div>
      <SubMenu
        v-if="item.children?.length && isSubmenuVisible(i)"
        :items="item.children"
        :parent-path="`${i}`"
        :level="0"
        :mode="props.mode"
        :collapse="props.collapse"
        :active-path="subActive"
        :size="size"
        @select="handleSubSelect"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue'
import WIcon from '../icon/icon.vue'
import SubMenu from './sub-menu.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WMenu' })
const props = defineProps({
  items: { type: Array as () => any[], default: () => [] },
  mode: { type: String, default: 'vertical' },
  defaultActive: [String, Number] as any,
  collapse: Boolean,
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
provide('menuSize', size)
const emit = defineEmits(['select'])

const resolveDefaultActive = () => {
  const v = props.defaultActive
  if (v === undefined || v === null) return { index: null as number | null, sub: undefined as string | undefined }
  if (typeof v === 'number') return { index: v, sub: undefined }
  if (typeof v === 'string' && v.includes('-')) return { index: null, sub: v }
  const num = Number(v)
  if (!isNaN(num)) return { index: num, sub: undefined }
  return { index: null, sub: undefined }
}
const { index: defaultIndex, sub: defaultSub } = resolveDefaultActive()
const activeIndex = ref<number | null>(defaultIndex)
const subActive = ref<string | undefined>(defaultSub)
const openSet = ref(new Set<number>())
const hoverIndex = ref<number | null>(null)

// default-active 为菜单 value（如路由路径）时，在树中递归查找并解析为索引链，
// 用于初始进入/刷新页面时自动高亮叶子并逐级展开所在分组
function findActiveChain(items: any[], value: string, prefix = ''): string | null {
  for (let i = 0; i < items.length; i++) {
    const path = prefix ? `${prefix}-${i}` : `${i}`
    const item = items[i]
    if ((item.value ?? item.label) === value) return path
    if (item.children?.length) {
      const found = findActiveChain(item.children, value, path)
      if (found) return found
    }
  }
  return null
}

function syncDefaultActive() {
  const v = props.defaultActive
  // 数字与索引链形式沿用初始化行为；仅处理路径等普通字符串
  if (typeof v !== 'string' || !v || v.includes('-') || !isNaN(Number(v))) return
  const chain = findActiveChain(props.items, v)
  if (!chain) return
  if (chain.includes('-')) {
    activeIndex.value = null
    subActive.value = chain
    openSet.value.add(Number(chain.split('-')[0]))
  } else {
    activeIndex.value = Number(chain)
    subActive.value = undefined
  }
}

watch([() => props.defaultActive, () => props.items], syncDefaultActive, { immediate: true })

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
  if (props.collapse || props.mode === 'horizontal') {
    openSet.value.clear()
    if (props.collapse) hoverIndex.value = null
  }
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

/* size */
.w-menu--small { font-size: var(--w-font-size-small); }
.w-menu--small .w-menu__title { padding: 2px 6px; }
.w-menu--small :deep(.w-menu__sub-title) { padding: 2px 6px 2px 24px; }
.w-menu--small :deep(.w-menu__submenu--popup-h .w-menu__sub-title),
.w-menu--small :deep(.w-menu__submenu--popup-c .w-menu__sub-title),
.w-menu--small :deep(.w-menu__submenu--popup .w-menu__sub-title) { padding: 2px 10px; }
.w-menu--large { font-size: var(--w-font-size-medium); }
.w-menu--large .w-menu__title { padding: 6px 10px; }
.w-menu--large :deep(.w-menu__sub-title) { padding: 6px 10px 6px 32px; }
.w-menu--large :deep(.w-menu__submenu--popup-h .w-menu__sub-title),
.w-menu--large :deep(.w-menu__submenu--popup-c .w-menu__sub-title),
.w-menu--large :deep(.w-menu__submenu--popup .w-menu__sub-title) { padding: 6px 14px; }
</style>
