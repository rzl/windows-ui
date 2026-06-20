<template>
  <div class="list-page">
    <div class="toolbar">
      <w-button type="primary" @click="router.push('/lowcode/custom-api/edit')">+ 新增接口</w-button>
    </div>
    <w-table :data="apis" :columns="columns" stripe border>
      <template #method="{ row }">
        <w-tag :type="methodType(row.method)">{{ row.method || 'ALL' }}</w-tag>
      </template>
      <template #is_public="{ row }">
        <w-tag :type="row.is_public === 1 ? 'warning' : 'info'">{{ row.is_public === 1 ? '公开' : '登录' }}</w-tag>
      </template>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="router.push(`/lowcode/custom-api/edit/${row.id}`)">编辑</w-button>
          <w-button size="small" @click="handleTest(row)">测试</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-table>

    <w-dialog v-model="testVisible" title="测试结果" width="620">
      <w-alert v-if="testResult?.code === 200 || testResult?.success" type="success" title="执行成功" />
      <w-alert v-else type="error" :title="testResult?.message || '执行失败'" />
      <pre v-if="testResult" class="test-sample">{{ JSON.stringify(testResult, null, 2) }}</pre>
      <template #footer>
        <w-button @click="testVisible = false">关闭</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as customApiApi from '@/api/customApi'

const router = useRouter()
const apis = ref<any[]>([])
const testVisible = ref(false)
const testResult = ref<any>(null)

const columns = [
  { prop: 'code', label: '编码' },
  { prop: 'name', label: '名称' },
  { prop: 'method', label: '方法', width: 90 },
  { prop: 'path', label: '路径' },
  { prop: 'is_public', label: '访问', width: 90 },
  { prop: 'status', label: '状态', width: 90 },
  { prop: 'action', label: '操作', width: 220, fixed: 'right' }
]

const methodTypeMap: Record<string, string> = {
  GET: 'primary',
  POST: 'success',
  PUT: 'warning',
  DELETE: 'danger',
  ALL: 'info'
}

function methodType(method?: string) {
  return methodTypeMap[(method || 'ALL').toUpperCase()] || 'info'
}

onMounted(() => loadData())

async function loadData() {
  apis.value = await customApiApi.getCustomApis()
}

async function handleTest(row: any) {
  try {
    testResult.value = await customApiApi.testCustomApi(row.id, {
      query: {},
      body: {},
      params: {}
    })
  } catch (error: any) {
    testResult.value = { code: 500, message: error.message || '测试失败' }
  }
  testVisible.value = true
}

async function handleDelete(row: any) {
  if (confirm(`确定删除接口 ${row.name} 吗？`)) {
    await customApiApi.deleteCustomApi(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.test-sample { margin-top: 12px; padding: 8px; background: #f5f5f5; border: 1px solid #ddd; max-height: 400px; overflow: auto; font-size: 12px; }
</style>
