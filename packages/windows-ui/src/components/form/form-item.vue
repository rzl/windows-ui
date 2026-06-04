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
import { inject, computed } from 'vue'

defineOptions({ name: 'WFormItem' })
const props = defineProps({ label: String, prop: String })
const errors = inject<Record<string, string>>('formErrors', {})
const error = computed(() => (props.prop ? errors[props.prop] : ''))
</script>

<style scoped>
.w-form-item { margin-bottom: 12px; }
.w-form-item__label { display: inline-block; width: 100px; text-align: right; padding-right: 8px; font-size: var(--w-font-size-base); vertical-align: top; padding-top: 4px; }
.w-form-item__content { display: inline-block; vertical-align: top; }
.w-form-item__error { color: var(--w-color-danger); font-size: var(--w-font-size-small); margin-top: 2px; }
</style>
