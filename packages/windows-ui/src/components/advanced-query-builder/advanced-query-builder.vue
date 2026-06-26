<template>
  <div class="w-advanced-query-builder">
    <div class="w-advanced-query-builder__header">
      <span class="w-advanced-query-builder__title">高级查询</span>
      <w-space>
        <slot name="toolbar" />
        <w-button size="small" @click="addCondition(root)">+ 添加条件</w-button>
        <w-button size="small" @click="addGroup(root)">+ 添加分组</w-button>
        <w-button type="primary" size="small" @click="handleSearch">查询</w-button>
        <w-button size="small" @click="handleReset">重置</w-button>
      </w-space>
    </div>
    <advanced-query-group v-model="root" :fields="fields" :level="0" />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, provide, type PropType } from 'vue'
import WSpace from '../space/space.vue'
import WButton from '../button/button.vue'
import AdvancedQueryGroup from './advanced-query-group.vue'

export type LogicType = 'and' | 'or'

export interface AdvancedQueryField {
  prop: string
  label: string
  type?: string
}

export interface AdvancedCondition {
  id: string
  field: string
  op: string
  value: any
}

export interface AdvancedConditionGroup {
  id: string
  logic: LogicType
  conditions: (AdvancedCondition | AdvancedConditionGroup)[]
}

export type AdvancedQueryCondition = AdvancedCondition | AdvancedConditionGroup

const ALL_OPERATORS = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '包含', value: 'like' },
  { label: '不包含', value: 'notLike' },
  { label: '开头是', value: 'startsWith' },
  { label: '结尾是', value: 'endsWith' },
  { label: '在列表中', value: 'in' },
  { label: '不在列表中', value: 'notIn' },
  { label: '范围', value: 'between' },
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' },
  { label: '为空', value: 'isNull' },
  { label: '不为空', value: 'isNotNull' }
]

const STRING_OPS = ['eq', 'ne', 'like', 'notLike', 'startsWith', 'endsWith', 'in', 'notIn', 'isNull', 'isNotNull']
const NUMBER_OPS = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'isNull', 'isNotNull']
const DATE_OPS = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between', 'isNull', 'isNotNull']
const SELECT_OPS = ['eq', 'ne', 'in', 'notIn', 'isNull', 'isNotNull']

defineOptions({ name: 'WAdvancedQueryBuilder' })

const props = defineProps({
  modelValue: { type: Object as PropType<AdvancedConditionGroup | null>, default: null },
  fields: { type: Array as PropType<AdvancedQueryField[]>, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'search', 'reset'])

let idCounter = 0
function createId() {
  return `aq_${++idCounter}`
}

function createEmptyGroup(): AdvancedConditionGroup {
  return { id: createId(), logic: 'and', conditions: [] }
}

function createCondition(): AdvancedCondition {
  const field = props.fields[0]?.prop || ''
  return { id: createId(), field, op: getDefaultOp(field), value: '' }
}

let root = reactive<AdvancedConditionGroup>(createEmptyGroup())

watch(
  () => props.modelValue,
  (val) => {
    if (val && val !== root) {
      root.logic = val.logic || 'and'
      root.conditions = val.conditions ? JSON.parse(JSON.stringify(val.conditions)) : []
      root.id = val.id || createId()
    }
  },
  { immediate: true, deep: true }
)

watch(
  root,
  () => {
    emit('update:modelValue', toPlain(root))
  },
  { deep: true }
)

function getOperatorsByFieldType(type?: string): { label: string; value: string }[] {
  const ops = getAvailableOperators(type)
  return ALL_OPERATORS.filter((o) => ops.includes(o.value))
}

function getAvailableOperators(type?: string): string[] {
  switch (type) {
    case 'string':
    case 'text':
      return STRING_OPS
    case 'number':
      return NUMBER_OPS
    case 'date':
    case 'datetime':
      return DATE_OPS
    case 'select':
    case 'radio':
    case 'checkbox':
    case 'ref':
      return SELECT_OPS
    default:
      return STRING_OPS
  }
}

function getDefaultOp(type?: string): string {
  const ops = getAvailableOperators(type)
  return ops.includes('like') ? 'like' : ops[0] || 'eq'
}

function addCondition(group: AdvancedConditionGroup) {
  group.conditions.push(createCondition())
}

function addGroup(group: AdvancedConditionGroup) {
  group.conditions.push(createEmptyGroup())
}

function handleSearch() {
  emit('search', toPlain(root))
}

function handleReset() {
  root.logic = 'and'
  root.conditions = []
  emit('reset')
}

function toPlain(group: AdvancedConditionGroup): AdvancedConditionGroup {
  return {
    logic: group.logic,
    conditions: group.conditions.map((item) => {
      if (isGroup(item)) {
        return toPlain(item)
      }
      const { id, ...rest } = item
      if (['in', 'notIn'].includes(item.op) && typeof item.value === 'string') {
        return { ...rest, value: item.value.split(',').map((v: string) => v.trim()).filter(Boolean) }
      }
      return rest
    })
  } as AdvancedConditionGroup
}

function isGroup(item: AdvancedQueryCondition): item is AdvancedConditionGroup {
  return 'logic' in item && 'conditions' in item
}

provide('advancedQueryBuilder', {
  fields: props.fields,
  getOperatorsByFieldType,
  getAvailableOperators,
  addCondition,
  addGroup,
  removeCondition,
  removeGroup,
  isGroup,
  createId
})

function removeCondition(group: AdvancedConditionGroup, item: AdvancedCondition) {
  const index = group.conditions.indexOf(item)
  if (index > -1) group.conditions.splice(index, 1)
}

function removeGroup(parent: AdvancedConditionGroup, group: AdvancedConditionGroup) {
  const index = parent.conditions.indexOf(group)
  if (index > -1) parent.conditions.splice(index, 1)
}

</script>

<style scoped>
.w-advanced-query-builder { padding: 12px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; margin-bottom: 12px; }
.w-advanced-query-builder__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.w-advanced-query-builder__title { font-weight: bold; color: var(--w-text-color-primary); }

@media (max-width: 768px) {
  .w-advanced-query-builder { padding: 10px; }
  .w-advanced-query-builder__header { flex-direction: column; align-items: flex-start; }
}
</style>
