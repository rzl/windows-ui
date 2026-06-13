<template>
  <div class="list-page">
    <w-card header="字典管理">
      <div class="toolbar">
        <w-button v-if="auth.hasPermission('dict:create')" type="primary" @click="openDictDialog()">+ 新增字典</w-button>
      </div>

      <w-table :data="dicts" :columns="dictColumns" stripe border>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button v-if="auth.hasPermission('dict:edit')" size="small" @click="openDictDialog(row)">编辑</w-button>
            <w-button v-if="auth.hasPermission('dict:delete')" size="small" type="danger" @click="handleDeleteDict(row)">删除</w-button>
            <w-button size="small" @click="openItemDialog(row)">字典项</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

    <!-- 字典表单 -->
    <w-dialog v-model="dictDialogVisible" title="字典" width="480">
      <w-form :model="dictForm">
        <w-form-item label="字典名称">
          <w-input v-model="dictForm.name" />
        </w-form-item>
        <w-form-item label="字典编码">
          <w-input v-model="dictForm.code" :disabled="!!dictForm.id" />
        </w-form-item>
        <w-form-item label="描述">
          <w-input v-model="dictForm.description" type="textarea" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="dictForm.status" active-text="启用" inactive-text="禁用" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeDictDialog">取消</w-button>
        <w-button type="primary" @click="handleSaveDict">确定</w-button>
      </template>
    </w-dialog>

    <!-- 字典项管理 -->
    <w-dialog v-model="itemDialogVisible" title="字典项管理" width="600">
      <div class="toolbar">
        <w-button type="primary" size="small" @click="openItemForm()">+ 新增字典项</w-button>
      </div>
      <w-table :data="currentItems" :columns="itemColumns" stripe border>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" @click="openItemForm(row)">编辑</w-button>
            <w-button size="small" type="danger" @click="handleDeleteItem(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>
    </w-dialog>

    <!-- 字典项表单 -->
    <w-dialog v-model="itemFormVisible" title="字典项" width="420">
      <w-form :model="itemForm">
        <w-form-item label="显示标签">
          <w-input v-model="itemForm.label" />
        </w-form-item>
        <w-form-item label="值">
          <w-input v-model="itemForm.value" />
        </w-form-item>
        <w-form-item label="排序">
          <w-input-number v-model="itemForm.sort" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="itemForm.status" active-text="启用" inactive-text="禁用" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeItemForm">取消</w-button>
        <w-button type="primary" @click="handleSaveItem">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import * as dictApi from '@/api/dict'

const auth = useAuthStore()
const dicts = ref<any[]>([])
const dictDialogVisible = ref(false)
const itemDialogVisible = ref(false)
const itemFormVisible = ref(false)
const dictForm = reactive<any>({})
const itemForm = reactive<any>({})
const currentDict = ref<any>({})
const currentItems = ref<any[]>([])

const dictColumns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '字典名称', width: 180 },
  { prop: 'code', label: '字典编码' },
  { prop: 'description', label: '描述' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 200, fixed: 'right' }
]

const itemColumns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'label', label: '标签', width: 140 },
  { prop: 'value', label: '值' },
  { prop: 'sort', label: '排序', width: 70 },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

onMounted(() => loadData())

async function loadData() {
  dicts.value = await dictApi.getDicts()
}

function openDictDialog(row?: any) {
  Object.keys(dictForm).forEach((k) => delete dictForm[k])
  if (row) {
    Object.assign(dictForm, JSON.parse(JSON.stringify(row)))
    dictForm.status = row.status === 1
  } else {
    dictForm.status = true
  }
  dictDialogVisible.value = true
}

function closeDictDialog() {
  dictDialogVisible.value = false
}

async function handleSaveDict() {
  const data = JSON.parse(JSON.stringify(dictForm))
  data.status = data.status ? 1 : 0
  if (data.id) {
    await dictApi.updateDict(data.id, data)
  } else {
    await dictApi.createDict(data)
  }
  closeDictDialog()
  await loadData()
}

async function handleDeleteDict(row: any) {
  if (confirm(`确定删除字典 ${row.name} 吗？`)) {
    await dictApi.deleteDict(row.id)
    await loadData()
  }
}

async function openItemDialog(row: any) {
  currentDict.value = row
  const detail = await dictApi.getDict(row.id)
  currentItems.value = detail.items || []
  itemDialogVisible.value = true
}

function openItemForm(row?: any) {
  Object.keys(itemForm).forEach((k) => delete itemForm[k])
  if (row) {
    Object.assign(itemForm, JSON.parse(JSON.stringify(row)))
    itemForm.status = row.status === 1
  } else {
    itemForm.dictId = currentDict.value.id
    itemForm.status = true
    itemForm.sort = 0
  }
  itemFormVisible.value = true
}

function closeItemForm() {
  itemFormVisible.value = false
}

async function handleSaveItem() {
  const data = JSON.parse(JSON.stringify(itemForm))
  data.status = data.status ? 1 : 0
  if (data.id) {
    await dictApi.updateDictItem(data.id, data)
  } else {
    await dictApi.createDictItem(data)
  }
  closeItemForm()
  const detail = await dictApi.getDict(currentDict.value.id)
  currentItems.value = detail.items || []
  await loadData()
}

async function handleDeleteItem(row: any) {
  if (confirm(`确定删除字典项 ${row.label} 吗？`)) {
    await dictApi.deleteDictItem(row.id)
    const detail = await dictApi.getDict(currentDict.value.id)
    currentItems.value = detail.items || []
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
