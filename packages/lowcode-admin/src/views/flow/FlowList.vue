<template>
  <div class="list-page">
    <w-card header="流程定义">
      <div class="toolbar">
        <w-button type="primary" @click="openDialog()">+ 新增流程</w-button>
      </div>
      <w-table :data="flows" :columns="columns" stripe border>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" @click="openDialog(row)">编辑</w-button>
            <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

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
        <w-form-item label="流程设计">
          <flow-designer v-model="formModel.config" />
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
import * as lowcodeApi from '@/api/lowcode'
import FlowDesigner from '@/components/flow-designer/FlowDesigner.vue'

const flows = ref<any[]>([])
const models = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})

const columns = [
  { prop: 'code', label: '流程编码' },
  { prop: 'name', label: '流程名称' },
  { prop: 'model_code', label: '关联模型' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
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
    code: formModel.code,
    name: formModel.name,
    modelCode: formModel.modelCode,
    config: formModel.config,
    status: formModel.status ? 1 : 0
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
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
