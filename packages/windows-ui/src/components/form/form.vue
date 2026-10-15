<template>
  <form class="w-form" @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { provide, ref, computed, onMounted, nextTick, reactive } from 'vue'
import { useGlobalSize } from '../../utils/prefix'
import { useLocale } from '../../locale'

export interface FormRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  /** 触发时机：不传则 blur / change 均触发 */
  trigger?: 'blur' | 'change'
  validator?: (value: any) => boolean | string | Promise<boolean | string>
  asyncValidator?: (value: any) => Promise<boolean | string>
}

export type FormValidateTrigger = 'blur' | 'change'

defineOptions({ name: 'WForm' })
const props = defineProps({
  model: Object as () => Record<string, any>,
  rules: Object as () => Record<string, FormRule[]>,
  size: { type: String, default: undefined },
  labelWidth: { type: [String, Number], default: '100px' }
})
const emit = defineEmits(['submit', 'validate'])

const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const { t } = useLocale()

const errors = ref<Record<string, string>>({})
// resetFields 恢复初始值期间为 true，form-item 的 change 监听据此跳过校验
const resetting = ref(false)
// 挂载时记录初始值，resetFields 恢复
let initialValues: Record<string, any> = {}

onMounted(() => {
  if (props.model) initialValues = { ...props.model }
})

/** 校验单值：返回错误信息或 true。按 trigger 过滤规则。 */
const validateValue = async (prop: string, value: any, rules: FormRule[], trigger?: FormValidateTrigger): Promise<string | true> => {
  for (const rule of rules) {
    if (trigger && rule.trigger && rule.trigger !== trigger) continue
    const isEmpty = value === undefined || value === '' || value === null || (Array.isArray(value) && value.length === 0)
    if (rule.required && isEmpty) {
      return rule.message || t('字段不能为空', { field: prop })
    }
    // 非必填字段为空时跳过后续规则
    if (isEmpty && !rule.required) continue
    if (rule.pattern && !rule.pattern.test(String(value))) {
      return rule.message || t('字段格式不正确', { field: prop })
    }
    if (rule.min !== undefined && typeof value === 'string' && value.length < rule.min) {
      return rule.message || t('字段最少字符', { min: rule.min })
    }
    if (rule.max !== undefined && typeof value === 'string' && value.length > rule.max) {
      return rule.message || t('字段最多字符', { max: rule.max })
    }
    if (rule.validator) {
      const result = await rule.validator(value)
      if (result !== true) {
        return typeof result === 'string' ? result : (rule.message || t('字段验证失败', { field: prop }))
      }
    }
    if (rule.asyncValidator) {
      const result = await rule.asyncValidator(value)
      if (result !== true) {
        return typeof result === 'string' ? result : (rule.message || t('字段验证失败', { field: prop }))
      }
    }
  }
  return true
}

/** 校验单个字段并更新错误信息 */
const validateField = async (prop: string, trigger?: FormValidateTrigger): Promise<boolean> => {
  const rules = props.rules?.[prop]
  if (!rules || !rules.length) {
    delete errors.value[prop]
    return true
  }
  const result = await validateValue(prop, props.model?.[prop], rules, trigger)
  if (result === true) {
    delete errors.value[prop]
    return true
  }
  errors.value[prop] = result
  return false
}

const validate = async (fields?: string[]): Promise<boolean> => {
  errors.value = {}
  if (!props.rules || !props.model) return true

  const targets = fields || Object.keys(props.rules)
  const results = await Promise.all(targets.map((prop) => validateField(prop)))
  const valid = results.every(Boolean)
  emit('validate', valid, errors.value)
  return valid
}

const resetFields = () => {
  errors.value = {}
  if (!props.model) return
  resetting.value = true
  Object.keys(props.model).forEach((key) => {
    props.model![key] = initialValues[key]
  })
  nextTick(() => { resetting.value = false })
}

const clearValidate = (fields?: string[]) => {
  if (fields) {
    fields.forEach((f) => { delete errors.value[f] })
  } else {
    errors.value = {}
  }
}

const handleSubmit = () => {
  validate().then((valid) => {
    if (valid) emit('submit', props.model)
  })
}

provide('formSize', size)
provide('formLabelWidth', computed(() => props.labelWidth))
provide('formErrors', errors)
// 用 reactive 包装，保证 model 为普通对象时 form-item 的 change 监听依然生效（对已是 reactive 的对象返回原代理）
provide('formModel', props.model ? reactive(props.model) : undefined)
provide('formRules', props.rules)
provide('formResetting', resetting)
provide('formValidateField', validateField)

defineExpose({ validate, validateField, resetFields, clearValidate })
</script>

<style scoped>
.w-form { padding: 8px; background: var(--w-bg-color); border: solid var(--w-xp-bevel-light); border-width: 2px 0 0 2px; }
</style>
