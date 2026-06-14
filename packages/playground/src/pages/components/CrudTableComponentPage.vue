<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('基于 WTable + WPagination + WSearchForm 的 CRUD 封装')" id="crud-table" doc="crud-table">

      <demo-block :title="t('基础用法')" ::code="CrudTableCode1">
        <w-crud-table
          :data="tableData"
          :columns="columns"
          :query="query"
          :total="total"
          :current-page="query.page"
          :page-size="query.pageSize"
          @search="handleSearch"
          @reset="handleReset"
          @page-change="handlePageChange"
        >
          <template #search>
            <w-form-item :label="t('关键词')">
              <w-input v-model="query.keyword" :placeholder="t('用户名/邮箱')" />
            </w-form-item>
            <w-form-item :label="t('状态')">
              <w-select v-model="query.status" :options="statusOptions" :placeholder="t('请选择')" clearable />
            </w-form-item>
          </template>
          <template #toolbar>
            <w-button type="primary">+ {{ t('新增') }}</w-button>
            <w-button type="danger" :disabled="selected.length === 0">{{ t('批量删除') }}</w-button>
          </template>
          <template #status="{ row }">
            <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? t('启用') : t('禁用') }}</w-tag>
          </template>
          <template #action="{ row }">
            <w-space>
              <w-button size="small" @click="handleEdit(row)">{{ t('编辑') }}</w-button>
              <w-button size="small" type="danger" @click="handleDelete(row)">{{ t('删除') }}</w-button>
            </w-space>
          </template>
        </w-crud-table>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const { t } = useI18n()
const title = 'CrudTable 高级表格'

const allData = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  username: t('用户') + (i + 1),
  email: 'user' + (i + 1) + '@example.com',
  department: [t('技术部'), t('产品部'), t('设计部'), t('运营部')][i % 4],
  status: i % 3 === 0 ? 0 : 1
}))

const columns = [
  { type: 'selection' as const, width: 48 },
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'username', label: t('用户名') },
  { prop: 'email', label: t('邮箱') },
  { prop: 'department', label: t('部门') },
  { prop: 'status', label: t('状态') },
  { prop: 'action', label: t('操作'), width: 140 }
]

const statusOptions = [
  { label: t('全部'), value: '' },
  { label: t('启用'), value: '1' },
  { label: t('禁用'), value: '0' }
]

const query = reactive({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 10
})

const tableData = ref<any[]>([])
const total = ref(0)
const selected = ref<any[]>([])

function filterData() {
  return allData.filter((item) => {
    const matchKeyword = !query.keyword ||
      item.username.includes(query.keyword) ||
      item.email.includes(query.keyword)
    const matchStatus = query.status === '' || String(item.status) === query.status
    return matchKeyword && matchStatus
  })
}

function refresh() {
  const filtered = filterData()
  total.value = filtered.length
  const start = (query.page - 1) * query.pageSize
  tableData.value = filtered.slice(start, start + query.pageSize)
}

refresh()

function handleSearch() {
  query.page = 1
  refresh()
}

function handleReset() {
  query.keyword = ''
  query.status = ''
  query.page = 1
  refresh()
}

function handlePageChange(page: number) {
  query.page = page
  refresh()
}

function handleEdit(row: any) {
  alert(t('编辑：') + row.username)
}

function handleDelete(row: any) {
  alert(t('删除：') + row.username)
}

const codeBasic = `&lt;w-crud-table
  :data=&quot;tableData&quot;
  :columns=&quot;columns&quot;
  :query=&quot;query&quot;
  :total=&quot;total&quot;
  :current-page=&quot;query.page&quot;
  :page-size=&quot;query.pageSize&quot;
  @search=&quot;handleSearch&quot;
  @reset=&quot;handleReset&quot;
  @page-change=&quot;handlePageChange&quot;
&gt;
  &lt;template #search&gt;
    &lt;w-form-item label=&quot;关键词&quot;&gt;
      &lt;w-input v-model=&quot;query.keyword&quot; /&gt;
    &lt;/w-form-item&gt;
  &lt;/template&gt;
  &lt;template #toolbar&gt;
    &lt;w-button type=&quot;primary&quot;&gt;+ 新增&lt;/w-button&gt;
  &lt;/template&gt;
  &lt;template #status=&quot;{ row }&quot;&gt;
    &lt;w-tag&gt;{{ row.status }}&lt;/w-tag&gt;
  &lt;/template&gt;
&lt;/w-crud-table&gt;`

const CrudTableCode1 = `codeBasic`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
