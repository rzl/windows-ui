<template>
  <div class="list-page">
    <div class="toolbar">
      <w-button v-if="auth.hasPermission('data-permission:create')" type="primary" @click="openDialog()">+ 新增</w-button>
    </div>

    <w-table :data="list" :columns="columns" stripe border>
      <template #scope="{ row }">
        {{ scopeText(row.scope) }}
      </template>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button v-if="auth.hasPermission('data-permission:edit')" size="small" @click="openDialog(row)">编辑</w-button>
          <w-button v-if="auth.hasPermission('data-permission:delete')" size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-table>

    <w-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.pageSize"
      :total="total"
      layout="prev, pager, next"
      @change="loadData"
    />

    <w-dialog v-model="dialogVisible" title="数据权限规则" width="560">
      <w-form :model="formModel">
        <w-form-item label="规则编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" />
        </w-form-item>
        <w-form-item label="规则名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="关联模型">
          <w-select v-model="formModel.model_code" :options="modelOptions" placeholder="请选择模型" />
        </w-form-item>
        <w-form-item label="作用范围">
          <w-select v-model="formModel.scope" :options="scopeOptions" />
        </w-form-item>
        <w-form-item v-if="formModel.scope === 'roles'" label="指定角色">
          <div class="checkbox-group">
            <w-checkbox
              v-for="role in roleList"
              :key="role.id"
              v-model="formModel.role_ids"
              :label="role.id"
            >
              {{ role.name }}
            </w-checkbox>
          </div>
        </w-form-item>
        <w-form-item v-if="formModel.scope === 'users'" label="指定用户">
          <div class="checkbox-group">
            <w-checkbox
              v-for="user in userList"
              :key="user.id"
              v-model="formModel.user_ids"
              :label="user.id"
            >
              {{ user.nickname || user.username }}
            </w-checkbox>
          </div>
        </w-form-item>
        <w-form-item label="自定义过滤">
          <w-input v-model="formModel.custom_filter" type="textarea" :rows="4" placeholder='[{"field":"status","op":"=","value":"1"}]' />
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
import { useAuthStore } from '@/stores/auth'
import * as dataPermissionApi from '@/api/dataPermission'
import * as lowcodeApi from '@/api/lowcode'
import * as roleApi from '@/api/role'
import * as userApi from '@/api/user'

const auth = useAuthStore()
const list = ref<any[]>([])
const total = ref(0)
const modelOptions = ref<any[]>([])
const roleList = ref<any[]>([])
const userList = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})
const query = reactive({ page: 1, pageSize: 10 })

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'code', label: '编码' },
  { prop: 'name', label: '名称' },
  { prop: 'model_code', label: '关联模型' },
  { prop: 'scope', label: '作用范围' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

const scopeOptions = [
  { label: '全部数据', value: 'all' },
  { label: '本部门', value: 'dept' },
  { label: '本部门及子部门', value: 'dept_and_sub' },
  { label: '仅本人', value: 'self' },
  { label: '指定角色', value: 'roles' },
  { label: '指定用户', value: 'users' }
]

onMounted(() => {
  loadData()
  loadModels()
  loadRoles()
  loadUsers()
})

async function loadData() {
  const res = await dataPermissionApi.getDataPermissions(query)
  list.value = res.list
  total.value = res.total
}

async function loadModels() {
  const res = await lowcodeApi.getModels()
  modelOptions.value = res.map((item: any) => ({ label: item.name, value: item.code }))
}

async function loadRoles() {
  roleList.value = await roleApi.getRoles()
}

async function loadUsers() {
  const res = await userApi.getUsers({ page: 1, pageSize: 1000 })
  userList.value = res.list
}

function scopeText(scope: string) {
  return scopeOptions.find((item) => item.value === scope)?.label || scope
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  formModel.role_ids = []
  formModel.user_ids = []
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
    formModel.custom_filter = JSON.stringify(row.custom_filter || [])
  } else {
    formModel.status = true
    formModel.scope = 'all'
    formModel.custom_filter = '[]'
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleSave() {
  const data = JSON.parse(JSON.stringify(formModel))
  data.status = data.status ? 1 : 0
  try {
    data.custom_filter = JSON.parse(data.custom_filter || '[]')
  } catch {
    data.custom_filter = []
  }
  if (data.id) {
    await dataPermissionApi.updateDataPermission(data.id, data)
  } else {
    await dataPermissionApi.createDataPermission(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除规则 ${row.name} 吗？`)) {
    await dataPermissionApi.deleteDataPermission(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.checkbox-group { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
