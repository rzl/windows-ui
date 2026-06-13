<template>
  <div class="list-page">
    <w-card header="校验规则">
      <div class="toolbar">
        <w-button type="primary" @click="openDialog()">+ 新增</w-button>
      </div>
      <w-table :data="list" :columns="columns" stripe border>
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

    <w-dialog v-model="dialogVisible" title="校验规则" width="480">
      <w-form :model="formModel">
        <w-form-item label="规则编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" />
        </w-form-item>
        <w-form-item label="规则名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="正则表达式">
          <w-input v-model="formModel.pattern" />
        </w-form-item>
        <w-form-item label="错误提示">
          <w-input v-model="formModel.message" />
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
import * as lowcodeApi from '@/api/lowcode'

const list = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'code', label: '规则编码' },
  { prop: 'name', label: '规则名称' },
  { prop: 'pattern', label: '正则表达式' },
  { prop: 'message', label: '错误提示' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

onMounted(() => loadData())

async function loadData() {
  list.value = await lowcodeApi.getValidationRules()
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
    await lowcodeApi.updateValidationRule(data.id, data)
  } else {
    await lowcodeApi.createValidationRule(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除规则 ${row.name} 吗？`)) {
    await lowcodeApi.deleteValidationRule(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
