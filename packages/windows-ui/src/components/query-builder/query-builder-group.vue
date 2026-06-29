<template>
  <div class="w-query-builder-group" :class="[`w-query-builder-group--level-${level % 3}`]">
    <div class="w-query-builder-group__header">
      <w-select :model-value="modelValue.logic" :options="logicOptions" style="width: 80px" @update:modelValue="(v: any) => modelValue.logic = v" />
      <w-button v-if="level > 0" type="danger" size="small" @click="emit('remove')">删除分组</w-button>
    </div>
    <div class="w-query-builder-group__body">
      <div v-for="(item, index) in modelValue.conditions" :key="item.id" class="w-query-builder__row w-query-builder-group__row">
        <template v-if="isGroup(item)">
          <query-builder-group
            v-model="(modelValue.conditions[index] as QueryConditionGroup)"
            :fields="fields"
            :level="level + 1"
            @remove="removeGroup(item)"
          />
        </template>
        <template v-else>
          <div class="w-query-builder-group__condition">
            <w-select :model-value="item.field" :options="fieldOptions" placeholder="字段" style="width: 140px" @update:modelValue="(v: any) => handleFieldChange(item, v)" />
            <w-select :model-value="item.operator" :options="getOperatorOptions(item.field)" placeholder="条件" style="width: 120px" @update:modelValue="(v: any) => item.operator = v" />
            <template v-if="item.operator === 'between'">
              <component :is="inputComponent(item.field)" :model-value="Array.isArray(item.value) ? item.value[0] : ''" :options="fieldOptionsOf(item.field)" style="flex: 1" @update:modelValue="(v: any) => setBetween(item, 0, v)" />
              <span class="w-query-builder-group__sep">~</span>
              <component :is="inputComponent(item.field)" :model-value="Array.isArray(item.value) ? item.value[1] : ''" :options="fieldOptionsOf(item.field)" style="flex: 1" @update:modelValue="(v: any) => setBetween(item, 1, v)" />
            </template>
            <component :is="inputComponent(item.field)" v-else :model-value="item.value" :options="fieldOptionsOf(item.field)" style="flex: 1" @update:modelValue="(v: any) => item.value = v" />
            <w-button type="danger" size="small" @click="removeCondition(item)">删除</w-button>
          </div>
        </template>
      </div>
      <div v-if="!modelValue.conditions.length" class="w-query-builder-group__empty">点击按钮添加条件或分组</div>
    </div>
    <div class="w-query-builder-group__actions">
      <w-button size="small" @click="addCondition(modelValue)">+ 添加条件</w-button>
      <w-button size="small" @click="addGroup(modelValue)">+ 添加分组</w-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type PropType } from 'vue'
import WSelect from '../select/select.vue'
import WInput from '../input/input.vue'
import WInputNumber from '../input-number/input-number.vue'
import WDatePicker from '../date-picker/date-picker.vue'
import WDateTimePicker from '../date-time-picker/date-time-picker.vue'
import WButton from '../button/button.vue'
import type { QueryField, QueryCondition, QueryConditionGroup, QueryNode } from './query-builder.vue'

const logicOptions = [{ label: '且', value: 'and' }, { label: '或', value: 'or' }]

defineOptions({ name: 'QueryBuilderGroup' })

const props = defineProps({
  modelValue: { type: Object as PropType<QueryConditionGroup>, required: true },
  fields: { type: Array as PropType<QueryField[]>, default: () => [] },
  level: { type: Number, default: 0 }
})
const emit = defineEmits(['update:modelValue', 'remove'])

const builder = inject<any>('queryBuilder', null)
const fieldOptions = computed(() => props.fields.map(f => ({ label: f.label, value: f.prop })))

const getField = (field: string) => props.fields.find(f => f.prop === field)
const getOperatorOptions = (field: string) => builder?.getOperatorOptions?.(field) || []
const inputComponent = (field: string) => {
  const type = getField(field)?.type
  if (type === 'number') return WInputNumber
  if (type === 'date') return WDatePicker
  if (type === 'datetime') return WDateTimePicker
  if (type === 'select') return WSelect
  return WInput
}
const fieldOptionsOf = (field: string) => getField(field)?.options || []

const addCondition = (group: QueryConditionGroup) => builder?.addCondition?.(group)
const addGroup = (group: QueryConditionGroup) => builder?.addGroup?.(group)
const removeCondition = (item: QueryCondition) => builder?.removeCondition?.(props.modelValue, item)
const removeGroup = (group: QueryConditionGroup) => builder?.removeGroup?.(props.modelValue, group)
const isGroup = (item: QueryNode): item is QueryConditionGroup => builder?.isGroup?.(item) || ('logic' in item && 'conditions' in item)

const handleFieldChange = (item: QueryCondition, val: any) => {
  item.field = val
  const ops = getOperatorOptions(val)
  item.operator = ops[0]?.value || 'eq'
  item.value = item.operator === 'between' ? ['', ''] : ''
}

const setBetween = (item: QueryCondition, index: number, val: any) => {
  if (!Array.isArray(item.value)) item.value = ['', '']
  item.value[index] = val
}
</script>

<style scoped>
.w-query-builder-group { padding: 10px; background: rgba(255,255,255,0.4); border: 1px solid #c0c0c0; border-radius: var(--w-border-radius-base); }
.w-query-builder-group--level-0 { background: rgba(255,255,255,0.5); }
.w-query-builder-group--level-1 { background: rgba(240,248,255,0.5); }
.w-query-builder-group--level-2 { background: rgba(255,250,240,0.5); }
.w-query-builder-group__header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.w-query-builder-group__body { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
.w-query-builder-group__condition { display: flex; gap: 8px; align-items: center; flex: 1; }
.w-query-builder-group__sep { padding: 0 4px; color: var(--w-text-color-secondary); }
.w-query-builder-group__actions { display: flex; gap: 8px; }
.w-query-builder-group__empty { color: var(--w-text-color-placeholder); font-size: var(--w-font-size-small); padding: 8px 0; }

@media (max-width: 768px) {
  .w-query-builder-group { padding: 8px; }
  .w-query-builder-group__condition { flex-direction: column; align-items: stretch; gap: 6px; }
  .w-query-builder-group__condition > * { width: 100% !important; }
}
</style>
