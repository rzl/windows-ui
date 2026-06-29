<template>
  <div class="w-query-builder">
    <query-builder-group v-model="root" :fields="fields" :level="0" />
    <div class="w-query-builder__actions">
      <w-button size="small" @click="addCondition(root)">+ 添加条件</w-button>
      <w-button size="small" @click="addGroup(root)">+ 添加分组</w-button>
      <w-button v-if="schemes.length" size="small" @click="schemeMenuOpen = !schemeMenuOpen">
        方案
      </w-button>
      <w-button type="primary" size="small" @click="handleSearch">查询</w-button>
      <w-button size="small" @click="handleReset">重置</w-button>
    </div>
    <div v-if="schemeMenuOpen" class="w-query-builder__schemes">
      <div v-for="(s, i) in schemes" :key="i" class="w-query-builder__scheme">
        <span @click="loadScheme(s)">{{ s.name }}</span>
        <w-icon name="close" size="small" @click="removeScheme(i)" />
      </div>
      <w-button size="small" @click="saveScheme">保存当前方案</w-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, provide, ref, type PropType } from 'vue'
import WButton from '../button/button.vue'
import WIcon from '../icon/icon.vue'
import QueryBuilderGroup from './query-builder-group.vue'

export interface QueryField {
  prop: string
  label: string
  type?: string
  options?: { label: string; value: any }[]
  searchMode?: string
}

export interface QueryCondition {
  id: string
  field: string
  operator: string
  value: any
}

export interface QueryConditionGroup {
  id: string
  logic: 'and' | 'or'
  conditions: (QueryCondition | QueryConditionGroup)[]
}

export type QueryNode = QueryCondition | QueryConditionGroup

const ALL_OPERATORS = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '包含', value: 'like' },
  { label: '不包含', value: 'notLike' },
  { label: '范围', value: 'between' },
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' }
]

defineOptions({ name: 'WQueryBuilder' })

const props = defineProps({
  fields: { type: Array as PropType<QueryField[]>, default: () => [] },
  modelValue: { type: Object as PropType<QueryConditionGroup | null>, default: null }
})

const emit = defineEmits(['update:modelValue', 'search', 'reset'])

let idCounter = 0
function createId() { return `q_${++idCounter}` }

function createGroup(): QueryConditionGroup {
  return { id: createId(), logic: 'and', conditions: [] }
}

function createCondition(): QueryCondition {
  const field = props.fields[0]?.prop || ''
  const mode = props.fields[0]?.searchMode
  const operator = mode && getOperatorOptions(field).some(o => o.value === mode) ? mode : 'eq'
  return { id: createId(), field, operator, value: operator === 'between' ? ['', ''] : '' }
}

const root = reactive<QueryConditionGroup>(createGroup())
const schemeMenuOpen = ref(false)
const schemes = ref<{ name: string; data: QueryConditionGroup }[]>([])

watch(() => props.modelValue, (val) => {
  if (val && val !== root) {
    root.logic = val.logic || 'and'
    root.conditions = val.conditions ? JSON.parse(JSON.stringify(val.conditions)) : []
    root.id = val.id || createId()
  }
}, { immediate: true, deep: true })

watch(root, () => { emit('update:modelValue', toPlain(root)) }, { deep: true })

function getFieldType(field: string) {
  return props.fields.find(f => f.prop === field)?.type || 'text'
}

function getOperatorOptions(field: string) {
  const type = getFieldType(field)
  if (type === 'number') return ALL_OPERATORS.filter(o => ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between'].includes(o.value))
  if (type === 'date' || type === 'datetime') return ALL_OPERATORS.filter(o => ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'between'].includes(o.value))
  return ALL_OPERATORS.filter(o => ['eq', 'ne', 'like', 'notLike', 'between'].includes(o.value))
}

function addCondition(group: QueryConditionGroup) { group.conditions.push(createCondition()) }
function addGroup(group: QueryConditionGroup) { group.conditions.push(createGroup()) }
function removeCondition(group: QueryConditionGroup, item: QueryCondition) {
  const index = group.conditions.indexOf(item)
  if (index > -1) group.conditions.splice(index, 1)
}
function removeGroup(parent: QueryConditionGroup, group: QueryConditionGroup) {
  const index = parent.conditions.indexOf(group)
  if (index > -1) parent.conditions.splice(index, 1)
}
function isGroup(item: QueryNode): item is QueryConditionGroup {
  return 'logic' in item && 'conditions' in item
}

function toPlain(group: QueryConditionGroup): QueryConditionGroup {
  return {
    id: group.id,
    logic: group.logic,
    conditions: group.conditions.map(item => isGroup(item) ? toPlain(item) : { ...item })
  }
}

function handleSearch() {
  const list = root.conditions.map(item => isGroup(item) ? toPlain(item) : { ...item })
  emit('search', list)
}
function handleReset() { root.logic = 'and'; root.conditions = []; emit('reset') }

function saveScheme() {
  const name = window.prompt('请输入方案名称')
  if (name) schemes.value.push({ name, data: JSON.parse(JSON.stringify(toPlain(root))) })
}
function loadScheme(s: { name: string; data: QueryConditionGroup }) {
  root.logic = s.data.logic
  root.conditions = JSON.parse(JSON.stringify(s.data.conditions))
  root.id = createId()
}
function removeScheme(i: number) { schemes.value.splice(i, 1) }

provide('queryBuilder', {
  fields: props.fields,
  getOperatorOptions,
  addCondition,
  addGroup,
  removeCondition,
  removeGroup,
  isGroup,
  createId
})
</script>

<style scoped>
.w-query-builder { padding: 12px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; margin-bottom: 12px; }
.w-query-builder__actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.w-query-builder__schemes { margin-top: 8px; padding: 8px; background: #f0f0f0; border: 1px solid #d4d0c8; }
.w-query-builder__scheme { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; margin-right: 8px; background: #fff; border: 1px solid #d4d0c8; cursor: pointer; }
.w-query-builder__scheme .w-icon { cursor: pointer; }

@media (max-width: 768px) {
  .w-query-builder { padding: 10px; }
}
</style>
