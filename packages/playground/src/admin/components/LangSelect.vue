<template>
  <w-select v-model="locale" :options="options" style="width:100px" @change="handleChange">
    <template #trigger>
      <w-button size="small">{{ currentLabel }}</w-button>
    </template>
  </w-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const options = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
]

const currentLabel = computed(() => {
  return options.find((o) => o.value === locale.value)?.label || '中文'
})

function handleChange(val: string) {
  locale.value = val
  localStorage.setItem('admin_lang', val)
}
</script>
