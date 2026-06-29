<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('日期选择面板')" id="date-picker-panel" doc="date-picker-panel">

      <demo-block :title="t('基础用法')" :code="codeBasic">
        <w-date-picker-panel v-model="value" />
        <p class="demo-note">{{ t('当前选中：') }}{{ value }}</p>
      </demo-block>

      <demo-block :title="t('尺寸')" :code="codeSize">
        <w-space>
          <w-date-picker-panel v-model="value" size="small" />
          <w-date-picker-panel v-model="value" size="large" />
        </w-space>
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
const title = 'DatePickerPanel 日期面板'

const value = ref('')

const codeBasic = `<script setup>
import { ref } from 'vue'
const value = ref('')
<\/script>

<template>
  <w-date-picker-panel v-model="value" />
<\/template>`

const codeSize = `<template>
  <w-space>
    <w-date-picker-panel v-model="value" size="small" />
    <w-date-picker-panel v-model="value" size="large" />
  </w-space>
<\/template>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.demo-note { margin-top: 12px; font-size: 12px; color: #666; }
</style>
