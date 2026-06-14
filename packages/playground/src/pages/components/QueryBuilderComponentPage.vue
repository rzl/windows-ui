<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('多条件组合高级查询')" id="query-builder" doc="query-builder">

      <demo-block :title="t('基础用法')" ::code="QueryBuilderCode1">
        <w-query-builder :fields="fields" @search="handleSearch" @reset="handleReset" />
        <p class="demo-note">{{ t('当前条件：') }}{{ JSON.stringify(conditions) }}</p>
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
const title = 'QueryBuilder 高级查询'

const fields = [
  { prop: 'username', label: t('用户名') },
  { prop: 'age', label: t('年龄') },
  { prop: 'email', label: t('邮箱') },
  { prop: 'status', label: t('状态') }
]

const conditions = ref<any[]>([])

function handleSearch(vals: any[]) {
  conditions.value = vals
}

function handleReset() {
  conditions.value = []
}

const codeBasic = `&lt;w-query-builder :fields=&quot;fields&quot; @search=&quot;handleSearch&quot; @reset=&quot;handleReset&quot; /&gt;

const fields = [
  { prop: 'username', label: '用户名' },
  { prop: 'age', label: '年龄' },
  { prop: 'email', label: '邮箱' }
]`

const QueryBuilderCode1 = `codeBasic`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.demo-note { margin-top: 12px; font-size: 12px; color: #666; word-break: break-all; }
</style>
