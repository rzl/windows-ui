<template>
  <div class="list-page">
    <w-crud-table
      :data="pagedList"
      :columns="columns"
      :query="query"
      :total="total"
      :current-page="query.page"
      :page-size="query.pageSize"
      :searchable="false"
      storage-key="report-report-list"
      column-draggable
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template #toolbar>
        <w-button type="primary" @click="openDialog()">+ 新增报表</w-button>
      </template>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="goRun(row)">运行</w-button>
          <w-button size="small" @click="goDesign(row)">设计</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-crud-table>

    <w-dialog v-model="dialogVisible" title="报表" width="520">
      <w-form :model="formModel">
        <w-form-item label="报表编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" placeholder="英文编码" />
        </w-form-item>
        <w-form-item label="报表名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="数据模型">
          <w-select v-model="formModel.modelCode" :options="modelOptions" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="formModel.status" active-text="启用" inactive-text="禁用" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeDialog">取消</w-button>
        <w-button type="primary" @click="handleSave">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as reportApi from '@/api/report'
import * as lowcodeApi from '@/api/lowcode'

const router = useRouter()
const reports = ref<any[]>([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 10 })
const models = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})

// 后端接口暂不支持分页，一次性返回全量数据，这里在前端做分页切片
const pagedList = computed(() =>
  reports.value.slice((query.page - 1) * query.pageSize, query.page * query.pageSize)
)

const columns = [
  { prop: 'code', label: '报表编码' },
  { prop: 'name', label: '报表名称' },
  { prop: 'model_code', label: '数据模型' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 220, fixed: 'right' }
]

const modelOptions = ref<any[]>([])

onMounted(() => loadData())

async function loadData() {
  const [reportData, modelData] = await Promise.all([
    reportApi.getReports(),
    lowcodeApi.getModels()
  ])
  reports.value = reportData
  total.value = reports.value.length
  models.value = modelData
  modelOptions.value = modelData.map((m: any) => ({ label: m.name, value: m.code }))
}

function handlePageChange(page: number) {
  // 纯前端分页，无需重新请求
  query.page = page
}

function handleSizeChange(size: number) {
  query.pageSize = size
  query.page = 1
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
  } else {
    formModel.status = true
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleSave() {
  const data = JSON.parse(JSON.stringify(formModel))
  data.status = data.status ? 1 : 0
  await reportApi.saveReport({
    code: data.code,
    name: data.name,
    modelCode: data.modelCode,
    status: data.status
  })
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除报表 ${row.name} 吗？`)) {
    await reportApi.deleteReport(row.id)
    await loadData()
  }
}

function goDesign(row: any) {
  router.push(`/report/design/${row.code}`)
}

function goRun(row: any) {
  router.push(`/report/run/${row.code}`)
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>
