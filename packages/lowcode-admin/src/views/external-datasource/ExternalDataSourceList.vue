<template>
  <div class="list-page">
    <w-card header="外部数据源">
      <div class="toolbar">
        <w-button type="primary" @click="openDialog()">+ 新增数据源</w-button>
      </div>
      <w-table :data="dataSources" :columns="columns" stripe border>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" @click="openDialog(row)">编辑</w-button>
            <w-button size="small" @click="testConnection(row)">测试</w-button>
            <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

    <w-dialog v-model="dialogVisible" title="外部数据源" width="680">
      <w-form :model="formModel">
        <w-form-item label="编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" placeholder="英文编码" />
        </w-form-item>
        <w-form-item label="名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="类型">
          <w-select v-model="formModel.type" :options="typeOptions" />
        </w-form-item>
        <w-form-item label="描述">
          <w-input v-model="formModel.description" type="textarea" :rows="2" />
        </w-form-item>
        <w-form-item label="配置(JSON)">
          <w-input v-model="configText" type="textarea" :rows="12" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="formModel.status" active-text="启用" inactive-text="禁用" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeDialog">取消</w-button>
        <w-button @click="testCurrent">测试连接</w-button>
        <w-button type="primary" @click="handleSave">保存</w-button>
      </template>
    </w-dialog>

    <w-dialog v-model="testVisible" title="测试结果" width="520">
      <w-alert v-if="testResult?.success" type="success" title="连接成功" />
      <w-alert v-else type="error" :title="testResult?.message || '连接失败'" />
      <pre v-if="testResult?.sample" class="test-sample">{{ JSON.stringify(testResult.sample, null, 2) }}</pre>
      <template #footer>
        <w-button @click="testVisible = false">关闭</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import * as externalDatasourceApi from '@/api/external-datasource'

const dataSources = ref<any[]>([])
const dialogVisible = ref(false)
const testVisible = ref(false)
const testResult = ref<any>(null)
const formModel = reactive<any>({})
const configText = ref('')

const columns = [
  { prop: 'code', label: '编码' },
  { prop: 'name', label: '名称' },
  { prop: 'type', label: '类型' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 220, fixed: 'right' }
]

const typeOptions = [
  { label: 'REST API', value: 'rest' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' }
]

const defaultConfigs: Record<string, any> = {
  rest: {
    url: 'https://api.example.com/items',
    method: 'GET',
    headers: {},
    params: {},
    body: {},
    resultPath: '',
    labelField: 'label',
    valueField: 'value'
  },
  mysql: {
    host: 'localhost',
    port: 3306,
    database: '',
    user: '',
    password: '',
    sql: 'SELECT label, value FROM dict_items',
    labelField: 'label',
    valueField: 'value'
  },
  postgresql: {
    host: 'localhost',
    port: 5432,
    database: '',
    user: '',
    password: '',
    sql: 'SELECT label, value FROM dict_items',
    labelField: 'label',
    valueField: 'value'
  }
}

onMounted(() => loadData())

watch(() => formModel.type, (type) => {
  if (!formModel.id && type && !configText.value) {
    configText.value = JSON.stringify(defaultConfigs[type] || {}, null, 2)
  }
})

async function loadData() {
  dataSources.value = await externalDatasourceApi.getExternalDataSources()
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
    configText.value = typeof row.config === 'string' ? row.config : JSON.stringify(row.config || {}, null, 2)
  } else {
    formModel.status = true
    formModel.type = 'rest'
    configText.value = JSON.stringify(defaultConfigs.rest, null, 2)
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function handleSave() {
  try {
    const config = JSON.parse(configText.value || '{}')
    const data = JSON.parse(JSON.stringify(formModel))
    data.status = data.status ? 1 : 0
    data.config = config
    if (formModel.id) {
      await externalDatasourceApi.updateExternalDataSource(formModel.id, data)
    } else {
      await externalDatasourceApi.createExternalDataSource(data)
    }
    closeDialog()
    await loadData()
  } catch {
    alert('配置 JSON 格式错误')
  }
}

async function handleDelete(row: any) {
  if (confirm(`确定删除数据源 ${row.name} 吗？`)) {
    await externalDatasourceApi.deleteExternalDataSource(row.id)
    await loadData()
  }
}

async function testConnection(row: any) {
  testResult.value = await externalDatasourceApi.testExternalDataSource(row.id)
  testVisible.value = true
}

async function testCurrent() {
  try {
    const config = JSON.parse(configText.value || '{}')
    const data = JSON.parse(JSON.stringify(formModel))
    data.status = data.status ? 1 : 0
    data.config = config
    let row: any
    if (formModel.id) {
      row = await externalDatasourceApi.updateExternalDataSource(formModel.id, data)
    } else {
      row = await externalDatasourceApi.createExternalDataSource(data)
      formModel.id = row.id
    }
    testResult.value = await externalDatasourceApi.testExternalDataSource(row.id)
    testVisible.value = true
  } catch {
    alert('配置 JSON 格式错误')
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.test-sample { margin-top: 12px; padding: 8px; background: #f5f5f5; border: 1px solid #ddd; max-height: 300px; overflow: auto; }
</style>
