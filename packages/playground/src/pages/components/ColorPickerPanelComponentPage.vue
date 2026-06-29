<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('颜色选择面板')" id="color-picker-panel" doc="color-picker-panel">

      <demo-block :title="t('基础用法')" :code="codeBasic">
        <w-color-picker-panel v-model="color" />
        <p class="demo-note">{{ t('当前颜色：') }}{{ color }}</p>
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
const title = 'ColorPickerPanel 颜色面板'

const color = ref('#245edb')

const codeBasic = `<script setup>
import { ref } from 'vue'
const color = ref('#245edb')
<\/script>

<template>
  <w-color-picker-panel v-model="color" />
  <p>当前颜色：{{ color }}</p>
<\/template>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.demo-note { margin-top: 12px; font-size: 12px; color: #666; }
</style>
