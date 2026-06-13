<template>
  <div class="list-page">
    <w-card header="用户管理">
      <w-search-form :model="query" @search="handleSearch" @reset="handleReset">
        <w-form-item label="关键词">
          <w-input v-model="query.keyword" placeholder="用户名/昵称/邮箱" />
        </w-form-item>
        <w-form-item label="状态">
          <w-select v-model="query.status" :options="statusOptions" placeholder="请选择" clearable style="width: 120px" />
        </w-form-item>
      </w-search-form>

      <div class="toolbar">
        <w-button v-if="auth.hasPermission('user:create')" type="primary" @click="openDialog()">+ 新增</w-button>
        <w-button v-if="auth.hasPermission('user:delete')" type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">批量删除</w-button>
      </div>

      <w-table
        :data="store.list"
        :columns="columns"
        stripe
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button v-if="auth.hasPermission('user:edit')" size="small" @click="openDialog(row)">编辑</w-button>
            <w-button v-if="auth.hasPermission('user:delete')" size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>

      <w-pagination
        :current-page="query.page"
        :page-size="query.pageSize"
        :total="store.total"
        @update:current-page="handlePageChange"
      />
    </w-card>

    <w-dialog v-model="dialogVisible" :title="dialogTitle" width="520">
      <w-form :model="formModel">
        <w-form-item label="用户名">
          <w-input v-model="formModel.username" :disabled="!!formModel.id" />
        </w-form-item>
        <w-form-item :label="formModel.id ? '密码（留空不修改）' : '密码'">
          <w-input v-model="formModel.password" type="password" />
        </w-form-item>
        <w-form-item label="昵称">
          <w-input v-model="formModel.nickname" />
        </w-form-item>
        <w-form-item label="邮箱">
          <w-input v-model="formModel.email" />
        </w-form-item>
        <w-form-item label="手机号">
          <w-input v-model="formModel.phone" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="formModel.status" :active-text="'启用'" :inactive-text="'禁用'" />
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
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const auth = useAuthStore()
const store = useUserStore()

const query = reactive({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 10
})

const statusOptions = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]

const columns = [
  { type: 'selection', width: 48 },
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'username', label: '用户名' },
  { prop: 'nickname', label: '昵称' },
  { prop: 'email', label: '邮箱' },
  { prop: 'phone', label: '手机号' },
  { prop: 'roleName', label: '角色' },
  { prop: 'deptName', label: '部门' },
  { prop: 'status', label: '状态' },
  { prop: 'createTime', label: '创建时间' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const formModel = reactive<any>({})
const selectedIds = ref<number[]>([])

function openDialog(row?: any) {
  dialogTitle.value = row ? '编辑用户' : '新增用户'
  Object.keys(formModel).forEach((k) => delete (formModel as any)[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1 ? true : false
  } else {
    formModel.status = true
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleSave() {
  const model = JSON.parse(JSON.stringify(formModel))
  model.status = model.status ? 1 : 0
  if (model.id) {
    await store.update(model)
  } else {
    await store.create(model)
  }
  closeDialog()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除用户 ${row.username} 吗？`)) {
    await store.remove([row.id])
  }
}

function handleSelectionChange(rows: any[]) {
  selectedIds.value = rows.map((r) => r.id)
}

async function handleBatchDelete() {
  if (selectedIds.value.length === 0) return
  if (confirm(`确定删除选中的 ${selectedIds.value.length} 条记录吗？`)) {
    await store.remove(selectedIds.value)
    selectedIds.value = []
  }
}

async function handleSearch() {
  query.page = 1
  await loadData()
}

async function handleReset() {
  query.keyword = ''
  query.status = ''
  query.page = 1
  await loadData()
}

async function handlePageChange(page: number) {
  query.page = page
  await loadData()
}

async function loadData() {
  Object.assign(store.query, query)
  await store.loadData()
}

loadData()
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
