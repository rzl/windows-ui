<template>
  <div class="list-page">
    <w-card header="菜单管理">
      <div class="toolbar">
        <w-button v-if="auth.hasPermission('menu:create')" type="primary" @click="openDialog()">+ 新增</w-button>
      </div>

      <w-table :data="menus" :columns="columns" stripe border row-key="id" default-expand-all>
        <template #parentTitle="{ row }">
          {{ row.parent_id ? parentTitleMap.get(row.parent_id) || '-' : '根菜单' }}
        </template>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button v-if="auth.hasPermission('menu:edit')" size="small" @click="openDialog(row)">编辑</w-button>
            <w-button v-if="auth.hasPermission('menu:delete')" size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

    <w-dialog v-model="dialogVisible" title="菜单" width="520">
      <w-form :model="formModel">
        <w-form-item label="上级菜单">
          <w-select v-model="formModel.parentId" :options="parentOptions" placeholder="请选择" clearable filterable />
        </w-form-item>
        <w-form-item label="菜单标题">
          <w-input v-model="formModel.title" />
        </w-form-item>
        <w-form-item label="路由名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="路由路径">
          <w-input v-model="formModel.path" />
        </w-form-item>
        <w-form-item label="组件路径">
          <w-input v-model="formModel.component" placeholder="views/xxx/Xxx.vue" />
        </w-form-item>
        <w-form-item label="图标">
          <w-input v-model="formModel.icon" />
        </w-form-item>
        <w-form-item label="权限码">
          <w-input v-model="formModel.permission" />
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
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import * as menuApi from '@/api/menu'

const auth = useAuthStore()
const menus = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'title', label: '菜单标题', width: 150 },
  { prop: 'name', label: '路由名称' },
  { prop: 'path', label: '路由路径' },
  { prop: 'component', label: '组件路径' },
  { prop: 'permission', label: '权限码' },
  { prop: 'parentTitle', label: '上级菜单' },
  { prop: 'sort', label: '排序', width: 70 },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

const parentTitleMap = computed(() => {
  const map = new Map<number, string>()
  function walk(items: any[]) {
    items.forEach((item) => {
      map.set(item.id, item.title)
      if (item.children?.length) {
        walk(item.children)
      }
    })
  }
  walk(menus.value)
  return map
})

const parentOptions = computed(() => {
  const result: any[] = [{ label: '根菜单', value: 0 }]
  const excludeIds = new Set<number>()
  if (formModel.id) {
    function collect(item: any) {
      excludeIds.add(item.id)
      item.children?.forEach(collect)
    }
    function find(items: any[]) {
      for (const item of items) {
        if (item.id === formModel.id) {
          collect(item)
          return true
        }
        if (item.children?.length && find(item.children)) return true
      }
      return false
    }
    find(menus.value)
  }
  function walk(items: any[], prefix = '') {
    items.forEach((item) => {
      if (!excludeIds.has(item.id)) {
        result.push({ label: prefix + item.title, value: item.id })
        if (item.children?.length) {
          walk(item.children, prefix + item.title + ' / ')
        }
      }
    })
  }
  walk(menus.value)
  return result
})

onMounted(() => loadData())

async function loadData() {
  menus.value = await menuApi.getMenuTree()
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.parentId = row.parent_id
    formModel.status = row.status === 1
  } else {
    formModel.parentId = 0
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
    await menuApi.updateMenu(data.id, data)
  } else {
    await menuApi.createMenu(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除菜单 ${row.title} 吗？`)) {
    await menuApi.deleteMenu(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
