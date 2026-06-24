<template>
  <div class="w-query-builder">
    <div
      v-for="(item, index) in conditions"
      :key="item.id"
      class="w-query-builder__row"
    >
      <w-select v-model="item.field" :options="fieldOptions" placeholder="选择字段" style="width: 140px" @change="(val: any) => handleFieldChange(item, val)" />
      <w-select v-model="item.operator" :options="getOperatorOptions(item.field)" placeholder="条件" style="width: 120px" />
      <template v-if="getFieldMode(item.field) === 'between' || item.operator === 'between'">
        <w-input v-model="item.value[0]" :placeholder="getPlaceholder(item)" style="flex: 1" />
        <span style="padding: 0 4px">~</span>
        <w-input v-model="item.value[1]" :placeholder="getPlaceholder(item)" style="flex: 1" />
      </template>
      <w-input v-else v-model="item.value" :placeholder="getPlaceholder(item)" style="flex: 1" />
      <w-button type="danger" size="small" @click="removeCondition(index)">删除</w-button>
    </div>
    <div class="w-query-builder__actions">
      <w-button size="small" @click="addCondition">+ 添加条件</w-button>
      <w-button type="primary" size="small" @click="handleSearch">查询</w-button>
      <w-button size="small" @click="handleReset">重置</w-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import WSelect from '../select/select.vue'
import WInput from '../input/input.vue'
import WButton from '../button/button.vue'

export interface QueryField {
  prop: string
  label: string
  searchMode?: string
}

export interface QueryCondition {
  id: number
  field: string
  operator: string
  value: any
}

defineOptions({ name: 'WQueryBuilder' })

const props = defineProps({
  fields: { type: Array as () => QueryField[], default: () => [] }
})

const emit = defineEmits(['search', 'reset'])

let idCounter = 0
const conditions = reactive<QueryCondition[]>([])

const operatorOptions = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '包含', value: 'like' },
  { label: '范围', value: 'between' },
  { label: '大于', value: 'gt' },
  { label: '小于', value: 'lt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于等于', value: 'lte' }
]

const fieldOptions = props.fields.map((f) => ({ label: f.label, value: f.prop }))

function getFieldMode(field: string) {
  return props.fields.find((f) => f.prop === field)?.searchMode
}

function getOperatorOptions(field: string) {
  const mode = getFieldMode(field)
  if (!mode) return operatorOptions
  return operatorOptions.filter((o) => {
    if (mode === 'between') return o.value === 'between'
    if (mode === 'like') return ['like', 'eq', 'ne'].includes(o.value)
    if (mode === 'eq') return ['eq', 'ne'].includes(o.value)
    return o.value === mode || ['eq', 'ne'].includes(o.value)
  })
}

function getPlaceholder(item: QueryCondition) {
  const mode = item.operator || getFieldMode(item.field)
  return mode === 'between' ? '起始值' : '值'
}

function handleFieldChange(item: QueryCondition, val: any) {
  const mode = getFieldMode(val)
  item.operator = mode && getOperatorOptions(val).some((o) => o.value === mode) ? mode : 'eq'
  item.value = mode === 'between' ? ['', ''] : ''
}

function addCondition() {
  const field = props.fields[0]?.prop || ''
  const mode = getFieldMode(field)
  conditions.push({
    id: ++idCounter,
    field,
    operator: mode || 'eq',
    value: mode === 'between' ? ['', ''] : ''
  })
}

function removeCondition(index: number) {
  conditions.splice(index, 1)
}

function handleSearch() {
  const list = conditions.map((item) => {
    if (item.operator === 'between' && Array.isArray(item.value)) {
      return { ...item, value: [item.value[0], item.value[1]] }
    }
    return item
  })
  emit('search', list)
}

function handleReset() {
  conditions.splice(0, conditions.length)
  emit('reset')
}
</script>

<style scoped>
.w-query-builder { padding: 12px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; margin-bottom: 12px; }
.w-query-builder__row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
.w-query-builder__actions { display: flex; gap: 8px; margin-top: 12px; }

@media (max-width: 768px) {
  .w-query-builder { padding: 10px; }
  .w-query-builder__row { flex-direction: column; align-items: stretch; gap: 6px; margin-bottom: 12px; }
  .w-query-builder__row > * { width: 100% !important; }
  .w-query-builder__actions { flex-wrap: wrap; }
}
</style>
