<template>
  <div class="items-list-editor">
    <table v-if="items.length" class="items-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          <th class="actions-header">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
          :class="{ 'has-error': !!getRowError(item, index) }"
        >
          <td v-for="col in columns" :key="col.key">
            <component
              :is="col.type === 'number' ? inputNumberTag : inputTag"
              :size="controlSize"
              :model-value="item[col.key]"
              @update:model-value="(v: any) => updateItem(index, col.key, v)"
            />
          </td>
          <td class="actions-cell">
            <component
              :is="buttonTag"
              :size="controlSize"
              icon="arrowUp"
              title="上移"
              @click="moveItem(index, -1)"
            />
            <component
              :is="buttonTag"
              :size="controlSize"
              icon="arrowDown"
              title="下移"
              @click="moveItem(index, 1)"
            />
            <component
              :is="buttonTag"
              :size="controlSize"
              type="danger"
              icon="delete"
              title="删除"
              @click="removeItem(index)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="errorMessages.length" class="items-error">
      {{ errorMessages.join('；') }}
    </div>
    <component :is="buttonTag" :size="controlSize" class="add-btn" @click="addItem">+ 添加标签</component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrefix, useGlobalSize } from '../../utils/prefix'
import type { PropertySchemaColumn } from './types'

defineOptions({ name: 'WItemsListEditor' })

const props = defineProps<{
  modelValue: any[]
  columns: PropertySchemaColumn[]
  size?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
}>()

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const inputTag = withPrefix('input')
const inputNumberTag = withPrefix('input-number')
const buttonTag = withPrefix('button')

const controlSize = computed(() => props.size || globalSize.value)

const items = computed({
  get: () => props.modelValue || [],
  set: (val) => emit('update:modelValue', val)
})

function updateItem(index: number, key: string, value: any) {
  const next = [...items.value]
  next[index] = { ...next[index], [key]: value }
  items.value = next
}

function addItem() {
  const newItem: any = {}
  props.columns.forEach((col) => {
    newItem[col.key] = col.type === 'number' ? 0 : ''
  })

  // 若存在 name 列，自动生成不重复的标识
  if (props.columns.some((col) => col.key === 'name')) {
    const prefix = 'tab'
    let idx = items.value.length + 1
    while (items.value.some((item) => item.name === `${prefix}${idx}`)) {
      idx++
    }
    newItem.name = `${prefix}${idx}`
  }

  items.value = [...items.value, newItem]
}

function removeItem(index: number) {
  const next = [...items.value]
  next.splice(index, 1)
  items.value = next
}

function moveItem(index: number, direction: -1 | 1) {
  const next = [...items.value]
  const target = index + direction
  if (target < 0 || target >= next.length) return
  const temp = next[index]
  next[index] = next[target]
  next[target] = temp
  items.value = next
}

function getRowError(item: any, index: number): string {
  const nameCol = props.columns.find((col) => col.key === 'name')
  if (!nameCol) return ''

  const name = item.name
  if (!name || String(name).trim() === '') {
    return `第 ${index + 1} 行标识不能为空`
  }
  const duplicate = items.value.some((it, i) => i !== index && it.name === name)
  if (duplicate) {
    return `第 ${index + 1} 行标识重复`
  }
  return ''
}

const errorMessages = computed(() => {
  return items.value
    .map((item, index) => getRowError(item, index))
    .filter(Boolean)
})
</script>

<style scoped>
.items-list-editor {
  width: 100%;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.items-table th,
.items-table td {
  border: 1px solid var(--w-border-color);
  padding: 4px;
  text-align: left;
  vertical-align: middle;
}

.items-table th {
  background: var(--w-fill-color-light);
  font-weight: normal;
  color: var(--w-text-color-regular);
}

.items-table tr.has-error td {
  background: rgba(255, 0, 0, 0.05);
}

.actions-header {
  width: 1%;
  white-space: nowrap;
}

.actions-cell {
  white-space: nowrap;
  text-align: center;
}

.actions-cell :deep(.w-button) {
  margin-right: 4px;
}

.actions-cell :deep(.w-button):last-child {
  margin-right: 0;
}

.items-error {
  color: var(--w-color-danger);
  font-size: 12px;
  margin-top: 6px;
}

.add-btn {
  margin-top: 8px;
}
</style>
