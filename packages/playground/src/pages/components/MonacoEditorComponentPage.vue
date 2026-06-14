<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('在线 Monaco 代码编辑器')" id="monaco-editor" doc="monaco-editor">

      <demo-block :title="t('JavaScript 编辑器')" :code="jsCode">
        <w-monaco-editor v-model="code" language="javascript" :height="200" />
        <div style="margin-top:8px">value: {{ code }}</div>
      </demo-block>

      <demo-block :title="t('SQL 编辑器')" :code="sqlCode">
        <w-monaco-editor v-model="sql" language="sql" :height="200" />
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
const title = t('Monaco Editor 在线编辑器')
const code = ref('function hello() {\n  console.log("Hello Monaco")\n}')
const sql = ref('SELECT * FROM users WHERE status = 1')
const jsCode = `<w-monaco-editor v-model="code" language="javascript" :height="200" />`
const sqlCode = `<w-monaco-editor v-model="sql" language="sql" :height="200" />`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
