<template>
  <div class="list-page">
    <w-card header="自定义页面">
      <div class="toolbar">
        <w-button type="primary" @click="openDialog()">+ 新增页面</w-button>
      </div>
      <w-table :data="list" :columns="columns" stripe border>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" @click="goDesign(row)">设计</w-button>
            <w-button size="small" @click="openDialog(row)">编辑</w-button>
            <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

    <w-dialog v-model="dialogVisible" title="页面信息" width="480">
      <w-form :model="formModel">
        <w-form-item label="页面编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" />
        </w-form-item>
        <w-form-item label="页面名称">
          <w-input v-model="formModel.name" />
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
        <w-button type="primary" @click="handleSave">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as pageApi from '@/api/page'

const router = useRouter()
const list = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'code', label: '编码' },
  { prop: 'name', label: '名称' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 200, fixed: 'right' }
]

onMounted(() => loadData())

async function loadData() {
  list.value = await pageApi.getPages()
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
  await pageApi.savePage(data)
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除页面 ${row.name} 吗？`)) {
    await pageApi.deletePage(row.id)
    await loadData()
  }
}

function goDesign(row: any) {
  router.push(`/lowcode/page-design/${row.code}`)
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
