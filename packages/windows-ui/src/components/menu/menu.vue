<template>
  <ul :class="['w-menu', `w-menu--${props.mode}`]">
    <li
      v-for="(item, i) in props.items"
      :key="i"
      :class="['w-menu__item', { 'is-active': activeIndex === i, 'is-open': openSet.has(i) }]"
      @click="handleClick(item, i)"
    >
      <div class="w-menu__title">
        <w-icon v-if="item.icon" :name="item.icon" size="small" />
        <span>{{ item.label }}</span>
        <w-icon v-if="item.children?.length" :name="openSet.has(i) ? 'arrowDown' : 'arrowRight'" size="small" class="w-menu__arrow" />
      </div>
      <ul v-if="item.children?.length && openSet.has(i)" class="w-menu__submenu">
        <li
          v-for="(child, ci) in item.children"
          :key="ci"
          :class="['w-menu__subitem', { 'is-active': subActive === `${i}-${ci}` }]"
          @click.stop="handleSubClick(child, `${i}-${ci}`)"
        >{{ child.label }}</li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WMenu' })
const props = defineProps({
  items: { type: Array as () => any[], default: () => [] },
  mode: { type: String, default: 'vertical' },
  defaultActive: [String, Number] as any
})
const emit = defineEmits(['select'])

const activeIndex = ref<number | null>(null)
const subActive = ref<string | null>(null)
const openSet = ref(new Set<number>())

const handleClick = (item: any, i: number) => {
  if (item.children?.length) { if (openSet.value.has(i)) openSet.value.delete(i); else openSet.value.add(i) }
  else { activeIndex.value = i; subActive.value = null; emit('select', item.value || item.label) }
}
const handleSubClick = (child: any, key: string) => {
  subActive.value = key
  emit('select', child.value || child.label)
}
</script>

<style scoped>
.w-menu { list-style: none; margin: 0; padding: 2px; background: var(--w-bg-color); border: 1px solid #808080; font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
.w-menu__item { cursor: pointer; }
.w-menu__title { display: flex; align-items: center; gap: 6px; padding: 4px 8px; }
.w-menu__title:hover { background: var(--w-xp-blue-light); color: #fff; }
.w-menu__item.is-active > .w-menu__title { background: var(--w-color-primary); color: #fff; }
.w-menu__arrow { margin-left: auto; }
.w-menu__submenu { list-style: none; padding: 0; background: #f0f0f0; }
.w-menu__subitem { padding: 4px 8px 4px 28px; }
.w-menu__subitem:hover { background: var(--w-xp-blue-light); color: #fff; }
.w-menu__subitem.is-active { background: var(--w-color-primary); color: #fff; }
.w-menu--horizontal { display: flex; }
.w-menu--horizontal .w-menu__item { position: relative; }
.w-menu--horizontal .w-menu__submenu { position: absolute; top: 100%; left: 0; min-width: 140px; border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); z-index: var(--w-index-popper); }
</style>
