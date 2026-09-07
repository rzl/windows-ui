<template>
  <div class="list-page">
    <w-crud-table
      :data="delegations"
      :columns="columns"
      :query="query"
      :total="total"
      :current-page="query.page"
      :page-size="query.pageSize"
      :searchable="false"
      storage-key="flow-delegation"
      column-draggable
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template #toolbar>
        <w-button type="primary" @click="openDialog()">+ 新增委托</w-button>
      </template>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #timeRange="{ row }">
        {{ row.start_time }} ~ {{ row.end_time }}
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="openDialog(row)">编辑</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-crud-table>

    <w-dialog v-model="dialogVisible" title="流程委托" width="520">
      <w-form :model="formModel">
        <w-form-item label="委托人" required>
          <w-select v-model="formModel.delegatorId" :options="userOptions" placeholder="选择委托人" />
        </w-form-item>
        <w-form-item label="受托人" required>
          <w-select v-model="formModel.delegateeId" :options="userOptions" placeholder="选择受托人" />
        </w-form-item>
        <w-form-item label="限定流程">
          <w-select v-model="formModel.flowCode" :options="flowOptions" clearable placeholder="不选则委托全部流程" />
        </w-form-item>
        <w-form-item label="开始时间" required>
          <w-input v-model="formModel.startTime" type="datetime-local" />
        </w-form-item>
        <w-form-item label="结束时间" required>
          <w-input v-model="formModel.endTime" type="datetime-local" />
        </w-form-item>
        <w-form-item label="启用">
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
import { onMounted, reactive, ref } from 'vue'
import * as flowApi from '@/api/flow'
import * as userApi from '@/api/user'

const delegations = ref<any[]>([])
const total = ref(0)
const query = reactive<any>({ page: 1, pageSize: 10 })
const dialogVisible = ref(false)
const formModel = reactive<any>({})
const userOptions = ref<any[]>([])
const flowOptions = ref<any[]>([])

const columns = [
  { prop: 'delegator_name', label: '委托人' },
  { prop: 'delegatee_name', label: '受托人' },
  { prop: 'flow_code', label: '限定流程' },
  { prop: 'timeRange', label: '有效期' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

onMounted(() => loadData())

async function loadData() {
  const [delegationData, userData, flowData] = await Promise.all([
    flowApi.getFlowDelegations({ page: query.page, pageSize: query.pageSize }),
    userApi.getUsers({ page: 1, pageSize: 1000, status: 1 }),
    flowApi.getFlowDefinitions()
  ])
  delegations.value = delegationData.list
  total.value = delegationData.total
  userOptions.value = userData.list.map((u: any) => ({ label: u.username, value: u.id }))
  flowOptions.value = flowData.map((f: any) => ({ label: f.name, value: f.code }))
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
    formModel.delegatorId = row.delegator_id
    formModel.delegateeId = row.delegatee_id
    formModel.flowCode = row.flow_code || undefined
    formModel.startTime = formatDateTimeLocal(row.start_time)
    formModel.endTime = formatDateTimeLocal(row.end_time)
  } else {
    formModel.status = true
    const now = new Date()
    const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    formModel.startTime = formatDateTimeLocal(now.toISOString())
    formModel.endTime = formatDateTimeLocal(end.toISOString())
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

function formatDateTimeLocal(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function handleSave() {
  const payload = {
    delegatorId: formModel.delegatorId,
    delegateeId: formModel.delegateeId,
    flowCode: formModel.flowCode || null,
    startTime: new Date(formModel.startTime).toISOString(),
    endTime: new Date(formModel.endTime).toISOString(),
    status: formModel.status ? 1 : 0
  }
  if (formModel.id) {
    await flowApi.updateFlowDelegation(formModel.id, payload)
  } else {
    await flowApi.createFlowDelegation(payload)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm('确定删除该委托吗？')) {
    await flowApi.deleteFlowDelegation(row.id)
    await loadData()
  }
}

async function handlePageChange(page: number) {
  query.page = page
  await loadData()
}

async function handleSizeChange(size: number) {
  query.pageSize = size
  query.page = 1
  await loadData()
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>
