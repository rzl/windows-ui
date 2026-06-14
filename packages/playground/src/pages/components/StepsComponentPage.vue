<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('流程步骤')" id="steps" doc="steps">

      <demo-block :title="t('基础用法')" :code="StepsCode1"><w-steps :items="[{ title: '步骤1', description: '描述1' }, { title: '步骤2', description: '描述2' }, { title: '步骤3' }]" :active="1" /></demo-block>
      <demo-block :title="t('已完成')" :code="StepsCode2"><w-steps :items="[{ title: '提交' }, { title: '审核' }, { title: '完成' }]" :active="3" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const alert = (msg: string) => window.alert(msg)

const title = t('Steps 步骤条')

const StepsCode1 = `<w-steps :items="[{ title: '步骤1', description: '描述1' }, { title: '步骤2', description: '描述2' }, { title: '步骤3' }]" :active="1" />`
const StepsCode2 = `<w-steps :items="[{ title: '提交' }, { title: '审核' }, { title: '完成' }]" :active="3" />`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
