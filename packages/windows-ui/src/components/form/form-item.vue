<template>
  <div :class="['w-form-item', `w-form-item--${size}`]">
    <label v-if="label || $slots.label" class="w-form-item__label" :style="{ width: labelWidth }">
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="w-form-item__content">
      <slot />
      <div v-if="error" class="w-form-item__error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, provide, ref, watch, type Ref } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WFormItem' })
const props = defineProps({ label: String, prop: String, size: { type: String, default: undefined } })

const globalSize = useGlobalSize()
const formSize = inject<Ref<string>>('formSize', ref(globalSize.value))
const formLabelWidth = inject<Ref<string | number>>('formLabelWidth', ref('100px'))
const size = computed(() => props.size || formSize?.value || globalSize.value)
const labelWidth = computed(() => {
  const w = formLabelWidth?.value
  if (w === undefined) return '100px'
  return typeof w === 'number' ? `${w}px` : w
})

const errors = inject<Ref<Record<string, string>>>('formErrors', ref({}))
const formModel = inject<Record<string, any> | undefined>('formModel', undefined)
const formResetting = inject<Ref<boolean>>('formResetting', ref(false))
const validateFormField = inject<(prop: string, trigger?: 'blur' | 'change') => Promise<boolean>>('formValidateField', async () => true)

const error = computed(() => (props.prop ? errors.value[props.prop] : ''))

/** 触发本字段校验（供输入组件通过 formItemContext 调用） */
const triggerValidate = (trigger?: 'blur' | 'change') => {
  if (!props.prop) return
  validateFormField(props.prop, trigger)
}

// 向插槽内的输入组件暴露字段上下文，输入组件在 blur/change 时调用 triggerValidate
provide('wFormItemContext', { prop: props.prop, triggerValidate })

// change 触发：监听 model 值变化（覆盖所有写入 model 的输入组件，无需逐个接入）
if (props.prop && formModel) {
  watch(() => formModel[props.prop!], () => {
    if (!formResetting.value) triggerValidate('change')
  })
}

defineExpose({ validate: () => triggerValidate(), clearValidate: () => { if (props.prop) delete errors.value[props.prop] } })
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
