<template>
  <w-form ref="formRef" :model="model" :rules="rules">
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
          :options="getFieldOptions(field)"
          :placeholder="field.placeholder"
          :disabled="isDisabled(field)"
          :clearable="field.clearable"
        />

        <!-- 单选框 -->
        <w-space v-else-if="field.type === 'radio'">
          <w-radio
            v-for="opt in getFieldOptions(field)"
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
            v-for="opt in getFieldOptions(field)"
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

        <!-- 关联模型 -->
        <w-select
          v-else-if="field.type === 'ref'"
          v-model="model[field.prop]"
          :options="refOptionsMap[field.prop] || []"
          :placeholder="field.placeholder || '请选择'"
          :disabled="isDisabled(field)"
          :clearable="field.clearable"
          filterable
          @focus="loadRefOptions(field)"
        />

        <!-- 文件上传 -->
        <w-upload
          v-else-if="field.type === 'upload'"
          :button-text="field.placeholder || '选择文件'"
          :disabled="isDisabled(field)"
          :http-request="props.uploadRequest"
          @change="model[field.prop] = $event"
        />

        <!-- 级联选择 -->
        <w-cascader
          v-else-if="field.type === 'cascader'"
          v-model="model[field.prop]"
          :options="getFieldOptions(field)"
          :placeholder="field.placeholder"
          :disabled="isDisabled(field)"
          :clearable="field.clearable"
        />

        <!-- 富文本 -->
        <w-rich-text
          v-else-if="field.type === 'rich-text'"
          v-model="model[field.prop]"
          :placeholder="field.placeholder"
          :disabled="isDisabled(field)"
        />

        <!-- 自定义 -->
        <slot v-else :name="field.prop" :field="field" :model="model" />
        <div v-if="validationErrors[field.prop]" class="w-dynamic-form__error">
          {{ validationErrors[field.prop] }}
        </div>
      </w-form-item>
    </div>
  </w-form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, type PropType } from 'vue'
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
import WUpload from '../upload/upload.vue'
import WCascader from '../cascader/cascader.vue'
import WRichText from '../rich-text/rich-text.vue'
import type { FormRule } from '../form/form.vue'

export interface DynamicField {
  prop: string
  label: string
  type: 'input' | 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'switch' | 'date' | 'datetime' | 'ref' | 'upload' | 'cascader' | 'rich-text' | 'custom'
  inputType?: string
  placeholder?: string
  options?: { label: string; value: any }[]
  disabled?: boolean | ((model: Record<string, any>) => boolean)
  hidden?: boolean | ((model: Record<string, any>) => boolean)
  required?: boolean
  validationRule?: string
  rules?: FormRule[]
  codingRule?: string
  defaultValueType?: 'constant' | 'currentUser' | 'currentTime' | 'currentDept' | 'field' | 'expr'
  defaultValueExpr?: string
  refModel?: string
  refDisplayField?: string
  dependsOn?: {
    field: string
    value?: any
    operator?: 'eq' | 'ne' | 'empty' | 'notEmpty'
  }
  dynamicOptions?: {
    type: 'dict' | 'sql' | 'api' | 'script'
    dependsOn?: string
    dictCode?: string
    sql?: string
    api?: { method?: string; url?: string; params?: any; body?: any }
    script?: string
    option?: any
  }
  clearable?: boolean
  min?: number
  max?: number
  rows?: number
  activeText?: string
  inactiveText?: string
  span?: number
}

defineOptions({ name: 'WDynamicForm' })

export type ValidateRuleItem = { code: string; value: any }
export type ValidateRuleResult = { code: string; valid: boolean; message?: string }

const props = defineProps({
  model: { type: Object as () => Record<string, any>, default: () => ({}) },
  fields: { type: Array as () => DynamicField[], default: () => [] },
  columns: { type: Number, default: 1 },
  validateRules: {
    type: Function as PropType<(items: ValidateRuleItem[]) => Promise<ValidateRuleResult[]>>,
    default: undefined
  },
  loadOptions: {
    type: Function as PropType<(config: DynamicField['dynamicOptions'], model: Record<string, any>) => Promise<{ label: string; value: any }[]>>,
    default: undefined
  },
  loadRefOptions: {
    type: Function as PropType<(modelCode: string, displayField: string, keyword: string) => Promise<{ label: string; value: any }[]>>,
    default: undefined
  },
  userInfo: {
    type: Object as PropType<{ id?: number | string; deptId?: number | string; [key: string]: any }>,
    default: undefined
  },
  generateCode: {
    type: Function as PropType<(ruleCode: string) => Promise<string>>,
    default: undefined
  },
  uploadRequest: {
    type: Function as PropType<(file: File) => Promise<{ url: string; name: string; size?: number }>>,
    default: undefined
  }
})

const visibleFields = computed(() => {
  return props.fields.filter((field) => {
    if (typeof field.hidden === 'function') return !field.hidden(props.model)
    if (field.hidden) return false
    return !isDependsOnHidden(field)
  })
})

function isDependsOnHidden(field: DynamicField): boolean {
  if (!field.dependsOn || !field.dependsOn.field) return false
  const targetValue = props.model[field.dependsOn.field]
  const operator = field.dependsOn.operator || 'eq'

  switch (operator) {
    case 'eq':
      return targetValue !== field.dependsOn.value
    case 'ne':
      return targetValue === field.dependsOn.value
    case 'empty':
      return targetValue !== undefined && targetValue !== '' && targetValue !== null
    case 'notEmpty':
      return targetValue === undefined || targetValue === '' || targetValue === null
    default:
      return false
  }
}

const formRef = ref<any>(null)
const validationErrors = reactive<Record<string, string>>({})
const fieldOptionsMap = reactive<Record<string, { label: string; value: any }[]>>({})
const refOptionsMap = reactive<Record<string, { label: string; value: any }[]>>({})
const generatedCodeSet = new Set<string>()

function evalExpr(expr: string, ctx: Record<string, any>) {
  try {
    const fn = new Function('ctx', `with(ctx) { return (${expr}) }`)
    return fn(ctx)
  } catch (error) {
    console.error(`默认值表达式执行失败: ${expr}`, error)
    return undefined
  }
}

function computeDefaultValue(field: DynamicField): any {
  if (!field.defaultValueType || field.defaultValueType === 'constant') {
    return field.defaultValueExpr
  }
  if (field.defaultValueType === 'currentUser') {
    return props.userInfo?.id ?? undefined
  }
  if (field.defaultValueType === 'currentDept') {
    return props.userInfo?.deptId ?? undefined
  }
  if (field.defaultValueType === 'currentTime') {
    const now = new Date()
    if (field.type === 'date') return now.toISOString().slice(0, 10)
    if (field.type === 'datetime') return now.toISOString().slice(0, 19).replace('T', ' ')
    return now.toISOString()
  }
  if (field.defaultValueType === 'field') {
    return field.defaultValueExpr ? props.model[field.defaultValueExpr] : undefined
  }
  if (field.defaultValueType === 'expr') {
    return evalExpr(field.defaultValueExpr || '', props.model)
  }
  return undefined
}

function getFieldOptions(field: DynamicField) {
  if (fieldOptionsMap[field.prop]) return fieldOptionsMap[field.prop]
  return field.options || []
}

async function loadFieldOptions(field: DynamicField) {
  if (!field.dynamicOptions || !props.loadOptions) return
  try {
    const options = await props.loadOptions(field.dynamicOptions, props.model)
    fieldOptionsMap[field.prop] = options || []
  } catch (error) {
    console.error(`加载字段 ${field.prop} 选项失败`, error)
    fieldOptionsMap[field.prop] = []
  }
}

async function loadRefOptions(field: DynamicField) {
  if (!field.refModel || !field.refDisplayField || !props.loadRefOptions) return
  try {
    const options = await props.loadRefOptions(field.refModel, field.refDisplayField, '')
    refOptionsMap[field.prop] = options || []
  } catch (error) {
    console.error(`加载关联模型 ${field.refModel} 选项失败`, error)
    refOptionsMap[field.prop] = []
  }
}

// 监听依赖字段变化，自动加载动态选项
watch(
  () => props.fields,
  (fields) => {
    fields.forEach((field) => {
      if (field.dynamicOptions) {
        loadFieldOptions(field)
      }
      if (field.type === 'ref') {
        loadRefOptions(field)
      }
    })
  },
  { immediate: true, deep: true }
)

// 监听字段配置变化，自动为生码字段生成编码
watch(
  () => props.fields,
  async (fields) => {
    if (!props.generateCode) return
    for (const field of fields) {
      if (!field.codingRule) continue
      if (props.model[field.prop] !== undefined && props.model[field.prop] !== '' && props.model[field.prop] !== null) continue
      if (generatedCodeSet.has(field.prop)) continue
      try {
        const code = await props.generateCode(field.codingRule)
        props.model[field.prop] = code
        generatedCodeSet.add(field.prop)
      } catch (error) {
        console.error(`生成编码失败: ${field.codingRule}`, error)
      }
    }
  },
  { immediate: true, deep: true }
)

// 监听字段配置变化，自动填充默认值
watch(
  () => props.fields,
  (fields) => {
    fields.forEach((field) => {
      if (!field.defaultValueType || field.defaultValueType === 'constant') {
        if (field.defaultValueExpr !== undefined && (props.model[field.prop] === undefined || props.model[field.prop] === '' || props.model[field.prop] === null)) {
          props.model[field.prop] = field.defaultValueExpr
        }
        return
      }
      if (props.model[field.prop] !== undefined && props.model[field.prop] !== '' && props.model[field.prop] !== null) return
      const value = computeDefaultValue(field)
      if (value !== undefined) {
        props.model[field.prop] = value
      }
    })
  },
  { immediate: true, deep: true }
)

watch(
  () => props.model,
  (model, oldModel) => {
    props.fields.forEach((field) => {
      if (field.dynamicOptions?.dependsOn) {
        const depField = field.dynamicOptions.dependsOn
        if (model[depField] !== oldModel?.[depField]) {
          loadFieldOptions(field)
        }
      }
    })
  },
  { deep: true }
)

const rules = computed(() => {
  const result: Record<string, FormRule[]> = {}
  visibleFields.value.forEach((field) => {
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

async function validate(): Promise<boolean> {
  // 清空历史后端校验错误
  Object.keys(validationErrors).forEach((k) => delete validationErrors[k])

  // 本地校验
  const localValid = formRef.value ? await formRef.value.validate() : true
  if (!localValid) return false

  // 后端校验规则
  const ruleFields = visibleFields.value.filter(
    (f) => f.validationRule && props.model[f.prop] !== undefined && props.model[f.prop] !== '' && props.model[f.prop] !== null
  )

  if (!ruleFields.length || !props.validateRules) return true

  const items: ValidateRuleItem[] = ruleFields.map((f) => ({
    code: f.validationRule as string,
    value: props.model[f.prop]
  }))

  try {
    const results = await props.validateRules(items)
    let valid = true
    results.forEach((result, index) => {
      const field = ruleFields[index]
      if (!result.valid) {
        valid = false
        validationErrors[field.prop] = result.message || `${field.label} 校验失败`
      }
    })
    return valid
  } catch (error) {
    console.error('校验规则调用失败', error)
    return false
  }
}

defineExpose({ validate })
</script>

<style scoped>
.w-dynamic-form { }
.w-dynamic-form__error { color: var(--w-color-danger); font-size: var(--w-font-size-small); margin-top: 2px; }
</style>
