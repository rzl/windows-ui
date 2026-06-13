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
import * as lowcodeApi from '@/api/lowcode'

const router = useRouter()
const models = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'code', label: '模型编码' },
  { prop: 'name', label: '模型名称', width: 180 },
  { prop: 'table_name', label: '表名' },
  { prop: 'description', label: '描述' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 240, fixed: 'right' }
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
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
