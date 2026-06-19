<template>
  <div class="list-page">
    <div class="toolbar">
      <w-button type="primary" @click="openDialog()">+ 新增模板</w-button>
    </div>
    <w-table :data="templates" :columns="columns" stripe border>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="goDesign(row)">设计</w-button>
          <w-button size="small" @click="goPreview(row)">预览</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-table>

    <w-dialog v-model="dialogVisible" title="打印模板" width="520">
      <w-form :model="formModel">
        <w-form-item label="模板编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" placeholder="英文编码" />
        </w-form-item>
        <w-form-item label="模板名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="数据模型">
          <w-select v-model="formModel.modelCode" :options="modelOptions" />
        </w-form-item>
        <w-form-item label="纸张">
          <w-select v-model="formModel.paperSize" :options="paperOptions" />
        </w-form-item>
        <w-form-item label="方向">
          <w-select v-model="formModel.orientation" :options="orientationOptions" />
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
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as printApi from '@/api/print'
import * as lowcodeApi from '@/api/lowcode'

const router = useRouter()
const templates = ref<any[]>([])
const models = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})

const columns = [
  { prop: 'code', label: '模板编码' },
  { prop: 'name', label: '模板名称' },
  { prop: 'model_code', label: '数据模型' },
  { prop: 'paper_size', label: '纸张' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 220, fixed: 'right' }
]

const modelOptions = ref<any[]>([])
const paperOptions = [
  { label: 'A4', value: 'A4' },
  { label: 'A5', value: 'A5' },
  { label: 'A3', value: 'A3' },
  { label: 'Letter', value: 'LETTER' }
]
const orientationOptions = [
  { label: '纵向', value: 'portrait' },
  { label: '横向', value: 'landscape' }
]

onMounted(() => loadData())

async function loadData() {
  const [templateData, modelData] = await Promise.all([
    printApi.getPrintTemplates(),
    lowcodeApi.getModels()
  ])
  templates.value = templateData
  models.value = modelData
  modelOptions.value = modelData.map((m: any) => ({ label: m.name, value: m.code }))
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
    formModel.paperSize = row.paper_size || 'A4'
    formModel.orientation = row.orientation || 'portrait'
  } else {
    formModel.status = true
    formModel.paperSize = 'A4'
    formModel.orientation = 'portrait'
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleSave() {
  const data = JSON.parse(JSON.stringify(formModel))
  data.status = data.status ? 1 : 0
  await printApi.savePrintTemplate({
    code: data.code,
    name: data.name,
    modelCode: data.modelCode,
    paperSize: data.paperSize,
    orientation: data.orientation,
    status: data.status
  })
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除模板 ${row.name} 吗？`)) {
    await printApi.deletePrintTemplate(row.id)
    await loadData()
  }
}

function goDesign(row: any) {
  router.push(`/print/design/${row.code}`)
}

function goPreview(row: any) {
  router.push(`/print/preview/${row.code}`)
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
