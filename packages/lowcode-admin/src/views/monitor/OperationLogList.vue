<template>
  <div class="list-page">
    <w-card header="操作日志">
      <w-crud-table
        :data="list"
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
          <w-form-item label="关键词">
            <w-input v-model="query.keyword" placeholder="用户/模块/操作" />
          </w-form-item>
        </template>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '成功' : '失败' }}</w-tag>
        </template>
      </w-crud-table>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as monitorApi from '@/api/monitor'

const list = ref<any[]>([])
const total = ref(0)
const query = reactive({ keyword: '', page: 1, pageSize: 10 })

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'username', label: '用户' },
  { prop: 'module', label: '模块' },
  { prop: 'action', label: '操作' },
  { prop: 'method', label: '方法', width: 70 },
  { prop: 'path', label: '路径', showOverflowTooltip: true },
  { prop: 'duration', label: '耗时(ms)', width: 90 },
  { prop: 'status', label: '状态', width: 80 },
  { prop: 'create_time', label: '时间' }
]

onMounted(() => loadData())

async function loadData() {
  const result = await monitorApi.getOperationLogs(query)
  list.value = result.list
  total.value = result.total
}

async function handleSearch() {
  query.page = 1
  await loadData()
}

async function handleReset() {
  query.keyword = ''
  query.page = 1
  await loadData()
}

async function handlePageChange(page: number) {
  query.page = page
  await loadData()
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>
