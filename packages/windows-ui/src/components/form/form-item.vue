<template>
  <div :class="['w-form-item', `w-form-item--${size}`]">
    <label v-if="label" class="w-form-item__label" :style="{ width: labelWidth }">{{ label }}</label>
    <div class="w-form-item__content">
      <slot />
      <div v-if="error" class="w-form-item__error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, onMounted, ref, type Ref } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WFormItem' })
const props = defineProps({ label: String, prop: String, size: { type: String, default: undefined } })

const formSize = inject<Ref<string>>('formSize')
const formLabelWidth = inject<Ref<string | number>>('formLabelWidth')
const globalSize = useGlobalSize()
const size = computed(() => props.size || formSize?.value || globalSize.value)
const labelWidth = computed(() => {
  const w = formLabelWidth?.value
  if (w === undefined) return '100px'
  return typeof w === 'number' ? `${w}px` : w
})

const errors = inject<Ref<Record<string, string>>>('formErrors', ref({}))
const formModel = inject<Record<string, any>>('formModel', {})
const formRules = inject<Record<string, any[]>>('formRules', {})
const registerField = inject<(field: any) => void>('formRegisterField', () => {})

const error = computed(() => (props.prop ? errors.value[props.prop] : ''))

onMounted(() => {
  if (props.prop) {
    registerField({
      prop: props.prop,
      validate: async () => {
        const rules = formRules[props.prop!]
        if (!rules) return true
        const value = formModel[props.prop!]
        for (const rule of rules) {
          if (rule.required && (value === undefined || value === '' || value === null)) {
            return false
          }
          if (rule.pattern && !rule.pattern.test(String(value))) {
            return false
          }
          if (rule.validator) {
            const result = await rule.validator(value)
            if (result !== true) return false
          }
          if (rule.asyncValidator) {
            const result = await rule.asyncValidator(value)
            if (result !== true) return false
          }
        }
        return true
      }
    })
  }
})
</script>

<style scoped>
.w-form-item { display: flex; align-items: flex-start; margin-bottom: 12px; }
.w-form-item__label { width: 100px; text-align: right; padding-right: 8px; font-size: var(--w-font-size-base); display: flex; align-items: center; justify-content: flex-end; min-height: var(--w-component-size); }
.w-form-item__content { flex: 1; }
.w-form-item__error { color: var(--w-color-danger); font-size: var(--w-font-size-small); margin-top: 2px; }
.w-form-item--small .w-form-item__label { font-size: var(--w-font-size-small); min-height: var(--w-component-size-small); }
.w-form-item--large .w-form-item__label { font-size: var(--w-font-size-medium); min-height: var(--w-component-size-large); }

@media (max-width: 768px) {
  .w-form-item { flex-direction: column; }
  .w-form-item__label { width: auto; text-align: left; justify-content: flex-start; padding-right: 0; margin-bottom: 4px; }
  .w-form-item__content { width: 100%; }
}
</style>
