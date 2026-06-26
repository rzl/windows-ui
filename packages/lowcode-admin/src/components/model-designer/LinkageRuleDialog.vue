<template>
  <w-dialog :model-value="visible" title="联动规则配置" width="720" @update:model-value="$emit('update:visible', $event)">
    <div class="linkage-dialog">
      <div v-for="(rule, rIndex) in localRules" :key="rIndex" class="linkage-rule">
        <div class="linkage-rule__header">
          <w-select v-model="rule.logic" :options="logicOptions" style="width: 80px" />
          <w-button type="danger" size="small" @click="removeRule(rIndex)">删除规则</w-button>
        </div>

        <div class="linkage-rule__section">
          <div class="linkage-rule__section-title">条件</div>
          <div v-for="(condition, cIndex) in rule.conditions" :key="cIndex" class="linkage-rule__row">
            <w-select v-model="condition.field" :options="fieldOptions" placeholder="字段" style="width: 140px" />
            <w-select v-model="condition.operator" :options="operatorOptions" placeholder="运算符" style="width: 120px" />
            <w-input v-if="!['empty', 'notEmpty'].includes(condition.operator)" v-model="condition.value" placeholder="值" style="flex: 1" />
            <span v-else style="flex: 1; color: #999;">无需输入值</span>
            <w-button type="danger" size="small" @click="removeCondition(rule, cIndex)">删除</w-button>
          </div>
          <w-button size="small" @click="addCondition(rule)">+ 添加条件</w-button>
        </div>

        <div class="linkage-rule__section">
          <div class="linkage-rule__section-title">动作</div>
          <div v-for="(action, aIndex) in rule.actions" :key="aIndex" class="linkage-rule__row">
            <w-select v-model="action.type" :options="actionOptions" placeholder="动作" style="width: 140px" />
            <w-input v-if="action.type === 'setValue'" v-model="action.value" placeholder="设置值" style="flex: 1" />
            <w-input
              v-else-if="action.type === 'filterOptions'"
              v-model="action.optionsText"
              type="textarea"
              :rows="2"
              placeholder='[{"label":"选项1","value":"1"}]'
              style="flex: 1"
            />
            <span v-else style="flex: 1; color: #999;">无需输入值</span>
            <w-button type="danger" size="small" @click="removeAction(rule, aIndex)">删除</w-button>
          </div>
          <w-button size="small" @click="addAction(rule)">+ 添加动作</w-button>
        </div>
      </div>
      <w-button type="primary" size="small" @click="addRule">+ 添加规则</w-button>
    </div>
    <template #footer>
      <w-button @click="$emit('update:visible', false)">取消</w-button>
      <w-button type="primary" @click="handleSave">确定</w-button>
    </template>
  </w-dialog>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'
import type { LinkageRule } from '@windows-ui/core'

const props = defineProps({
  visible: { type: Boolean, default: false },
  rules: { type: Array as PropType<LinkageRule[]>, default: () => [] },
  fields: { type: Array as PropType<any[]>, default: () => [] }
})

const emit = defineEmits(['update:visible', 'save'])

const logicOptions = [
  { label: '且', value: 'and' },
  { label: '或', value: 'or' }
]

const operatorOptions = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' },
  { label: '包含', value: 'contains' },
  { label: '不包含', value: 'notContains' },
  { label: '为空', value: 'empty' },
  { label: '不为空', value: 'notEmpty' },
  { label: '在列表中', value: 'in' },
  { label: '不在列表中', value: 'notIn' }
]

const actionOptions = [
  { label: '显示', value: 'show' },
  { label: '隐藏', value: 'hide' },
  { label: '必填', value: 'required' },
  { label: '非必填', value: 'unrequired' },
  { label: '启用', value: 'enable' },
  { label: '禁用', value: 'disable' },
  { label: '设置值', value: 'setValue' },
  { label: '清空', value: 'clear' },
  { label: '过滤选项', value: 'filterOptions' }
]

const fieldOptions = ref<any[]>([])
const localRules = ref<any[]>([])

watch(() => props.visible, (val) => {
  if (val) {
    fieldOptions.value = props.fields.map((f) => ({ label: f.display_name || f.field_name, value: f.field_name }))
    localRules.value = JSON.parse(JSON.stringify(props.rules || []))
    normalizeRules()
  }
})

function normalizeRules() {
  localRules.value.forEach((rule) => {
    if (!rule.conditions) rule.conditions = []
    if (!rule.actions) rule.actions = []
    if (!rule.logic) rule.logic = 'and'
    rule.actions.forEach((action: any) => {
      if (action.type === 'filterOptions' && Array.isArray(action.options)) {
        action.optionsText = JSON.stringify(action.options)
      }
    })
  })
}

function addRule() {
  localRules.value.push({
    logic: 'and',
    conditions: [],
    actions: []
  } as LinkageRule)
}

function removeRule(index: number) {
  localRules.value.splice(index, 1)
}

function addCondition(rule: LinkageRule) {
  rule.conditions.push({ field: '', operator: 'eq', value: '' })
}

function removeCondition(rule: LinkageRule, index: number) {
  rule.conditions.splice(index, 1)
}

function addAction(rule: LinkageRule) {
  ;(rule.actions as any[]).push({ type: 'show' })
}

function removeAction(rule: LinkageRule, index: number) {
  rule.actions.splice(index, 1)
}

function handleSave() {
  const rules = localRules.value.map((rule: any) => {
    const actions = rule.actions.map((action: any) => {
      const item: any = { type: action.type }
      if (action.type === 'setValue') {
        item.value = parseValue(action.value)
      }
      if (action.type === 'filterOptions') {
        try {
          item.options = action.optionsText ? JSON.parse(action.optionsText) : []
        } catch {
          item.options = []
        }
      }
      return item
    })
    return {
      logic: rule.logic,
      conditions: rule.conditions.filter((c: any) => c.field),
      actions
    }
  }).filter((r: any) => r.conditions.length && r.actions.length)

  emit('save', rules)
  emit('update:visible', false)
}

function parseValue(val: any) {
  if (val === 'true') return true
  if (val === 'false') return false
  if (val === 'null') return null
  if (!isNaN(Number(val)) && val !== '') return Number(val)
  return val
}
</script>

<style scoped>
.linkage-dialog { max-height: 60vh; overflow-y: auto; }
.linkage-rule { border: 1px solid #c0c0c0; padding: 12px; margin-bottom: 12px; border-radius: 4px; background: rgba(255,255,255,0.4); }
.linkage-rule__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.linkage-rule__section { margin-bottom: 12px; }
.linkage-rule__section-title { font-weight: bold; margin-bottom: 8px; color: var(--w-text-color-primary); }
.linkage-rule__row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
</style>
