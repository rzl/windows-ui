<template>
  <div class="w-form-item">
    <label v-if="label" class="w-form-item__label">{{ label }}</label>
    <div class="w-form-item__content">
      <slot />
      <div v-if="error" class="w-form-item__error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, onMounted } from 'vue'

defineOptions({ name: 'WFormItem' })
const props = defineProps({ label: String, prop: String })

const errors = inject<Record<string, string>>('formErrors', {})
const formModel = inject<Record<string, any>>('formModel', {})
const formRules = inject<Record<string, any[]>>('formRules', {})
const registerField = inject<(field: any) => void>('formRegisterField', () => {})

const error = computed(() => (props.prop ? errors[props.prop] : ''))

onMounted(() => {
  if (props.prop) {
    registerField({
      prop: props.prop,
      validate: () => {
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
            const result = rule.validator(value)
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
.w-form-item { margin-bottom: 12px; }
.w-form-item__label { display: inline-block; width: 100px; text-align: right; padding-right: 8px; font-size: var(--w-font-size-base); vertical-align: top; padding-top: 4px; }
.w-form-item__content { display: inline-block; vertical-align: top; }
.w-form-item__error { color: var(--w-color-danger); font-size: var(--w-font-size-small); margin-top: 2px; }
</style>
