<template>
  <div class="list-page">
    <w-card header="数据模型">
      <div class="toolbar">
        <w-button type="primary" @click="openDialog()">+ 新增模型</w-button>
      </div>

      <w-table :data="models" :columns="columns" stripe border>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" @click="goDesign(row)">设计</w-button>
            <w-button size="small" @click="goRun(row)">运行</w-button>
            <w-button size="small" @click="openFlowDialog(row)">流程</w-button>
            <w-button size="small" @click="openDialog(row)">编辑</w-button>
            <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

    <w-dialog v-model="dialogVisible" title="数据模型" width="480">
      <w-form :model="formModel">
        <w-form-item label="模型编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" placeholder="英文编码" />
        </w-form-item>
        <w-form-item label="模型名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="表名">
          <w-input v-model="formModel.tableName" :disabled="!!formModel.id" placeholder="留空自动生成 lc_编码" />
        </w-form-item>
        <w-form-item label="描述">
          <w-input v-model="formModel.description" type="textarea" />
        </w-form-item>
        <w-form-item label="数据权限">
          <w-select v-model="formModel.dataPermission" :options="dataPermissionOptions" />
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

    <w-dialog v-model="flowDialogVisible" title="流程配置" width="520">
      <w-form :model="flowForm">
        <w-form-item label="流程编码">
          <w-input v-model="flowForm.code" placeholder="英文编码" />
        </w-form-item>
        <w-form-item label="流程名称">
          <w-input v-model="flowForm.name" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="flowForm.status" active-text="启用" inactive-text="禁用" />
        </w-form-item>
        <w-form-item label="节点配置（JSON）">
          <textarea v-model="flowForm.configText" class="w-xp-textarea" rows="10" placeholder='{"nodes":[],"transitions":[]}' />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeFlowDialog">取消</w-button>
        <w-button type="primary" @click="handleSaveFlow">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as lowcodeApi from '@/api/lowcode'
import * as flowApi from '@/api/flow'

const router = useRouter()
const models = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})
const flowDialogVisible = ref(false)
const flowForm = reactive<any>({})

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'code', label: '模型编码' },
  { prop: 'name', label: '模型名称', width: 180 },
  { prop: 'table_name', label: '表名' },
  { prop: 'description', label: '描述' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 240, fixed: 'right' }
]

const dataPermissionOptions = [
  { label: '全部可见', value: 'all' },
  { label: '仅本人', value: 'self' },
  { label: '本部门', value: 'dept' },
  { label: '本部门及子部门', value: 'dept_and_child' }
]

onMounted(() => loadData())

async function loadData() {
  models.value = await lowcodeApi.getModels()
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
    formModel.dataPermission = row.data_permission || 'all'
  } else {
    formModel.status = true
    formModel.dataPermission = 'all'
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleSave() {
  const data = JSON.parse(JSON.stringify(formModel))
  data.status = data.status ? 1 : 0
  if (data.id) {
    await lowcodeApi.updateModel(data.id, data)
  } else {
    await lowcodeApi.createModel(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除模型 ${row.name} 吗？关联物理表将被删除。`)) {
    await lowcodeApi.deleteModel(row.id)
    await loadData()
  }
}

function goDesign(row: any) {
  router.push(`/lowcode/design/${row.id}`)
}

function goRun(row: any) {
  router.push(`/lowcode/run/${row.code}`)
}

async function openFlowDialog(row: any) {
  Object.keys(flowForm).forEach((k) => delete flowForm[k])
  flowForm.modelCode = row.code
  flowForm.code = `${row.code}_flow`
  flowForm.name = `${row.name}审批流程`
  flowForm.status = true
  flowForm.configText = JSON.stringify({
    nodes: [
      { id: 'start', type: 'start', name: '开始' },
      { id: 'approve', type: 'approve', name: '审批', assigneeType: 'role', assigneeValue: '' },
      { id: 'end', type: 'end', name: '结束' }
    ],
    transitions: [
      { from: 'start', to: 'approve', condition: 'submit' },
      { from: 'approve', to: 'end', condition: 'approve' },
      { from: 'approve', to: 'start', condition: 'reject' }
    ]
  }, null, 2)

  try {
    const existing = await flowApi.getFlowDefinitionByModel(row.code)
    if (existing) {
      flowForm.code = existing.code
      flowForm.name = existing.name
      flowForm.status = existing.status === 1
      flowForm.configText = typeof existing.config === 'string'
        ? existing.config
        : JSON.stringify(existing.config || { nodes: [], transitions: [] }, null, 2)
    }
  } catch {
    // ignore
  }
  flowDialogVisible.value = true
}

function closeFlowDialog() {
  flowDialogVisible.value = false
}

async function handleSaveFlow() {
  let config: any
  try {
    config = JSON.parse(flowForm.configText)
  } catch {
    alert('JSON 格式错误')
    return
  }
  await flowApi.saveFlowDefinition({
    code: flowForm.code,
    name: flowForm.name,
    modelCode: flowForm.modelCode,
    config,
    status: flowForm.status ? 1 : 0
  })
  closeFlowDialog()
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
