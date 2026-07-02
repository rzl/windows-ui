<template>
  <div class="list-page">
    <div class="toolbar">
      <w-button type="primary" @click="openDialog()">+ 新增流程</w-button>
    </div>
    <w-table :data="flows" :columns="columns" stripe border>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #version="{ row }">
        <w-tag size="small">v{{ row.version }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="openDialog(row)">编辑</w-button>
          <w-button size="small" @click="openVersionDialog(row)">版本</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-table>

    <w-dialog v-model="dialogVisible" title="流程定义" width="900">
      <w-form :model="formModel">
        <w-form-item label="流程编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" placeholder="英文编码" />
        </w-form-item>
        <w-form-item label="流程名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="关联模型">
          <w-select v-model="formModel.modelCode" :options="modelOptions" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="formModel.status" active-text="启用" inactive-text="禁用" />
        </w-form-item>
        <w-form-item label="版本说明" v-if="!!formModel.id">
          <w-input v-model="remarkForm.remark" placeholder="覆盖当前版本时填写版本说明" />
        </w-form-item>
        <w-form-item label="流程设计">
          <flow-designer v-model="formModel.config" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeDialog">取消</w-button>
        <w-button type="primary" @click="handleSave">确定</w-button>
      </template>
    </w-dialog>

    <w-dialog v-model="versionDialogVisible" title="流程版本历史" width="720">
      <w-table :data="versions" :columns="versionColumns" stripe border>
        <template #status="{ row }">
          <w-tag :type="row.is_latest ? 'success' : 'info'">{{ row.is_latest ? '当前' : '历史' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-button size="small" :disabled="row.is_latest" @click="handleRollback(row)">回滚</w-button>
        </template>
      </w-table>
      <template #footer>
        <w-button @click="versionDialogVisible = false">关闭</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as flowApi from '@/api/flow'
import * as lowcodeApi from '@/api/lowcode'
import FlowDesigner from '@/components/flow-designer/FlowDesigner.vue'

const flows = ref<any[]>([])
const models = ref<any[]>([])
const dialogVisible = ref(false)
const versionDialogVisible = ref(false)
const formModel = reactive<any>({})
const currentFlowCode = ref('')
const versions = ref<any[]>([])
const remarkForm = reactive({ remark: '' })

const columns = [
  { prop: 'code', label: '流程编码' },
  { prop: 'name', label: '流程名称' },
  { prop: 'model_code', label: '关联模型' },
  { prop: 'version', label: '版本' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 220, fixed: 'right' }
]

const versionColumns = [
  { prop: 'version', label: '版本号' },
  { prop: 'remark', label: '版本说明' },
  { prop: 'status', label: '状态' },
  { prop: 'create_time', label: '创建时间' },
  { prop: 'action', label: '操作' }
]

const modelOptions = ref<any[]>([])

onMounted(() => loadData())

async function loadData() {
  const [flowData, modelData] = await Promise.all([
    flowApi.getFlowDefinitions(),
    lowcodeApi.getModels()
  ])
  flows.value = flowData
  models.value = modelData
  modelOptions.value = modelData.map((m: any) => ({ label: m.name, value: m.code }))
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  remarkForm.remark = ''
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
    formModel.config = typeof row.config === 'string' ? JSON.parse(row.config) : (row.config || { nodes: [], transitions: [] })
  } else {
    formModel.status = true
    formModel.config = {
      nodes: [
        { id: 'start', type: 'start', name: '开始' },
        { id: 'manager', type: 'approve', name: '经理审批', assigneeType: 'role', assigneeValue: '' },
        { id: 'end', type: 'end', name: '结束' }
      ],
      transitions: [
        { from: 'start', to: 'manager', condition: 'submit' },
        { from: 'manager', to: 'end', condition: 'approve' }
      ]
    }
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleSave() {
  const data = {
    id: formModel.id,
    code: formModel.code,
    name: formModel.name,
    modelCode: formModel.modelCode,
    config: formModel.config,
    status: formModel.status ? 1 : 0,
    remark: remarkForm.remark || (formModel.id ? undefined : '新建流程')
  }
  await flowApi.saveFlowDefinition(data)
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除流程 ${row.name} 吗？`)) {
    await flowApi.deleteFlowDefinition(row.id)
    await loadData()
  }
}

async function openVersionDialog(row: any) {
  currentFlowCode.value = row.code
  const result = await flowApi.getFlowVersions(row.code)
  versions.value = result
  versionDialogVisible.value = true
}

async function handleRollback(row: any) {
  if (!confirm(`确定回滚到版本 v${row.version} 吗？`)) return
  await flowApi.rollbackFlowDefinition(currentFlowCode.value, row.version)
  await loadData()
  await openVersionDialog({ code: currentFlowCode.value })
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
