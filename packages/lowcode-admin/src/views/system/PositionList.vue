<template>
  <div class="list-page">
    <w-crud-table
      :data="positions"
      :columns="columns"
      :query="query"
      :total="total"
      :current-page="query.page"
      :page-size="query.pageSize"
      :searchable="false"
      storage-key="system-position-list"
      column-draggable
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template #toolbar>
        <w-button type="primary" @click="openDialog()">+ 新增职务</w-button>
      </template>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="openDialog(row)">编辑</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-crud-table>

    <w-dialog v-model="dialogVisible" title="职务" width="400">
      <w-form :model="formModel">
        <w-form-item label="职务编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" />
        </w-form-item>
        <w-form-item label="职务名称">
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
import * as positionApi from '@/api/position'

const positions = ref<any[]>([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 10 })
const dialogVisible = ref(false)
const formModel = reactive<any>({})

const columns = [
  { prop: 'code', label: '职务编码' },
  { prop: 'name', label: '职务名称' },
  { prop: 'sort', label: '排序', width: 80 },
  { prop: 'status', label: '状态', width: 80 },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

onMounted(() => loadData())

async function loadData() {
  // 接口返回全量职务数据，这里在前端做分页切片
  const all = await positionApi.getPositions()
  total.value = all.length
  const start = (query.page - 1) * query.pageSize
  positions.value = all.slice(start, start + query.pageSize)
}

function handlePageChange(page: number) {
  query.page = page
  loadData()
}

function handleSizeChange(size: number) {
  query.pageSize = size
  query.page = 1
  loadData()
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
    await positionApi.updatePosition(data.id, data)
  } else {
    await positionApi.createPosition(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除职务 ${row.name} 吗？`)) {
    await positionApi.deletePosition(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>
