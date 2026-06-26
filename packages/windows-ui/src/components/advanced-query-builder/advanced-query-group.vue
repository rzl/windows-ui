<template>
  <div class="w-advanced-query-group" :class="[`w-advanced-query-group--level-${level % 3}`]">
    <div class="w-advanced-query-group__header">
      <w-select
        :model-value="modelValue.logic"
        :options="logicOptions"
        style="width: 80px"
        @update:modelValue="handleLogicChange"
      />
      <w-button v-if="level > 0" type="danger" size="small" @click="removeSelf">删除分组</w-button>
    </div>
    <div class="w-advanced-query-group__body">
      <div
        v-for="(item, index) in modelValue.conditions"
        :key="item.id"
        class="w-advanced-query-group__row"
      >
        <template v-if="isGroup(item)">
          <advanced-query-group
            v-model="(modelValue.conditions[index] as AdvancedConditionGroup)"
            :fields="fields"
            :level="level + 1"
            @remove="removeGroup(item)"
          />
        </template>
        <template v-else>
          <div class="w-advanced-query-group__condition">
            <w-select
              :model-value="item.field"
              :options="fieldOptions"
              placeholder="字段"
              style="width: 140px"
              @update:modelValue="(val: any) => handleFieldChange(item, val)"
            />
            <w-select
              :model-value="item.op"
              :options="getOperators(item.field)"
              placeholder="条件"
              style="width: 120px"
              @update:modelValue="(val: any) => handleOpChange(item, val)"
            />
            <template v-if="needValue(item.op)">
              <template v-if="item.op === 'between'">
                <w-input
                  :model-value="Array.isArray(item.value) ? item.value[0] : ''"
                  :placeholder="getPlaceholder(item)"
                  style="flex: 1"
                  @update:modelValue="(val: any) => setBetweenValue(item, 0, val)"
                />
                <span class="w-advanced-query-group__sep">~</span>
                <w-input
                  :model-value="Array.isArray(item.value) ? item.value[1] : ''"
                  :placeholder="getPlaceholder(item)"
                  style="flex: 1"
                  @update:modelValue="(val: any) => setBetweenValue(item, 1, val)"
                />
              </template>
              <w-input
                v-else
                v-model="item.value"
                :placeholder="getPlaceholder(item)"
                style="flex: 1"
              />
            </template>
            <w-button type="danger" size="small" @click="removeCondition(item)">删除</w-button>
          </div>
        </template>
      </div>
      <div v-if="!modelValue.conditions.length" class="w-advanced-query-group__empty">点击上方按钮添加查询条件或分组</div>
    </div>
    <div class="w-advanced-query-group__actions">
      <w-button size="small" @click="addCondition(modelValue)">+ 添加条件</w-button>
      <w-button size="small" @click="addGroup(modelValue)">+ 添加分组</w-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type PropType } from 'vue'
import WSelect from '../select/select.vue'
import WInput from '../input/input.vue'
import WButton from '../button/button.vue'
import type { AdvancedQueryField, AdvancedCondition, AdvancedConditionGroup, AdvancedQueryCondition } from './advanced-query-builder.vue'

const logicOptions = [
  { label: '且', value: 'and' },
  { label: '或', value: 'or' }
]

const NO_VALUE_OPS = ['isNull', 'isNotNull']

defineOptions({ name: 'AdvancedQueryGroup' })

const props = defineProps({
  modelValue: { type: Object as PropType<AdvancedConditionGroup>, required: true },
  fields: { type: Array as PropType<AdvancedQueryField[]>, default: () => [] },
  level: { type: Number, default: 0 }
})

const emit = defineEmits(['update:modelValue', 'remove'])

const builder = inject<any>('advancedQueryBuilder', null)

const fieldOptions = computed(() => props.fields.map((f) => ({ label: f.label, value: f.prop })))

function getOperators(field: string) {
  const f = props.fields.find((item) => item.prop === field)
  if (builder && builder.getOperatorsByFieldType) {
    return builder.getOperatorsByFieldType(f?.type)
  }
  return []
}

function addCondition(group: AdvancedConditionGroup) {
  builder?.addCondition?.(group)
}

function addGroup(group: AdvancedConditionGroup) {
  builder?.addGroup?.(group)
}

function removeCondition(item: AdvancedCondition) {
  builder?.removeCondition?.(props.modelValue, item)
}

function removeGroup(group: AdvancedConditionGroup) {
  builder?.removeGroup?.(props.modelValue, group)
}

function removeSelf() {
  emit('remove')
}

function handleLogicChange(val: any) {
  props.modelValue.logic = val
}

function handleFieldChange(item: AdvancedCondition, val: any) {
  item.field = val
  const f = props.fields.find((field) => field.prop === val)
  const ops = builder?.getAvailableOperators ? builder.getAvailableOperators(f?.type) : []
  item.op = ops.includes(item.op) ? item.op : (ops[0] || 'eq')
  item.value = item.op === 'between' ? ['', ''] : ''
}

function handleOpChange(item: AdvancedCondition, val: any) {
  item.op = val
  if (val === 'between') {
    item.value = ['', '']
  } else if (NO_VALUE_OPS.includes(val)) {
    item.value = undefined
  } else if (Array.isArray(item.value)) {
    item.value = ''
  }
}

function needValue(op: string) {
  return !NO_VALUE_OPS.includes(op)
}

function getPlaceholder(item: AdvancedCondition) {
  if (item.op === 'between') return '起始值'
  if (['in', 'notIn'].includes(item.op)) return '多个值用逗号分隔'
  return '值'
}

function setBetweenValue(item: AdvancedCondition, index: number, val: any) {
  if (!Array.isArray(item.value)) item.value = ['', '']
  item.value[index] = val
}

function isGroup(item: AdvancedQueryCondition): item is AdvancedConditionGroup {
  return builder?.isGroup ? builder.isGroup(item) : ('logic' in item && 'conditions' in item)
}
</script>

<style scoped>
.w-advanced-query-group { padding: 10px; background: rgba(255,255,255,0.4); border: 1px solid #c0c0c0; border-radius: var(--w-border-radius-base); }
.w-advanced-query-group--level-0 { background: rgba(255,255,255,0.5); }
.w-advanced-query-group--level-1 { background: rgba(240,248,255,0.5); }
.w-advanced-query-group--level-2 { background: rgba(255,250,240,0.5); }
.w-advanced-query-group__header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.w-advanced-query-group__body { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
.w-advanced-query-group__condition { display: flex; gap: 8px; align-items: center; flex: 1; }
.w-advanced-query-group__sep { padding: 0 4px; color: var(--w-text-color-secondary); }
.w-advanced-query-group__actions { display: flex; gap: 8px; }
.w-advanced-query-group__empty { color: var(--w-text-color-placeholder); font-size: var(--w-font-size-small); padding: 8px 0; }

@media (max-width: 768px) {
  .w-advanced-query-group { padding: 8px; }
  .w-advanced-query-group__condition { flex-direction: column; align-items: stretch; gap: 6px; }
  .w-advanced-query-group__condition > * { width: 100% !important; }
  .w-advanced-query-group__actions { flex-wrap: wrap; }
}
</style>
