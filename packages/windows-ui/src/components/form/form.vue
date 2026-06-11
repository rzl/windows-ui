<template>
  <form class="w-form" @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { provide, ref, computed } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

export interface FormRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  validator?: (value: any) => boolean | string
}

defineOptions({ name: 'WForm' })
const props = defineProps({
  model: Object as () => Record<string, any>,
  rules: Object as () => Record<string, FormRule[]>,
  size: { type: String, default: undefined }
})
const emit = defineEmits(['submit', 'validate'])

const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)

const errors = ref<Record<string, string>>({})
const fieldRefs = ref<any[]>([])

provide('formSize', size)
provide('formErrors', errors)
provide('formModel', props.model)
provide('formRules', props.rules)
provide('formRegisterField', (field: any) => {
  fieldRefs.value.push(field)
})

const validate = async (): Promise<boolean> => {
  errors.value = {}
  if (!props.rules || !props.model) return true

  let valid = true
  for (const [prop, rules] of Object.entries(props.rules)) {
    const value = props.model[prop]
    for (const rule of rules) {
      if (rule.required && (value === undefined || value === '' || value === null || (Array.isArray(value) && value.length === 0))) {
        errors.value[prop] = rule.message || `${prop} 不能为空`
        valid = false
        break
      }
      if (rule.pattern && value !== undefined && value !== '' && !rule.pattern.test(String(value))) {
        errors.value[prop] = rule.message || `${prop} 格式不正确`
        valid = false
        break
      }
      if (rule.min !== undefined && typeof value === 'string' && value.length < rule.min) {
        errors.value[prop] = rule.message || `${prop} 最少 ${rule.min} 个字符`
        valid = false
        break
      }
      if (rule.max !== undefined && typeof value === 'string' && value.length > rule.max) {
        errors.value[prop] = rule.message || `${prop} 最多 ${rule.max} 个字符`
        valid = false
        break
      }
      if (rule.validator) {
        const result = rule.validator(value)
        if (result !== true) {
          errors.value[prop] = typeof result === 'string' ? result : (rule.message || `${prop} 验证失败`)
          valid = false
          break
        }
      }
    }
  }
  emit('validate', valid, errors.value)
  return valid
}

const resetFields = () => {
  errors.value = {}
  if (props.model) {
    Object.keys(props.model).forEach((key) => {
      props.model![key] = undefined
    })
  }
}

const clearValidate = () => {
  errors.value = {}
}

const handleSubmit = () => {
  validate().then((valid) => {
    if (valid) emit('submit', props.model)
  })
}

defineExpose({ validate, resetFields, clearValidate })
</script>

<style scoped>
.w-form { padding: 8px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; }
</style>
