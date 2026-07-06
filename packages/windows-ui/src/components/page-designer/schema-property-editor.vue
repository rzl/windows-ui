<template>
  <div class="schema-property-editor">
    <template v-for="(field, index) in normalizedSchema" :key="field.key + index">
      <div v-if="field.group && showGroupTitle(field, index)" class="section-title">
        {{ field.group }}
      </div>
      <component
        :is="formItemTag"
        :label="field.label"
        :label-width="80"
      >
        <!-- 文本输入 -->
        <component
          :is="inputTag"
          v-if="field.type === 'input'"
          :size="controlSize"
          :model-value="getFieldValue(field)"
          :placeholder="field.placeholder || ''"
          @update:model-value="(v: any) => setValue(field.key, v)"
        />

        <!-- 多行文本 -->
        <component
          :is="inputTag"
          v-else-if="field.type === 'textarea'"
          :size="controlSize"
          :model-value="getFieldValue(field)"
          :placeholder="field.placeholder || ''"
          type="textarea"
          :rows="field.rows || 3"
          @update:model-value="(v: any) => setValue(field.key, v)"
        />

        <!-- 数字 -->
        <component
          :is="inputNumberTag"
          v-else-if="field.type === 'number'"
          :size="controlSize"
          :model-value="getFieldValue(field)"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          @update:model-value="(v: any) => setValue(field.key, v)"
        />

        <!-- 滑块 -->
        <component
          :is="sliderTag"
          v-else-if="field.type === 'slider'"
          :size="controlSize"
          :model-value="getFieldValue(field)"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          @update:model-value="(v: any) => setValue(field.key, v)"
        />

        <!-- 下拉选择 -->
        <component
          :is="selectTag"
          v-else-if="field.type === 'select'"
          :size="controlSize"
          :model-value="getFieldValue(field)"
          :options="field.options || []"
          :placeholder="field.placeholder || '请选择'"
          @update:model-value="(v: any) => setValue(field.key, v)"
        />

        <!-- 开关 -->
        <component
          :is="switchTag"
          v-else-if="field.type === 'switch'"
          :size="controlSize"
          :model-value="!!getFieldValue(field)"
          @update:model-value="(v: any) => setValue(field.key, v)"
        />

        <!-- 颜色选择 -->
        <component
          :is="colorPickerTag"
          v-else-if="field.type === 'color'"
          :size="controlSize"
          :model-value="getFieldValue(field)"
          @update:model-value="(v: any) => setValue(field.key, v)"
        />

        <!-- JSON / 选项 / 数组 -->
        <component
          :is="inputTag"
          v-else-if="['json', 'options', 'items'].includes(field.type)"
          :size="controlSize"
          :model-value="jsonGetValue(field.key)"
          :placeholder="field.placeholder || '请输入 JSON 数组或对象'"
          type="textarea"
          :rows="field.rows || 4"
          @update:model-value="(v: any) => jsonSetValue(field.key, v)"
        />

        <!-- 数据源 -->
        <data-source-editor
          v-else-if="field.type === 'dataSource'"
          :model-value="getFieldValue(field)"
          :size="controlSize"
          @update:model-value="(v: any) => setValue(field.key, v)"
        />

        <!-- 事件 -->
        <event-editor
          v-else-if="field.type === 'events'"
          :model-value="getFieldValue(field)"
          :size="controlSize"
          @update:model-value="(v: any) => setValue(field.key, v)"
        />
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DataSourceEditor from './data-source-editor.vue'
import EventEditor from './event-editor.vue'
import { usePrefix, useGlobalSize } from '../../utils/prefix'
import type { PageNode, PropertySchemaField } from './types'

defineOptions({ name: 'WSchemaPropertyEditor' })

const props = defineProps<{
  node: PageNode
  schema: PropertySchemaField[]
  size?: string
}>()

const emit = defineEmits<{
  (e: 'update', node: PageNode): void
}>()

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const formItemTag = withPrefix('form-item')
const inputTag = withPrefix('input')
const selectTag = withPrefix('select')
const inputNumberTag = withPrefix('input-number')
const switchTag = withPrefix('switch')
const colorPickerTag = withPrefix('color-picker')
const sliderTag = withPrefix('slider')

const controlSize = computed(() => props.size || globalSize.value)

/** schema 字段列表，仅用于按 group 渲染标题 */
const normalizedSchema = computed(() => props.schema)

function showGroupTitle(field: PropertySchemaField, index: number): boolean {
  if (!field.group) return false
  if (index === 0) return true
  return props.schema[index - 1]?.group !== field.group
}

const topLevelKeys = new Set(['dataSource', 'events', 'option'])

function getValueByPath(node: PageNode, path: string): any {
  const keys = path.split('.')
  let target: any = node
  for (const key of keys) {
    if (target == null) return undefined
    target = target[key]
  }
  return target
}

function getFieldValue(field: PropertySchemaField): any {
  const value = getValueByPath(props.node, field.key)
  if (value === undefined && field.default !== undefined) {
    return field.default
  }
  return value
}

function setValueByPath(node: PageNode, path: string, value: any) {
  const keys = path.split('.')
  const first = keys.shift()!
  // 顶层字段直接赋值
  if (topLevelKeys.has(first) && keys.length === 0) {
    ;(node as any)[first] = value
    emit('update', node)
    return
  }
  let target: any = node[first as keyof PageNode]
  if (target === undefined) {
    target = {}
    ;(node as any)[first] = target
  }
  const last = keys.pop()!
  for (const key of keys) {
    if (target[key] === undefined) target[key] = {}
    target = target[key]
  }
  target[last] = value
  emit('update', node)
}

function setValue(path: string, value: any) {
  setValueByPath(props.node, path, value)
}

function jsonGetValue(path: string): string {
  const value = getValueByPath(props.node, path)
  return JSON.stringify(value ?? (path.includes('options') || path.includes('items') ? [] : {}), null, 2)
}

function jsonSetValue(path: string, text: string) {
  try {
    const parsed = JSON.parse(text)
    setValueByPath(props.node, path, parsed)
  } catch {
    // 忽略非法 JSON，保持当前值
  }
}
</script>

<style scoped>
.schema-property-editor { padding: 8px 0; }
.section-title { font-weight: bold; margin-bottom: 8px; color: var(--w-text-color-regular); }
</style>
