<template>
  <div class="designer-page">
    <div class="toolbar">
      <w-button type="primary" size="small" @click="handleSave">保存报表配置</w-button>
      <w-button size="small" @click="goRun">运行报表</w-button>
    </div>

    <w-form :inline="true">
      <w-form-item label="报表编码">
        <w-input v-model="report.code" disabled style="width: 180px" />
      </w-form-item>
      <w-form-item label="报表名称">
        <w-input v-model="report.name" style="width: 180px" />
      </w-form-item>
      <w-form-item label="数据模型">
        <w-select v-model="report.modelCode" :options="modelOptions" :disabled="!!report.externalDataSourceId" style="width: 180px" />
      </w-form-item>
      <w-form-item label="外部数据源">
        <w-select v-model="report.externalDataSourceId" :options="externalDataSourceOptions" clearable style="width: 180px" @change="handleExternalChange" />
      </w-form-item>
      <w-form-item label="状态">
        <w-switch v-model="report.status" active-text="启用" inactive-text="禁用" />
      </w-form-item>
    </w-form>

    <w-tabs v-model="activeTab">
      <w-tab-pane label="报表列" name="columns">
        <div class="section-title">选择报表列与聚合方式</div>
        <w-table :data="fieldList" :columns="columnDesignColumns" stripe border>
          <template #selected="{ row }">
            <w-switch v-model="columnMap[row.field_name].selected" />
          </template>
          <template #label="{ row }">
            <w-input v-model="columnMap[row.field_name].label" style="width: 120px" />
          </template>
          <template #aggregate="{ row }">
            <w-select v-model="columnMap[row.field_name].aggregate" :options="aggregateOptions" style="width: 100px" />
          </template>
          <template #format="{ row }">
            <w-select v-model="columnMap[row.field_name].format" :options="formatOptions" style="width: 100px" />
          </template>
        </w-table>
      </w-tab-pane>

      <w-tab-pane label="分组" name="group">
        <div class="section-title">选择分组字段（用于汇总统计）</div>
        <w-checkbox-group v-model="groupBy" :options="groupFieldOptions" />
      </w-tab-pane>

      <w-tab-pane label="过滤条件" name="filters">
        <div class="toolbar">
          <w-button type="primary" size="small" @click="addFilter">+ 新增条件</w-button>
        </div>
        <w-table :data="filters" :columns="filterColumns" stripe border>
          <template #field="{ $index }">
            <w-select v-model="filters[$index].field" :options="fieldOptions" style="width: 150px" />
          </template>
          <template #operator="{ $index }">
            <w-select v-model="filters[$index].operator" :options="operatorOptions" style="width: 120px" />
          </template>
          <template #value="{ $index }">
            <w-input v-model="filters[$index].value" style="width: 180px" />
          </template>
          <template #action="{ $index }">
            <w-button size="small" type="danger" @click="removeFilter($index)">删除</w-button>
          </template>
        </w-table>
      </w-tab-pane>

      <w-tab-pane label="报表参数" name="params">
        <div class="toolbar">
          <w-button type="primary" size="small" @click="addParam">+ 新增参数</w-button>
        </div>
        <w-table :data="params" :columns="paramColumns" stripe border>
          <template #name="{ $index }">
            <w-input v-model="params[$index].name" style="width: 120px" />
          </template>
          <template #label="{ $index }">
            <w-input v-model="params[$index].label" style="width: 120px" />
          </template>
          <template #type="{ $index }">
            <w-select v-model="params[$index].type" :options="paramTypeOptions" style="width: 120px" />
          </template>
          <template #defaultValue="{ $index }">
            <w-input v-model="params[$index].defaultValue" style="width: 150px" />
          </template>
          <template #action="{ $index }">
            <w-button size="small" type="danger" @click="removeParam($index)">删除</w-button>
          </template>
        </w-table>
      </w-tab-pane>
    </w-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as reportApi from '@/api/report'
import * as lowcodeApi from '@/api/lowcode'
import * as externalDatasourceApi from '@/api/external-datasource'

const route = useRoute()
const router = useRouter()
const reportCode = computed(() => route.params.code as string)

const report = reactive<any>({
  code: '',
  name: '',
  modelCode: '',
  status: true
})
const model = reactive<any>({})
const fields = ref<any[]>([])
const models = ref<any[]>([])
const externalDataSources = ref<any[]>([])
const activeTab = ref('columns')
const columnMap = reactive<Record<string, any>>({})
const groupBy = ref<string[]>([])
const filters = ref<any[]>([])
const params = ref<any[]>([])

const modelOptions = computed(() => models.value.map((m: any) => ({ label: m.name, value: m.code })))
const externalDataSourceOptions = computed(() => externalDataSources.value.map((ds: any) => ({ label: ds.name, value: String(ds.id) })))
const fieldList = computed(() => fields.value)
const fieldOptions = computed(() => fields.value.map((f: any) => ({ label: f.display_name || f.field_name, value: f.field_name })))
const groupFieldOptions = computed(() => fields.value
  .filter((f: any) => !['text', 'textarea', 'rich-text'].includes(f.type))
  .map((f: any) => ({ label: f.display_name || f.field_name, value: f.field_name })))

const columnDesignColumns = [
  { prop: 'field_name', label: '字段名' },
  { prop: 'display_name', label: '显示名称' },
  { prop: 'selected', label: '选中', width: 80 },
  { prop: 'label', label: '报表标签', width: 150 },
  { prop: 'aggregate', label: '聚合', width: 120 },
  { prop: 'format', label: '格式化', width: 120 }
]

const aggregateOptions = [
  { label: '无', value: '' },
  { label: '求和', value: 'sum' },
  { label: '平均', value: 'avg' },
  { label: '计数', value: 'count' },
  { label: '最大', value: 'max' },
  { label: '最小', value: 'min' }
]

const formatOptions = [
  { label: '无', value: '' },
  { label: '日期', value: 'date' },
  { label: '日期时间', value: 'datetime' },
  { label: '数字', value: 'number' },
  { label: '金额', value: 'money' },
  { label: '百分比', value: 'percent' }
]

const filterColumns = [
  { prop: 'field', label: '字段' },
  { prop: 'operator', label: '操作符' },
  { prop: 'value', label: '值' },
  { prop: 'action', label: '操作', width: 80 }
]

const operatorOptions = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' },
  { label: '包含', value: 'like' },
  { label: '范围', value: 'between' }
]

const paramColumns = [
  { prop: 'name', label: '参数名' },
  { prop: 'label', label: '显示名' },
  { prop: 'type', label: '类型' },
  { prop: 'defaultValue', label: '默认值' },
  { prop: 'action', label: '操作', width: 80 }
]

const paramTypeOptions = [
  { label: '字符串', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '日期', value: 'date' },
  { label: '日期时间', value: 'datetime' },
  { label: '下拉', value: 'select' }
]

onMounted(() => loadData())

async function loadData() {
  const [reportData, modelList, dsList] = await Promise.all([
    reportApi.getReport(reportCode.value),
    lowcodeApi.getModels(),
    externalDatasourceApi.getExternalDataSources()
  ])
  Object.assign(report, reportData)
  report.status = reportData.status === 1
  report.externalDataSourceId = reportData.config?.externalDataSourceId ? String(reportData.config.externalDataSourceId) : ''
  models.value = modelList
  externalDataSources.value = dsList || []

  const config = reportData.config || {}
  groupBy.value = config.groupBy || []
  filters.value = config.filters || []
  params.value = config.params || []

  if (report.externalDataSourceId) {
    await loadExternalFields(Number(report.externalDataSourceId), config.columns)
  } else if (reportData.model_code) {
    const modelData = await lowcodeApi.getModelByCode(reportData.model_code)
    Object.assign(model, modelData)
    fields.value = modelData.fields || []
    syncColumnMap()
    // 回显已保存的列配置
    if (config.columns?.length) {
      for (const col of config.columns) {
        if (columnMap[col.field]) {
          columnMap[col.field].selected = true
          columnMap[col.field].label = col.label || columnMap[col.field].label
          columnMap[col.field].aggregate = col.aggregate || ''
          columnMap[col.field].format = col.format || ''
        }
      }
    }
  }
}

async function loadExternalFields(id: number, savedColumns?: any[]) {
  try {
    const result = await externalDatasourceApi.testExternalDataSource(id)
    const sample = result.sample?.[0] || {}
    fields.value = Object.keys(sample).map((key) => ({
      field_name: key,
      display_name: key,
      type: 'string'
    }))
    syncColumnMap()
    if (savedColumns?.length) {
      for (const col of savedColumns) {
        if (columnMap[col.field]) {
          columnMap[col.field].selected = true
          columnMap[col.field].label = col.label || columnMap[col.field].label
          columnMap[col.field].aggregate = col.aggregate || ''
          columnMap[col.field].format = col.format || ''
        }
      }
    }
  } catch (err: any) {
    alert(err.message || '加载外部数据源字段失败')
  }
}

async function handleExternalChange(val: any) {
  if (!val) {
    fields.value = []
    report.modelCode = ''
    return
  }
  report.modelCode = ''
  await loadExternalFields(Number(val))
}

function syncColumnMap() {
  fields.value.forEach((field) => {
    if (!columnMap[field.field_name]) {
      columnMap[field.field_name] = {
        field: field.field_name,
        label: field.display_name || field.field_name,
        selected: false,
        aggregate: '',
        format: ''
      }
    }
  })
}

function addFilter() {
  filters.value.push({ field: '', operator: 'eq', value: '' })
}

function removeFilter(index: number) {
  filters.value.splice(index, 1)
}

function addParam() {
  params.value.push({ name: '', label: '', type: 'string', defaultValue: '' })
}

function removeParam(index: number) {
  params.value.splice(index, 1)
}

async function handleSave() {
  const columns = Object.values(columnMap)
    .filter((c: any) => c.selected)
    .map((c: any) => ({
      field: c.field,
      label: c.label,
      aggregate: c.aggregate,
      format: c.format
    }))

  const config: any = {
    columns,
    groupBy: groupBy.value,
    filters: filters.value.filter((f: any) => f.field),
    params: params.value.filter((p: any) => p.name)
  }
  if (report.externalDataSourceId) {
    config.externalDataSourceId = Number(report.externalDataSourceId)
  }

  await reportApi.saveReport({
    id: report.id,
    code: report.code,
    name: report.name,
    modelCode: report.externalDataSourceId ? '' : report.modelCode,
    config,
    status: report.status ? 1 : 0
  })
  alert('报表配置已保存')
}

function goRun() {
  router.push(`/report/run/${reportCode.value}`)
}
</script>

<style scoped>
.designer-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.section-title { font-weight: bold; margin: 12px 0; }
</style>
