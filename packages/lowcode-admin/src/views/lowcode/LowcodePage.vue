<template>
  <div class="list-page">
    <w-card :header="model.name || model.code || '低代码页面'">
      <w-query-builder
        v-if="queryFields.length"
        :fields="queryFields"
        @search="handleQuerySearch"
        @reset="handleQueryReset"
      />
      <w-crud-table
        :data="list"
        :columns="tableColumns"
        :query="query"
        :total="total"
        :current-page="query.page"
        :page-size="query.pageSize"
        :searchable="false"
        @page-change="handlePageChange"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <template #toolbar>
          <w-space>
            <w-button type="primary" @click="openDialog()">+ 新增</w-button>
            <w-button :disabled="!selectedRows.length" @click="handleBatchDelete">批量删除</w-button>
            <w-button @click="handleExport">导出</w-button>
            <w-button @click="triggerImport">导入</w-button>
            <input ref="fileInput" type="file" accept=".csv" style="display: none" @change="handleFileChange" />
          </w-space>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button v-if="canEdit(row)" size="small" @click="openDialog(row)">编辑</w-button>
            <w-button v-if="canEdit(row)" size="small" type="danger" @click="handleDelete(row)">删除</w-button>
            <w-tag v-if="row.__flow_status" :type="flowStatusType(row.__flow_status)">{{ flowStatusText(row.__flow_status) }}</w-tag>
          </w-space>
        </template>
      </w-crud-table>
    </w-card>

    <w-dialog v-model="dialogVisible" :title="dialogTitle" width="560">
      <w-dynamic-form
        ref="dynamicFormRef"
        v-model="formModel"
        :fields="formFields"
        :columns="2"
        :validate-rules="validateRules"
        :load-options="loadFieldOptions"
        :load-ref-options="loadRefOptions"
        :upload-request="uploadFile"
        :generate-code="generateCodeForField"
      />
      <template #footer>
        <w-button @click="closeDialog">取消</w-button>
        <w-button type="primary" @click="handleSave">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as lowcodeApi from '@/api/lowcode'
import request from '@/api/request'

const route = useRoute()
const modelCode = computed(() => route.params.modelCode as string)

const model = reactive<any>({})
const formConfig = reactive<any>({ fields: [] })
const tableConfig = reactive<any>({ fields: [] })
const list = ref<any[]>([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 10, filters: '', sortBy: '', sortOrder: '' })
const selectedRows = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const formModel = reactive<any>({})
const dynamicFormRef = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const formFields = computed(() => {
  return formConfig.fields.map((f: any) => ({
    prop: f.field,
    label: f.label,
    type: f.type || 'input',
    required: f.required,
    validationRule: f.validationRule,
    dependsOn: f.dependsOn,
    options: f.options,
    refModel: f.refModel,
    refDisplayField: f.refDisplayField
  }))
})

const tableColumns = computed(() => {
  const columns = tableConfig.fields.map((f: any) => {
    const fieldMeta = model.fields?.find((mf: any) => mf.field_name === f.field)
    const isRef = fieldMeta?.type === 'ref'
    return {
      prop: isRef ? `${f.field}_display` : f.field,
      label: f.label,
      width: f.width,
      sortable: f.sortable ? 'custom' : false
    }
  })
  return [
    { type: 'selection', width: 48 },
    ...columns,
    { prop: 'action', label: '操作', width: 140, fixed: 'right' }
  ]
})

const queryFields = computed(() => {
  return tableConfig.fields
    .filter((f: any) => f.searchable)
    .map((f: any) => ({ prop: f.field, label: f.label }))
})

watch(modelCode, () => loadModel(), { immediate: true })

async function loadModel() {
  if (!modelCode.value) return
  const data = await lowcodeApi.getModelByCode(modelCode.value)
  Object.assign(model, data)
  formConfig.fields = []
  tableConfig.fields = []

  if (data.forms?.length) {
    const saved = typeof data.forms[0].config === 'string'
      ? JSON.parse(data.forms[0].config)
      : data.forms[0].config
    formConfig.fields = saved.fields || []
  } else {
    // 默认使用全部字段
    formConfig.fields = (data.fields || []).map((f: any) => ({
      field: f.field_name,
      label: f.display_name,
      type: mapType(f.type),
      required: f.required === 1,
      validationRule: f.validation_rule || '',
      options: f.options ? JSON.parse(f.options) : undefined
    }))
  }

  if (data.tables?.length) {
    const saved = typeof data.tables[0].config === 'string'
      ? JSON.parse(data.tables[0].config)
      : data.tables[0].config
    tableConfig.fields = saved.fields || []
  } else {
    tableConfig.fields = (data.fields || []).map((f: any) => ({
      field: f.field_name,
      label: f.display_name,
      inTable: true,
      searchable: f.type === 'string' || f.type === 'text'
    }))
  }

  await loadData()
}

function canEdit(row: any) {
  return !row.__flow_status || row.__flow_status === 'rejected'
}

function flowStatusText(status: string) {
  const map: Record<string, string> = {
    running: '审批中',
    completed: '已通过',
    rejected: '已驳回'
  }
  return map[status] || status
}

function flowStatusType(status: string) {
  const map: Record<string, string> = {
    running: 'warning',
    completed: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

function mapType(type: string) {
  const map: Record<string, string> = {
    string: 'input',
    text: 'textarea',
    number: 'number',
    boolean: 'switch',
    date: 'date',
    datetime: 'datetime',
    select: 'select',
    radio: 'radio',
    upload: 'upload',
    cascader: 'cascader',
    'rich-text': 'rich-text'
  }
  return map[type] || 'input'
}

async function loadData() {
  const result = await lowcodeApi.getDynamicList(modelCode.value, query)
  list.value = result.list
  total.value = result.total
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  dialogTitle.value = row ? '编辑' : '新增'
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function validateRules(items: { code: string; value: any }[]) {
  if (!items.length) return []
  return lowcodeApi.validateBatch(items)
}

async function loadFieldOptions(config: any, model: any) {
  return lowcodeApi.executeFieldOptions(config, model)
}

async function generateCodeForField(ruleCode: string) {
  return lowcodeApi.generateCode(ruleCode)
}

async function loadRefOptions(modelCode: string, displayField: string, keyword: string) {
  const result = await lowcodeApi.getDynamicList(modelCode, { page: 1, pageSize: 50, keyword })
  return result.list.map((row: any) => ({
    label: row[displayField] || `ID:${row.id}`,
    value: row.id
  }))
}

async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await request.post('/common/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

async function handleSave() {
  const valid = dynamicFormRef.value ? await dynamicFormRef.value.validate() : true
  if (!valid) return

  const data = JSON.parse(JSON.stringify(formModel))
  if (data.id) {
    await lowcodeApi.updateDynamic(modelCode.value, data.id, data)
  } else {
    await lowcodeApi.createDynamic(modelCode.value, data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm('确定删除该记录吗？')) {
    await lowcodeApi.deleteDynamic(modelCode.value, row.id)
    await loadData()
  }
}

async function handleQuerySearch(conditions: any[]) {
  query.page = 1
  query.filters = JSON.stringify(conditions)
  await loadData()
}

async function handleQueryReset() {
  query.page = 1
  query.filters = ''
  await loadData()
}

async function handlePageChange(page: number) {
  query.page = page
  await loadData()
}

function handleSortChange({ prop, order }: { prop: string; order: 'ascending' | 'descending' | null }) {
  query.sortBy = order ? prop : ''
  query.sortOrder = order || ''
  query.page = 1
  loadData()
}

function handleSelectionChange(rows: any[]) {
  selectedRows.value = rows
}

async function handleBatchDelete() {
  if (!selectedRows.value.length) return
  if (confirm(`确定删除选中的 ${selectedRows.value.length} 条记录吗？`)) {
    await lowcodeApi.deleteDynamicBatch(modelCode.value, selectedRows.value.map((r) => r.id))
    selectedRows.value = []
    await loadData()
  }
}

function handleExport() {
  const headers = tableConfig.fields.map((f: any) => f.label)
  const keys = tableConfig.fields.map((f: any) => f.field)
  const rows = list.value.map((row: any) => keys.map((k: string) => row[k] ?? ''))
  const csv = [headers.join(','), ...rows.map((r: any[]) => r.map(escapeCsv).join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${modelCode.value}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

function escapeCsv(value: any) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const text = await file.text()
  const rows = parseCsv(text)
  if (!rows.length) {
    alert('CSV 文件为空或格式错误')
    return
  }
  try {
    await lowcodeApi.importDynamic(modelCode.value, rows)
    alert(`成功导入 ${rows.length} 条记录`)
    target.value = ''
    await loadData()
  } catch (err: any) {
    alert(err.message || '导入失败')
  }
}

function parseCsv(text: string) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const row: any = {}
    headers.forEach((h, i) => {
      row[h] = values[i] ?? ''
    })
    return row
  })
}

function parseCsvLine(line: string) {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>
