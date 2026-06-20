<template>
  <div class="list-page">
    <div class="toolbar">
      <w-button v-if="auth.hasPermission('field-permission:create')" type="primary" @click="openDialog()">+ 新增</w-button>
    </div>

    <w-table :data="list" :columns="columns" stripe border>
      <template #permission="{ row }">
        {{ row.hidden ? '隐藏' : (row.editable ? '可读可写' : '只读') }}
      </template>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button v-if="auth.hasPermission('field-permission:edit')" size="small" @click="openDialog(row)">编辑</w-button>
          <w-button v-if="auth.hasPermission('field-permission:delete')" size="small" type="danger" @click="handleDelete(row)">删除</w-button>
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

    <w-dialog v-model="dialogVisible" title="字段权限规则" width="560">
      <w-form :model="formModel">
        <w-form-item label="关联模型">
          <w-select v-model="formModel.model_code" :options="modelOptions" placeholder="请选择模型" @change="onModelChange" />
        </w-form-item>
        <w-form-item label="字段">
          <w-select v-model="formModel.field_code" :options="fieldOptions" placeholder="请选择字段" />
        </w-form-item>
        <w-form-item label="权限">
          <w-radio-group v-model="permissionType">
            <w-radio label="readwrite">可读可写</w-radio>
            <w-radio label="readonly">只读</w-radio>
            <w-radio label="hidden">隐藏</w-radio>
          </w-radio-group>
        </w-form-item>
        <w-form-item label="指定角色">
          <div class="checkbox-group">
            <span v-if="!roleList.length" class="empty-tip">全部角色生效</span>
            <w-checkbox
              v-for="role in roleList"
              v-else
              :key="role.id"
              v-model="formModel.role_ids"
              :label="role.id"
            >
              {{ role.name }}
            </w-checkbox>
          </div>
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
import { onMounted, reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import * as fieldPermissionApi from '@/api/fieldPermission'
import * as lowcodeApi from '@/api/lowcode'
import * as roleApi from '@/api/role'

const auth = useAuthStore()
const list = ref<any[]>([])
const total = ref(0)
const modelOptions = ref<any[]>([])
const fieldOptions = ref<any[]>([])
const roleList = ref<any[]>([])
const modelMap = ref<Map<string, any[]>>(new Map())
const dialogVisible = ref(false)
const formModel = reactive<any>({})
const permissionType = ref('readwrite')
const query = reactive({ page: 1, pageSize: 10 })

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'model_code', label: '关联模型' },
  { prop: 'field_code', label: '字段' },
  { prop: 'permission', label: '权限' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

onMounted(() => {
  loadData()
  loadModels()
  loadRoles()
})

async function loadData() {
  const res = await fieldPermissionApi.getFieldPermissions(query)
  list.value = res.list
  total.value = res.total
}

async function loadModels() {
  const res = await lowcodeApi.getModels()
  modelOptions.value = res.map((item: any) => ({ label: item.name, value: item.code }))
  for (const item of res) {
    const detail = await lowcodeApi.getModelByCode(item.code)
    modelMap.value.set(item.code, detail.fields || [])
  }
}

async function loadRoles() {
  roleList.value = await roleApi.getRoles()
}

function onModelChange(code: string) {
  const fields = modelMap.value.get(code) || []
  fieldOptions.value = fields
    .filter((f: any) => f.status === 1)
    .map((f: any) => ({ label: f.display_name || f.field_name, value: f.field_name }))
  if (!fieldOptions.value.find((o: any) => o.value === formModel.field_code)) {
    formModel.field_code = ''
  }
}

watch(permissionType, (type) => {
  if (type === 'hidden') {
    formModel.hidden = 1
    formModel.readable = 0
    formModel.editable = 0
  } else if (type === 'readonly') {
    formModel.hidden = 0
    formModel.readable = 1
    formModel.editable = 0
  } else {
    formModel.hidden = 0
    formModel.readable = 1
    formModel.editable = 1
  }
})

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  formModel.role_ids = []
  permissionType.value = 'readwrite'
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
    if (row.hidden) permissionType.value = 'hidden'
    else if (!row.editable) permissionType.value = 'readonly'
    else permissionType.value = 'readwrite'
  } else {
    formModel.status = true
    formModel.readable = 1
    formModel.editable = 1
    formModel.hidden = 0
  }
  if (formModel.model_code) onModelChange(formModel.model_code)
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleSave() {
  const data = JSON.parse(JSON.stringify(formModel))
  data.status = data.status ? 1 : 0
  if (data.id) {
    await fieldPermissionApi.updateFieldPermission(data.id, data)
  } else {
    await fieldPermissionApi.createFieldPermission(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除规则 ${row.model_code}.${row.field_code} 吗？`)) {
    await fieldPermissionApi.deleteFieldPermission(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.checkbox-group { display: flex; flex-wrap: wrap; gap: 12px; }
.empty-tip { color: #999; }
</style>
