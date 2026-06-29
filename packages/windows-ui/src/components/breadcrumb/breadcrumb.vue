<template>
  <nav :class="['w-breadcrumb', `w-breadcrumb--${size}`]">
    <template v-if="items.length">
      <span
        v-for="(item, i) in items"
        :key="i"
        :class="['w-breadcrumb__item', { 'is-last': i === items.length - 1 }]"
      >
        <a v-if="resolveHref(item) && i < items.length - 1" :href="resolveHref(item)">{{ item.label }}</a>
        <span v-else>{{ item.label }}</span>
        <span v-if="i < items.length - 1" class="w-breadcrumb__separator">{{ separator }}</span>
      </span>
    </template>
    <slot v-else />
  </nav>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WBreadcrumb' })
const props = defineProps({
  items: { type: Array as () => { label: string; href?: string; to?: string | { path?: string; name?: string; [k: string]: any } }[], default: () => [] },
  separator: { type: String, default: '>' },
  size: { type: String, default: undefined }
})

const resolveHref = (item: { href?: string; to?: string | object }) => {
  if (!item.href && !item.to) return undefined
  if (item.href) return item.href
  if (typeof item.to === 'string') return item.to
  if (item.to && typeof item.to === 'object') return (item.to as any).path || '#'
  return undefined
}
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
provide('breadcrumb', { separator: computed(() => props.separator) })
</script>

<style scoped>
.w-breadcrumb { display: flex; align-items: center; flex-wrap: wrap; font-size: var(--w-font-size-base); color: var(--w-text-color-secondary); }
.w-breadcrumb__item a { color: var(--w-color-primary); text-decoration: none; }
.w-breadcrumb__item a:hover { text-decoration: underline; }
.w-breadcrumb__item.is-last { color: var(--w-text-color-primary); font-weight: bold; }
.w-breadcrumb__separator { margin: 0 6px; color: #c0c0c0; }
.w-breadcrumb--small { font-size: var(--w-font-size-small); }
.w-breadcrumb--large { font-size: var(--w-font-size-medium); }
</style>