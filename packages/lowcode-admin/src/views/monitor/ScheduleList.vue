<template>
  <div class="list-page">
    <w-card header="定时任务">
      <div class="toolbar">
        <w-button type="primary" @click="openDialog()">+ 新增任务</w-button>
      </div>
      <w-table :data="tasks" :columns="columns" stripe border>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" @click="openDialog(row)">编辑</w-button>
            <w-button size="small" @click="handleRun(row)">执行</w-button>
            <w-button size="small" @click="openLog(row)">日志</w-button>
            <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

    <w-dialog v-model="dialogVisible" title="定时任务" width="520">
      <w-form :model="formModel">
        <w-form-item label="任务编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" />
        </w-form-item>
        <w-form-item label="任务名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="Cron 表达式">
          <w-input v-model="formModel.cron" placeholder="如 0 0 * * *" />
        </w-form-item>
        <w-form-item label="处理器类型">
          <w-select v-model="formModel.handlerType" :options="handlerTypeOptions" />
        </w-form-item>
        <w-form-item v-if="formModel.handlerType === 'sql'" label="SQL">
          <textarea v-model="handlerConfig.sql" class="w-xp-textarea" rows="3" placeholder="SELECT ..." />
        </w-form-item>
        <w-form-item v-if="formModel.handlerType === 'api'" label="接口配置">
          <textarea v-model="apiConfigText" class="w-xp-textarea" rows="3" placeholder='{"method":"GET","url":"/api/..."}' />
        </w-form-item>
        <w-form-item v-if="formModel.handlerType === 'script'" label="执行脚本">
          <textarea v-model="handlerConfig.script" class="w-xp-textarea" rows="4" placeholder="return await db.raw('SELECT ...')" />
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

    <w-dialog v-model="logDialogVisible" title="执行日志" width="600">
      <div class="log-table-wrapper">
        <w-table :data="logs" :columns="logColumns" stripe border />
      </div>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as scheduleApi from '@/api/schedule'

const tasks = ref<any[]>([])
const logs = ref<any[]>([])
const dialogVisible = ref(false)
const logDialogVisible = ref(false)
const formModel = reactive<any>({})
const handlerConfig = reactive<any>({})
const apiConfigText = ref('')

const columns = [
  { prop: 'code', label: '任务编码' },
  { prop: 'name', label: '任务名称' },
  { prop: 'cron', label: 'Cron' },
  { prop: 'handler_type', label: '类型' },
  { prop: 'last_run_time', label: '上次执行' },
  { prop: 'last_run_result', label: '结果' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 240, fixed: 'right' }
]

const logColumns = [
  { prop: 'create_time', label: '执行时间', width: 160 },
  { prop: 'status', label: '状态', width: 80 },
  { prop: 'result', label: '结果', className: 'log-result-cell' }
]

const handlerTypeOptions = [
  { label: 'SQL', value: 'sql' },
  { label: '脚本', value: 'script' },
  { label: '接口', value: 'api' }
]

onMounted(() => loadData())

async function loadData() {
  tasks.value = await scheduleApi.getScheduledTasks()
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  Object.keys(handlerConfig).forEach((k) => delete handlerConfig[k])
  apiConfigText.value = ''
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
    formModel.handlerType = row.handler_type
    const config = typeof row.handler_config === 'string' ? JSON.parse(row.handler_config) : row.handler_config
    Object.assign(handlerConfig, config || {})
    if (config?.api) apiConfigText.value = JSON.stringify(config.api, null, 2)
  } else {
    formModel.status = true
    formModel.handlerType = 'sql'
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleSave() {
  const data = JSON.parse(JSON.stringify(formModel))
  data.status = data.status ? 1 : 0
  data.handlerConfig = { ...handlerConfig }
  if (data.handlerType === 'api') {
    try {
      data.handlerConfig.api = JSON.parse(apiConfigText.value || '{}')
    } catch {
      alert('接口配置 JSON 格式错误')
      return
    }
  }
  await scheduleApi.saveScheduledTask(data)
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除任务 ${row.name} 吗？`)) {
    await scheduleApi.deleteScheduledTask(row.id)
    await loadData()
  }
}

async function handleRun(row: any) {
  await scheduleApi.runTask(row.id)
  await loadData()
  alert('执行完成')
}

async function openLog(row: any) {
  logs.value = await scheduleApi.getTaskLogs(row.id)
  logDialogVisible.value = true
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.log-table-wrapper { max-height: 55vh; overflow: auto; }
:deep(.log-result-cell) { word-break: break-all; white-space: normal !important; }
:deep(.log-result-cell .w-table__cell-content) { white-space: normal !important; }
</style>
