<template>
  <w-form :model="model" :rules="rules">
    <div class="w-dynamic-form" :style="gridStyle">
      <w-form-item
        v-for="field in visibleFields"
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
      >
        <!-- 输入框 -->
        <w-input
          v-if="field.type === 'input' || field.type === 'text'"
          v-model="model[field.prop]"
          :type="field.inputType || 'text'"
          :placeholder="field.placeholder"
          :disabled="isDisabled(field)"
          :clearable="field.clearable"
        />

        <!-- 数字输入框 -->
        <w-input-number
          v-else-if="field.type === 'number'"
          v-model="model[field.prop]"
          :placeholder="field.placeholder"
          :disabled="isDisabled(field)"
          :min="field.min"
          :max="field.max"
        />

        <!-- 文本域 -->
        <w-input
          v-else-if="field.type === 'textarea'"
          v-model="model[field.prop]"
          type="textarea"
          :placeholder="field.placeholder"
          :disabled="isDisabled(field)"
          :rows="field.rows || 3"
        />

        <!-- 下拉选择 -->
        <w-select
          v-else-if="field.type === 'select'"
          v-model="model[field.prop]"
          :options="field.options || []"
          :placeholder="field.placeholder"
          :disabled="isDisabled(field)"
          :clearable="field.clearable"
        />

        <!-- 单选框 -->
        <w-space v-else-if="field.type === 'radio'">
          <w-radio
            v-for="opt in field.options"
            :key="opt.value"
            v-model="model[field.prop]"
            :label="opt.value"
            :disabled="isDisabled(field)"
          >
            {{ opt.label }}
          </w-radio>
        </w-space>

        <!-- 多选框 -->
        <w-space v-else-if="field.type === 'checkbox'">
          <w-checkbox
            v-for="opt in field.options"
            :key="opt.value"
            v-model="model[field.prop]"
            :label="opt.value"
            :disabled="isDisabled(field)"
          >
            {{ opt.label }}
          </w-checkbox>
        </w-space>

        <!-- 开关 -->
        <w-switch
          v-else-if="field.type === 'switch'"
          v-model="model[field.prop]"
          :disabled="isDisabled(field)"
          :active-text="field.activeText"
          :inactive-text="field.inactiveText"
        />

        <!-- 日期 -->
        <w-date-picker
          v-else-if="field.type === 'date'"
          v-model="model[field.prop]"
          :placeholder="field.placeholder"
          :disabled="isDisabled(field)"
        />

        <!-- 日期时间 -->
        <w-date-time-picker
          v-else-if="field.type === 'datetime'"
          v-model="model[field.prop]"
          :placeholder="field.placeholder"
          :disabled="isDisabled(field)"
        />

        <!-- 自定义 -->
        <slot v-else :name="field.prop" :field="field" :model="model" />
      </w-form-item>
    </div>
  </w-form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WForm from '../form/form.vue'
import WFormItem from '../form/form-item.vue'
import WInput from '../input/input.vue'
import WInputNumber from '../input-number/input-number.vue'
import WSelect from '../select/select.vue'
import WRadio from '../radio/radio.vue'
import WCheckbox from '../checkbox/checkbox.vue'
import WSwitch from '../switch/switch.vue'
import WDatePicker from '../date-picker/date-picker.vue'
import WDateTimePicker from '../date-time-picker/date-time-picker.vue'
import type { FormRule } from '../form/form.vue'

export interface DynamicField {
  prop: string
  label: string
  type: 'input' | 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'switch' | 'date' | 'datetime' | 'custom'
  inputType?: string
  placeholder?: string
  options?: { label: string; value: any }[]
  disabled?: boolean | ((model: Record<string, any>) => boolean)
  hidden?: boolean | ((model: Record<string, any>) => boolean)
  required?: boolean
  rules?: FormRule[]
  clearable?: boolean
  min?: number
  max?: number
  rows?: number
  activeText?: string
  inactiveText?: string
  span?: number
}

defineOptions({ name: 'WDynamicForm' })

const props = defineProps({
  model: { type: Object as () => Record<string, any>, default: () => ({}) },
  fields: { type: Array as () => DynamicField[], default: () => [] },
  columns: { type: Number, default: 1 }
})

const visibleFields = computed(() => {
  return props.fields.filter((field) => {
    if (typeof field.hidden === 'function') return !field.hidden(props.model)
    return !field.hidden
  })
})

const rules = computed(() => {
  const result: Record<string, FormRule[]> = {}
  props.fields.forEach((field) => {
    const list: FormRule[] = []
    if (field.required) {
      list.push({ required: true, message: `${field.label} 不能为空` })
    }
    if (field.rules) {
      list.push(...field.rules)
    }
    if (list.length) {
      result[field.prop] = list
    }
  })
  return result
})

const gridStyle = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
    gap: '12px'
  }
})

function isDisabled(field: DynamicField): boolean {
  if (typeof field.disabled === 'function') return field.disabled(props.model)
  return !!field.disabled
}
</script>

<style scoped>
.w-dynamic-form { }
</style>
