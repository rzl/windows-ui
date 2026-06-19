<template>
  <div class="list-page">
    <div class="toolbar">
      <w-button type="primary" @click="openDialog()">+ 新增分类</w-button>
    </div>
    <w-table :data="categories" :columns="columns" stripe border>
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

    <w-dialog v-model="dialogVisible" title="字典分类" width="400">
      <w-form :model="formModel">
        <w-form-item label="分类编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" />
        </w-form-item>
        <w-form-item label="分类名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="排序">
          <w-input-number v-model="formModel.sort" />
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
import * as dictApi from '@/api/dict'

const categories = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})

const columns = [
  { prop: 'code', label: '分类编码' },
  { prop: 'name', label: '分类名称' },
  { prop: 'sort', label: '排序', width: 80 },
  { prop: 'status', label: '状态', width: 80 },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

onMounted(() => loadData())

async function loadData() {
  categories.value = await dictApi.getDictCategories()
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
  } else {
    formModel.status = true
    formModel.sort = 0
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
    await dictApi.updateDictCategory(data.id, data)
  } else {
    await dictApi.createDictCategory(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除分类 ${row.name} 吗？`)) {
    await dictApi.deleteDictCategory(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
