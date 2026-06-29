<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('虚拟化下拉选择，支持海量选项')" id="virtualized-select" doc="virtualized-select">

      <demo-block :title="t('基础用法')" :code="codeBasic">
        <w-virtualized-select v-model="value" :options="options" :placeholder="t('请选择')" />
        <p class="demo-note">{{ t('已选：') }}{{ value }}</p>
      </demo-block>

      <demo-block :title="t('多选')" :code="codeMultiple">
        <w-virtualized-select v-model="values" :options="options" multiple :placeholder="t('可多选')" />
        <p class="demo-note">{{ t('已选：') }}{{ values.join(', ') }}</p>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const { t } = useI18n()
const title = 'VirtualizedSelect 虚拟化选择器'

const value = ref('')
const values = ref<string[]>([])
const options = Array.from({ length: 1000 }, (_, i) => ({
  label: t('选项 ') + (i + 1),
  value: String(i + 1)
}))

const codeBasic = `<script setup>
import { ref } from 'vue'
const value = ref('')
const options = Array.from({ length: 1000 }, (_, i) => ({
  label: '选项 ' + (i + 1),
  value: String(i + 1)
}))
<\/script>

<template>
  <w-virtualized-select v-model="value" :options="options" placeholder="请选择" />
<\/template>`

const codeMultiple = `<script setup>
import { ref } from 'vue'
const values = ref([])
const options = Array.from({ length: 1000 }, (_, i) => ({
  label: '选项 ' + (i + 1),
  value: String(i + 1)
}))
<\/script>

<template>
  <w-virtualized-select v-model="values" :options="options" multiple placeholder="可多选" />
<\/template>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.demo-note { margin-top: 12px; font-size: 12px; color: #666; word-break: break-all; }
</style>
