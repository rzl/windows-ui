<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('虚拟化表格，支持大数据量')" id="virtualized-table" doc="virtualized-table">

      <demo-block :title="t('基础用法')" :code="codeBasic">
        <w-virtualized-table :data="data" :columns="columns" :height="300" />
      </demo-block>

      <demo-block :title="t('固定列')" :code="codeFixed">
        <w-virtualized-table :data="data" :columns="fixedColumns" :height="300" />
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const { t } = useI18n()
const title = 'VirtualizedTable 虚拟化表格'

const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: t('名称') },
  { prop: 'email', label: t('邮箱') },
  { prop: 'department', label: t('部门') }
]

const fixedColumns = [
  { prop: 'id', label: 'ID', width: 80, fixed: 'left' },
  { prop: 'name', label: t('名称'), width: 120 },
  { prop: 'email', label: t('邮箱'), width: 180 },
  { prop: 'department', label: t('部门'), width: 120 },
  { prop: 'status', label: t('状态'), width: 80, fixed: 'right' }
]

const data = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: t('用户 ') + (i + 1),
  email: 'user' + (i + 1) + '@example.com',
  department: [t('技术部'), t('产品部'), t('设计部'), t('运营部')][i % 4],
  status: [t('在职'), t('休假'), t('实习')][i % 3]
}))

const codeBasic = `<script setup>
const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '名称' },
  { prop: 'email', label: '邮箱' },
  { prop: 'department', label: '部门' }
]
const data = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  email: 'user' + (i + 1) + '@example.com',
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4]
}))
<\/script>

<template>
  <w-virtualized-table :data="data" :columns="columns" :height="300" />
<\/template>`

const codeFixed = `<script setup>
const fixedColumns = [
  { prop: 'id', label: 'ID', width: 80, fixed: 'left' },
  { prop: 'name', label: '名称', width: 120 },
  { prop: 'email', label: '邮箱', width: 180 },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'status', label: '状态', width: 80, fixed: 'right' }
]
<\/script>

<template>
  <w-virtualized-table :data="data" :columns="fixedColumns" :height="300" />
<\/template>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
