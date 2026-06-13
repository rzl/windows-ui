<template>
  <div class="w-query-builder">
    <div
      v-for="(item, index) in conditions"
      :key="item.id"
      class="w-query-builder__row"
    >
      <w-select v-model="item.field" :options="fieldOptions" placeholder="选择字段" style="width: 140px" />
      <w-select v-model="item.operator" :options="operatorOptions" placeholder="条件" style="width: 120px" />
      <w-input v-model="item.value" placeholder="值" style="flex: 1" />
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
  { label: '大于', value: 'gt' },
  { label: '小于', value: 'lt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于等于', value: 'lte' }
]

const fieldOptions = props.fields.map((f) => ({ label: f.label, value: f.prop }))

function addCondition() {
  conditions.push({
    id: ++idCounter,
    field: props.fields[0]?.prop || '',
    operator: 'eq',
    value: ''
  })
}

function removeCondition(index: number) {
  conditions.splice(index, 1)
}

function handleSearch() {
  emit('search', conditions)
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
</style>
