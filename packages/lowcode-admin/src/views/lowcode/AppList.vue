<template>
  <div class="list-page">
    <w-card header="应用管理">
      <div class="toolbar">
        <w-button type="primary" @click="openDialog()">+ 新增应用</w-button>
        <w-button @click="importVisible = true">导入应用</w-button>
      </div>
      <w-table :data="apps" :columns="columns" stripe border>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" @click="goDesign(row)">设计</w-button>
            <w-button size="small" @click="exportAppFile(row)">导出</w-button>
            <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

    <w-dialog v-model="dialogVisible" title="应用" width="520">
      <w-form :model="formModel">
        <w-form-item label="应用编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" placeholder="英文编码" />
        </w-form-item>
        <w-form-item label="应用名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="分类">
          <w-input v-model="formModel.category" />
        </w-form-item>
        <w-form-item label="图标">
          <w-input v-model="formModel.icon" />
        </w-form-item>
        <w-form-item label="描述">
          <w-input v-model="formModel.description" type="textarea" :rows="2" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="formModel.status" active-text="启用" inactive-text="禁用" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeDialog">取消</w-button>
        <w-button type="primary" @click="handleSave">保存并设计</w-button>
      </template>
    </w-dialog>

    <w-dialog v-model="importVisible" title="导入应用" width="520">
      <w-input v-model="importText" type="textarea" :rows="12" placeholder="粘贴应用 JSON" />
      <template #footer>
        <w-button @click="importVisible = false">取消</w-button>
        <w-button type="primary" @click="handleImport">导入</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as appApi from '@/api/app'

const router = useRouter()
const apps = ref<any[]>([])
const dialogVisible = ref(false)
const importVisible = ref(false)
const importText = ref('')
const formModel = reactive<any>({})

const columns = [
  { prop: 'code', label: '应用编码' },
  { prop: 'name', label: '应用名称' },
  { prop: 'category', label: '分类' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 220, fixed: 'right' }
]

onMounted(() => loadData())

async function loadData() {
  apps.value = await appApi.getApps()
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
  const res = await appApi.saveApp({
    code: data.code,
    name: data.name,
    category: data.category,
    icon: data.icon,
    description: data.description,
    status: data.status,
    items: []
  })
  closeDialog()
  await loadData()
  goDesign(res)
}

async function handleDelete(row: any) {
  if (confirm(`确定删除应用 ${row.name} 吗？`)) {
    await appApi.deleteApp(row.id)
    await loadData()
  }
}

async function handleImport() {
  try {
    const data = JSON.parse(importText.value)
    await appApi.importApp(data)
    importVisible.value = false
    importText.value = ''
    await loadData()
  } catch {
    alert('JSON 格式错误')
  }
}

async function exportAppFile(row: any) {
  const blob = await appApi.exportApp(row.id)
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${row.code}.json`
  link.click()
  URL.revokeObjectURL(link.href)
}

function goDesign(row: any) {
  router.push(`/lowcode/app-design/${row.code}`)
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
