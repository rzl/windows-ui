<template>
  <div :class="['w-descriptions', `w-descriptions--${size}`, { 'w-descriptions--border': border }]">
    <div v-if="title" class="w-descriptions__title">{{ title }}</div>
    <table class="w-descriptions__table" :class="{ 'w-descriptions__table--border': border }">
      <tbody>
        <tr v-for="(row, ri) in rows" :key="ri">
          <td v-for="(cell, ci) in row" :key="ci" class="w-descriptions__cell">
            <span class="w-descriptions__label">{{ cell.label }}</span>
            <span class="w-descriptions__value">
              <component v-if="cell.render" :is="cell.render" />
              <template v-else>{{ cell.value }}</template>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

interface DescriptionItem {
  label?: string
  value?: any
  prop?: string
  render?: () => any
}

defineOptions({ name: 'WDescriptions' })

const props = defineProps({
  title: String,
  items: { type: Array as () => { label: string; value?: any; prop?: string }[], default: () => [] },
  column: { type: Number, default: 3 },
  border: Boolean,
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)

const slots = useSlots()

const normalizedItems = computed<DescriptionItem[]>(() => {
  if (props.items && props.items.length > 0) {
    return props.items.map((item) => ({ ...item, render: undefined }))
  }

  const defaultSlot = slots.default?.()
  if (!defaultSlot) return []

  return defaultSlot
    .filter((vnode) => typeof vnode.type === 'object' && (vnode.type as any).name === 'WDescriptionsItem')
    .map((vnode) => ({
      label: vnode.props?.label || '',
      prop: vnode.props?.prop,
      value: undefined,
      render: () => {
        const children = vnode.children as any
        return children?.default?.() || null
      }
    }))
})

const rows = computed(() => {
  const rows: DescriptionItem[][] = []
  for (let i = 0; i < normalizedItems.value.length; i += props.column) {
    rows.push(normalizedItems.value.slice(i, i + props.column))
  }
  return rows
})
</script>

<style scoped>
.w-descriptions { background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; padding: 8px; }
.w-descriptions__title { font-weight: bold; font-size: var(--w-font-size-medium); margin-bottom: 8px; color: var(--w-color-primary); }
.w-descriptions__table { width: 100%; border-collapse: collapse; }
.w-descriptions__cell { padding: 6px 8px; border: 1px solid #d4d0c8; }
.w-descriptions__label { color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); display: block; margin-bottom: 2px; }
.w-descriptions__value { color: var(--w-text-color-primary); font-size: var(--w-font-size-base); }
.w-descriptions--border .w-descriptions__table--border { border: 1px solid #d4d0c8; }
.w-descriptions--border .w-descriptions__cell { border: 1px solid #d4d0c8; }
.w-descriptions--small .w-descriptions__title { font-size: var(--w-font-size-small); }
.w-descriptions--small .w-descriptions__label { font-size: var(--w-font-size-extra-small); }
.w-descriptions--small .w-descriptions__value { font-size: var(--w-font-size-small); }
.w-descriptions--large .w-descriptions__title { font-size: var(--w-font-size-large); }
.w-descriptions--large .w-descriptions__label { font-size: var(--w-font-size-base); }
.w-descriptions--large .w-descriptions__value { font-size: var(--w-font-size-medium); }
</style>
