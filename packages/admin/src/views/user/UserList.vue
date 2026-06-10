<template>
  <div class="list-page">
    <w-card header="用户管理">
      <div class="search-bar">
        <w-input v-model="store.query.keyword" placeholder="搜索用户名/昵称/邮箱" prefix-icon="search" />
        <w-select v-model="store.query.status" :options="statusOptions" placeholder="状态" clearable style="width:120px" />
        <w-button type="primary" @click="crud.handleSearch">查询</w-button>
        <w-button @click="crud.handleReset">重置</w-button>
      </div>

      <div class="toolbar">
        <w-button v-if="auth.hasPermission('user:create')" type="primary" @click="crud.openDialog('新增用户')">+ 新增</w-button>
        <w-button v-if="auth.hasPermission('user:delete')" type="danger" :disabled="crud.selectedIds.length===0" @click="crud.handleBatchDelete">批量删除</w-button>
      </div>

      <w-table
        :data="store.list"
        :columns="columns"
        stripe
        border
        highlight-current-row
        @selection-change="crud.handleSelectionChange"
      >
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #role="{ row }">
          <w-tag type="info">{{ row.role }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button v-if="auth.hasPermission('user:edit')" size="small" @click="crud.openDialog('编辑用户', row)">编辑</w-button>
            <w-button v-if="auth.hasPermission('user:delete')" size="small" type="danger" @click="crud.handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>

      <w-pagination
        :current-page="store.query.page"
        :page-size="store.query.pageSize"
        :total="store.total"
        @update:current-page="crud.handlePageChange"
      />
    </w-card>

    <w-dialog v-model="crud.dialogVisible" :title="crud.dialogTitle" width="520">
      <w-form :model="crud.formModel">
        <w-form-item label="用户名">
          <w-input v-model="crud.formModel.username" />
        </w-form-item>
        <w-form-item label="昵称">
          <w-input v-model="crud.formModel.nickname" />
        </w-form-item>
        <w-form-item label="邮箱">
          <w-input v-model="crud.formModel.email" />
        </w-form-item>
        <w-form-item label="手机号">
          <w-input v-model="crud.formModel.phone" />
        </w-form-item>
        <w-form-item label="角色">
          <w-select v-model="crud.formModel.role" :options="roleOptions" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="crud.formModel.status" :active-text="'启用'" :inactive-text="'禁用'" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="crud.closeDialog">取消</w-button>
        <w-button type="primary" @click="handleSave">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useCrud } from '@/composables/useCrud'

const store = useUserStore()
const auth = useAuthStore()
const crud = useCrud(store)

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]
const roleOptions = [
  { label: 'admin', value: 'admin' },
  { label: 'editor', value: 'editor' },
  { label: 'viewer', value: 'viewer' }
]

const columns = [
  { type: 'selection', width: 48 },
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'username', label: '用户名' },
  { prop: 'nickname', label: '昵称' },
  { prop: 'email', label: '邮箱' },
  { prop: 'phone', label: '手机号' },
  { prop: 'role', label: '角色' },
  { prop: 'status', label: '状态' },
  { prop: 'createTime', label: '创建时间' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

async function handleSave() {
  const model = JSON.parse(JSON.stringify(crud.formModel))
  model.status = model.status ? 1 : 0
  if (model.id) await store.update(model)
  else await store.create(model)
  crud.closeDialog()
}
</script>

<style scoped>
.list-page { padding: 8px; }
.search-bar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
