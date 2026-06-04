<template>
  <form class="w-form" @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'

defineOptions({ name: 'WForm' })
const props = defineProps({ model: Object, rules: Object })
const emit = defineEmits(['submit'])

const errors = ref<Record<string, string>>({})
provide('formErrors', errors)
provide('formModel', props.model)
provide('formRules', props.rules)

const handleSubmit = () => { emit('submit', props.model) }
</script>

<style scoped>
.w-form { padding: 8px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; }
</style>
