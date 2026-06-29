<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('多条件组合高级查询')" id="advanced-query-builder" doc="advanced-query-builder">

      <demo-block :title="t('基础用法')" :code="codeBasic">
        <w-advanced-query-builder
          v-model="query"
          :fields="fields"
          @search="handleSearch"
          @reset="handleReset"
        />
        <p class="demo-note">{{ t('当前条件：') }}{{ JSON.stringify(query) }}</p>
      </demo-block>

      <demo-block :title="t('自定义运算符')" :code="codeCustomOps">
        <w-advanced-query-builder
          v-model="query2"
          :fields="fields"
          :operators="operators"
          @search="handleSearch"
        />
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
const title = 'AdvancedQueryBuilder 高级查询'

const fields = [
  { prop: 'username', label: t('用户名'), type: 'string' },
  { prop: 'age', label: t('年龄'), type: 'number' },
  { prop: 'status', label: t('状态'), type: 'select', options: [{ label: t('启用'), value: 1 }, { label: t('禁用'), value: 0 }] },
  { prop: 'createdAt', label: t('创建时间'), type: 'date' }
]

const query = ref({ logic: 'and', conditions: [] })
const query2 = ref({ logic: 'and', conditions: [] })

const operators = [
  { label: t('等于'), value: 'eq' },
  { label: t('包含'), value: 'like' },
  { label: t('大于'), value: 'gt' }
]

function handleSearch(vals: any) {
  console.log(vals)
}

function handleReset() {
  query.value = { logic: 'and', conditions: [] }
}

const codeBasic = `<script setup>
import { ref } from 'vue'

const query = ref({ logic: 'and', conditions: [] })
const fields = [
  { prop: 'username', label: '用户名', type: 'string' },
  { prop: 'age', label: '年龄', type: 'number' },
  { prop: 'status', label: '状态', type: 'select', options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] },
  { prop: 'createdAt', label: '创建时间', type: 'date' }
]
function handleSearch(vals) { console.log(vals) }
function handleReset() { query.value = { logic: 'and', conditions: [] } }
<\/script>

<template>
  <w-advanced-query-builder v-model="query" :fields="fields" @search="handleSearch" @reset="handleReset" />
<\/template>`

const codeCustomOps = `<script setup>
import { ref } from 'vue'
const query = ref({ logic: 'and', conditions: [] })
const fields = [
  { prop: 'username', label: '用户名', type: 'string' },
  { prop: 'age', label: '年龄', type: 'number' }
]
const operators = [
  { label: '等于', value: 'eq' },
  { label: '包含', value: 'like' },
  { label: '大于', value: 'gt' }
]
<\/script>

<template>
  <w-advanced-query-builder v-model="query" :fields="fields" :operators="operators" />
<\/template>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.demo-note { margin-top: 12px; font-size: 12px; color: #666; word-break: break-all; }
</style>
