<template>
  <div class="list-page">
    <w-card header="角色管理">
      <div class="toolbar">
        <w-button v-if="auth.hasPermission('role:create')" type="primary" @click="openDialog()">+ 新增</w-button>
      </div>

      <w-table :data="list" :columns="columns" stripe border>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button v-if="auth.hasPermission('role:edit')" size="small" @click="openDialog(row)">编辑</w-button>
            <w-button v-if="auth.hasPermission('role:delete')" size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

    <w-dialog v-model="dialogVisible" title="角色" width="560">
      <w-form :model="formModel">
        <w-form-item label="角色名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="角色编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" />
        </w-form-item>
        <w-form-item label="描述">
          <w-input v-model="formModel.description" type="textarea" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="formModel.status" active-text="启用" inactive-text="禁用" />
        </w-form-item>
        <w-form-item label="权限">
          <div class="permission-tree">
            <div v-for="menu in menuTree" :key="menu.id" class="permission-group">
              <w-checkbox
                v-model="selectedPermissions"
                :label="menu.permission"
                :disabled="!menu.permission"
              >
                {{ menu.title }}
              </w-checkbox>
              <div v-if="menu.children?.length" class="permission-children">
                <w-checkbox
                  v-for="child in menu.children"
                  :key="child.id"
                  v-model="selectedPermissions"
                  :label="child.permission"
                  :disabled="!child.permission"
                >
                  {{ child.title }}
                </w-checkbox>
              </div>
            </div>
          </div>
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
import * as roleApi from '@/api/role'
import * as menuApi from '@/api/menu'

const auth = useAuthStore()
const list = ref<any[]>([])
const menuTree = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})
const selectedPermissions = ref<string[]>([])

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '角色名称' },
  { prop: 'code', label: '角色编码' },
  { prop: 'description', label: '描述' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

onMounted(() => {
  loadData()
  loadMenus()
})

async function loadData() {
  list.value = await roleApi.getRoles()
}

async function loadMenus() {
  menuTree.value = await menuApi.getMenuTree()
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  selectedPermissions.value = []
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
    selectedPermissions.value = row.permissions || []
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
  data.permissions = selectedPermissions.value.filter(Boolean)
  if (data.id) {
    await roleApi.updateRole(data.id, data)
  } else {
    await roleApi.createRole(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除角色 ${row.name} 吗？`)) {
    await roleApi.deleteRole(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.permission-tree { max-height: 300px; overflow-y: auto; border: 1px solid #d4d0c8; padding: 8px; }
.permission-group { margin-bottom: 8px; }
.permission-children { padding-left: 20px; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
</style>
