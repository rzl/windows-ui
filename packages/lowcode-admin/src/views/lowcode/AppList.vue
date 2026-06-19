<template>
  <div class="list-page">
    <div class="toolbar">
      <w-button type="primary" @click="openDialog()">+ 新增应用</w-button>
      <w-button @click="importVisible = true">导入应用</w-button>
      <w-button @click="openTemplateDialog()">从模板创建</w-button>
    </div>
    <w-table :data="apps" :columns="columns" stripe border>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #is_market="{ row }">
        <w-tag :type="row.is_market === 1 ? 'success' : 'info'">{{ row.is_market === 1 ? '已上架' : '未上架' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="goDesign(row)">设计</w-button>
          <w-button size="small" @click="toggleMarket(row)">
            {{ row.is_market === 1 ? '下架' : '上架' }}
          </w-button>
          <w-button size="small" @click="exportAppFile(row)">导出</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-table>

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
        <w-form-item label="上架市场">
          <w-switch v-model="formModel.isMarket" active-text="上架" inactive-text="下架" />
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

    <w-dialog v-model="templateVisible" title="从模板创建应用" width="640">
      <div v-if="!templates.length" class="empty-tip">
        <w-empty description="暂无可用模板" />
      </div>
      <div v-else class="template-list">
        <div
          v-for="tpl in templates"
          :key="tpl.code"
          class="template-item"
          :class="{ active: templateForm.template === tpl.code }"
          @click="selectTemplate(tpl)"
        >
          <div class="template-name">{{ tpl.name }}</div>
          <div class="template-desc">{{ tpl.description || '暂无描述' }}</div>
        </div>
      </div>
      <w-form v-if="templateForm.template" :model="templateForm" style="margin-top: 16px;">
        <w-form-item label="应用编码">
          <w-input v-model="templateForm.code" placeholder="英文编码" />
        </w-form-item>
        <w-form-item label="应用名称">
          <w-input v-model="templateForm.name" />
        </w-form-item>
        <w-form-item label="自动发布">
          <w-switch v-model="templateForm.autoPublish" active-text="是" inactive-text="否" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="templateVisible = false">取消</w-button>
        <w-button type="primary" :loading="templateInstalling" @click="handleCreateFromTemplate">安装</w-button>
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
const templateVisible = ref(false)
const templateInstalling = ref(false)
const templates = ref<any[]>([])
const templateForm = reactive<any>({
  template: '',
  code: '',
  name: '',
  autoPublish: true
})
const formModel = reactive<any>({})

const columns = [
  { prop: 'code', label: '应用编码' },
  { prop: 'name', label: '应用名称' },
  { prop: 'category', label: '分类' },
  { prop: 'status', label: '状态' },
  { prop: 'is_market', label: '应用市场' },
  { prop: 'action', label: '操作', width: 280, fixed: 'right' }
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
    formModel.isMarket = row.is_market === 1
  } else {
    formModel.status = true
    formModel.isMarket = true
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleSave() {
  const data = JSON.parse(JSON.stringify(formModel))
  data.status = data.status ? 1 : 0
  data.isMarket = data.isMarket ? 1 : 0
  const res = await appApi.saveApp({
    code: data.code,
    name: data.name,
    category: data.category,
    icon: data.icon,
    description: data.description,
    status: data.status,
    isMarket: data.isMarket,
    items: []
  })
  closeDialog()
  await loadData()
  goDesign(res)
}

async function toggleMarket(row: any) {
  await appApi.saveApp({
    id: row.id,
    code: row.code,
    name: row.name,
    category: row.category,
    icon: row.icon,
    description: row.description,
    status: row.status,
    isMarket: row.is_market === 1 ? 0 : 1,
    items: row.items || []
  })
  await loadData()
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

async function openTemplateDialog() {
  templates.value = await appApi.getAppTemplates()
  templateForm.template = ''
  templateForm.code = ''
  templateForm.name = ''
  templateForm.autoPublish = true
  templateVisible.value = true
}

function selectTemplate(tpl: any) {
  templateForm.template = tpl.code
  templateForm.code = tpl.code
  templateForm.name = tpl.name
  templateForm.autoPublish = true
}

async function handleCreateFromTemplate() {
  try {
    templateInstalling.value = true
    const res = await appApi.createAppFromTemplate({
      template: templateForm.template,
      code: templateForm.code,
      name: templateForm.name,
      autoPublish: templateForm.autoPublish
    })
    templateVisible.value = false
    await loadData()
    goDesign(res)
  } finally {
    templateInstalling.value = false
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
.empty-tip { padding: 20px 0; }
.template-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}
.template-item {
  border: 1px solid #d4d0c8;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.template-item:hover,
.template-item.active {
  background: #f0f0f0;
  border-color: #919b9c;
}
.template-name {
  font-weight: bold;
  margin-bottom: 4px;
}
.template-desc {
  color: #666;
  font-size: 12px;
}
</style>
