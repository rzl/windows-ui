<template>
  <div class="list-page">
    <w-card :header="model.name || model.code || '低代码页面'">
      <w-query-builder
        v-if="queryFields.length"
        :fields="queryFields"
        @search="handleQuerySearch"
        @reset="handleQueryReset"
      />
      <w-alert v-if="!canAccess" type="error" title="无权限访问" description="您没有该数据模型的访问权限，请联系管理员。" :closable="false" />
      <w-crud-table
        v-else
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
            <w-button v-if="permission.canCreate && tableConfig.toolbar.includes('create')" type="primary" @click="openDialog()">+ 新增</w-button>
            <w-button v-if="permission.canDelete && tableConfig.toolbar.includes('batchDelete')" :disabled="!selectedRows.length" @click="handleBatchDelete">批量删除</w-button>
            <w-dropdown
              v-if="permission.canExport && tableConfig.toolbar.includes('export')"
              trigger-text="导出"
              :items="[
                { label: '导出全部', value: 'all' },
                { label: '导出选中', value: 'selected', disabled: !selectedRows.length }
              ]"
              @command="handleExportCommand"
            />
            <w-dropdown
              v-if="permission.canImport && tableConfig.toolbar.includes('import')"
              trigger-text="导入"
              :items="[
                { label: '上传 Excel', value: 'upload' },
                { label: '下载模板', value: 'template' }
              ]"
              @command="handleImportCommand"
            />
            <input v-if="permission.canImport && tableConfig.toolbar.includes('import')" ref="fileInput" type="file" accept=".xlsx,.xls" style="display: none" @change="handleFileChange" />
          </w-space>
        </template>
        <template v-for="col in formattedColumns" :key="col.prop" #[col.prop]="{ row }">
          {{ col.formatter(row) }}
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button v-if="permission.canEdit && tableConfig.rowActions.includes('edit') && canEdit(row)" size="small" @click="openDialog(row)">编辑</w-button>
            <w-button v-if="permission.canDelete && tableConfig.rowActions.includes('delete') && canEdit(row)" size="small" type="danger" @click="handleDelete(row)">删除</w-button>
            <w-button v-if="tableConfig.rowActions.includes('view')" size="small" @click="openDialog(row)">查看</w-button>
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
import * as dictApi from '@/api/dict'
import request from '@/api/request'

const route = useRoute()
const modelCode = computed(() => route.params.modelCode as string)
const dictMap = reactive<Record<string, { label: string; value: string }[]>>({})

const model = reactive<any>({})
const formConfig = reactive<any>({ fields: [] })
const tableConfig = reactive<any>({ fields: [], toolbar: ['create', 'batchDelete', 'export', 'import'], rowActions: ['edit', 'delete'] })
const permission = reactive<any>({
  dataScope: 'all',
  canCreate: true,
  canEdit: true,
  canDelete: true,
  canExport: true,
  canImport: true,
  canDesign: false
})
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

const canAccess = computed(() => permission.dataScope !== 'none')

const tableColumns = computed(() => {
  const columns = tableConfig.fields.map((f: any) => {
    const fieldMeta = model.fields?.find((mf: any) => mf.field_name === f.field)
    const isRef = fieldMeta?.type === 'ref'
    return {
      prop: isRef ? `${f.field}_display` : f.field,
      label: f.label,
      width: f.width,
      align: f.align || 'left',
      fixed: f.fixed || undefined,
      sortable: f.sortable ? 'custom' : false
    }
  })
  return [
    { type: 'selection', width: 48 },
    ...columns,
    { prop: 'action', label: '操作', width: 140, fixed: 'right' }
  ]
})

const formattedColumns = computed(() => {
  return tableConfig.fields
    .filter((f: any) => f.format && f.inTable)
    .map((f: any) => {
      const fieldMeta = model.fields?.find((mf: any) => mf.field_name === f.field)
      const isRef = fieldMeta?.type === 'ref'
      const prop = isRef ? `${f.field}_display` : f.field
      const formatter = f.format === 'dict' && fieldMeta?.dict_code
        ? (row: any) => formatDictValue(row[prop], fieldMeta.dict_code)
        : (row: any) => formatCellValue(row[prop], f.format)
      return { prop, formatter }
    })
})

const queryFields = computed(() => {
  return tableConfig.fields
    .filter((f: any) => f.searchable)
    .map((f: any) => ({ prop: f.field, label: f.label, searchMode: f.searchMode || 'like' }))
})

watch(modelCode, () => loadModel(), { immediate: true })

async function loadModel() {
  if (!modelCode.value) return
  const [data, perm] = await Promise.all([
    lowcodeApi.getModelByCode(modelCode.value),
    lowcodeApi.getModelPermission(modelCode.value)
  ])
  Object.assign(model, data)
  Object.assign(permission, perm)
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
    tableConfig.toolbar = saved.toolbar || ['create', 'batchDelete', 'export', 'import']
    tableConfig.rowActions = saved.rowActions || ['edit', 'delete']
  } else {
    tableConfig.fields = (data.fields || []).map((f: any) => ({
      field: f.field_name,
      label: f.display_name,
      inTable: true,
      searchable: f.type === 'string' || f.type === 'text'
    }))
  }

  await loadDicts()
  await loadData()
}

async function loadDicts() {
  const dictCodes = new Set<string>()
  tableConfig.fields.forEach((f: any) => {
    if (f.format === 'dict') {
      const fieldMeta = model.fields?.find((mf: any) => mf.field_name === f.field)
      if (fieldMeta?.dict_code) dictCodes.add(fieldMeta.dict_code)
    }
  })
  if (!dictCodes.size) return
  const dicts = await dictApi.getDicts()
  const targetDicts = dicts.filter((d: any) => dictCodes.has(d.code))
  for (const dict of targetDicts) {
    const detail = await dictApi.getDict(dict.id)
    dictMap[dict.code] = (detail.items || []).map((item: any) => ({ label: item.label, value: String(item.value) }))
  }
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

function formatCellValue(value: any, format: string) {
  if (value === undefined || value === null || value === '') return ''
  switch (format) {
    case 'date':
      return String(value).slice(0, 10)
    case 'datetime':
      return String(value).replace('T', ' ').slice(0, 19)
    case 'number':
      return Number(value).toLocaleString()
    case 'money':
      return '¥' + Number(value).toFixed(2)
    case 'percent':
      return (Number(value) * 100).toFixed(2) + '%'
    case 'boolean':
      return value ? '是' : '否'
    default:
      return value
  }
}

function formatDictValue(value: any, dictCode: string) {
  if (value === undefined || value === null) return ''
  const dict = dictMap[dictCode]
  if (!dict) return value
  const item = dict.find((d: any) => String(d.value) === String(value))
  return item?.label ?? value
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

function handleExportCommand(command: string) {
  if (command === 'all') {
    exportAllExcel()
  } else if (command === 'selected') {
    exportSelectedExcel()
  }
}

async function exportAllExcel() {
  try {
    const columns = getExportColumns()
    const blob = await lowcodeApi.exportDynamicExcel(modelCode.value, { columns })
    downloadBlob(blob, `${modelCode.value}.xlsx`)
  } catch (err: any) {
    alert(err.message || '导出失败')
  }
}

async function exportSelectedExcel() {
  if (!selectedRows.value.length) return
  try {
    const columns = getExportColumns()
    const ids = selectedRows.value.map((r) => r.id)
    const blob = await lowcodeApi.exportDynamicExcel(modelCode.value, { ids, columns })
    downloadBlob(blob, `${modelCode.value}_selected.xlsx`)
  } catch (err: any) {
    alert(err.message || '导出失败')
  }
}

function getExportColumns() {
  return tableConfig.fields
    .filter((f: any) => f.inTable)
    .map((f: any) => {
      const fieldMeta = model.fields?.find((mf: any) => mf.field_name === f.field)
      return {
        field: f.field,
        label: f.label,
        type: fieldMeta?.type,
        format: f.format,
        dictCode: fieldMeta?.dict_code,
        refModel: fieldMeta?.ref_model,
        refDisplayField: fieldMeta?.ref_display_field
      }
    })
}

function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

function handleImportCommand(command: string) {
  if (command === 'upload') {
    fileInput.value?.click()
  } else if (command === 'template') {
    downloadImportTemplate()
  }
}

async function downloadImportTemplate() {
  try {
    const blob = await lowcodeApi.getImportTemplate(modelCode.value)
    downloadBlob(blob, `${modelCode.value}_template.xlsx`)
  } catch (err: any) {
    alert(err.message || '下载模板失败')
  }
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  try {
    const result = await lowcodeApi.importDynamicExcel(modelCode.value, file)
    const msg = `导入完成：成功 ${result.success} 条，失败 ${result.failure} 条`
    if (result.failures?.length) {
      const details = result.failures.map((f: any) => `第 ${f.row} 行：${f.reason}`).join('\n')
      alert(`${msg}\n\n失败详情：\n${details}`)
    } else {
      alert(msg)
    }
    target.value = ''
    selectedRows.value = []
    await loadData()
  } catch (err: any) {
    alert(err.message || '导入失败')
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>
