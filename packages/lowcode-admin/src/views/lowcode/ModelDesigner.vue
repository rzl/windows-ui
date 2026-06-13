<template>
  <div class="designer-page">
    <w-card :header="`模型设计 - ${model.name || model.code || ''}`">
      <w-tabs v-model="activeTab">
        <w-tab-pane label="字段管理" name="fields">
          <div class="toolbar">
            <w-button type="primary" size="small" @click="openFieldDialog()">+ 新增字段</w-button>
          </div>
          <w-table :data="fields" :columns="fieldColumns" stripe border>
            <template #type="{ row }">
              {{ typeLabel(row.type) }}
            </template>
            <template #required="{ row }">
              <w-tag :type="row.required ? 'success' : 'info'">{{ row.required ? '是' : '否' }}</w-tag>
            </template>
            <template #status="{ row }">
              <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
            </template>
            <template #action="{ row }">
              <w-space>
                <w-button size="small" @click="openFieldDialog(row)">编辑</w-button>
                <w-button size="small" type="danger" @click="handleDeleteField(row)">删除</w-button>
              </w-space>
            </template>
          </w-table>
        </w-tab-pane>

        <w-tab-pane label="表单设计" name="form">
          <div class="toolbar">
            <w-button type="primary" size="small" @click="saveFormConfig">保存表单配置</w-button>
          </div>
          <w-table :data="fields" :columns="formDesignColumns" stripe border>
            <template #inForm="{ row }">
              <w-switch v-model="formConfigMap[row.field_name].inForm" />
            </template>
            <template #formType="{ row }">
              <w-select v-model="formConfigMap[row.field_name].type" :options="formTypeOptions" style="width: 120px" />
            </template>
            <template #formRequired="{ row }">
              <w-switch v-model="formConfigMap[row.field_name].required" />
            </template>
            <template #validationRule="{ row }">
              <w-select v-model="formConfigMap[row.field_name].validationRule" :options="validationRuleOptions" style="width: 130px" />
            </template>
            <template #dependsOn="{ row }">
              <div style="display: flex; gap: 4px">
                <w-select
                  v-model="formConfigMap[row.field_name].dependsOn.field"
                  :options="getDependFieldOptions(row.field_name)"
                  style="width: 90px"
                  @change="(val: any) => handleDependsOnFieldChange(row.field_name, val)"
                />
                <w-input
                  v-if="formConfigMap[row.field_name].dependsOn.field"
                  v-model="formConfigMap[row.field_name].dependsOn.value"
                  placeholder="依赖值"
                  style="width: 70px"
                />
              </div>
            </template>
          </w-table>
        </w-tab-pane>

        <w-tab-pane label="列表设计" name="table">
          <div class="toolbar">
            <w-button type="primary" size="small" @click="saveTableConfig">保存列表配置</w-button>
          </div>
          <w-table :data="fields" :columns="tableDesignColumns" stripe border>
            <template #inTable="{ row }">
              <w-switch v-model="tableConfigMap[row.field_name].inTable" />
            </template>
            <template #searchable="{ row }">
              <w-switch v-model="tableConfigMap[row.field_name].searchable" />
            </template>
            <template #width="{ row }">
              <w-input-number v-model="tableConfigMap[row.field_name].width" style="width: 90px" />
            </template>
          </w-table>
        </w-tab-pane>
      </w-tabs>
    </w-card>

    <!-- 字段表单 -->
    <w-dialog v-model="fieldDialogVisible" title="字段" width="480">
      <w-form :model="fieldForm">
        <w-form-item label="字段名">
          <w-input v-model="fieldForm.fieldName" :disabled="!!fieldForm.id" placeholder="英文字段名" />
        </w-form-item>
        <w-form-item label="显示名称">
          <w-input v-model="fieldForm.displayName" />
        </w-form-item>
        <w-form-item label="字段类型">
          <w-select v-model="fieldForm.type" :options="fieldTypeOptions" />
        </w-form-item>
        <w-form-item label="长度">
          <w-input-number v-model="fieldForm.length" />
        </w-form-item>
        <w-form-item label="必填">
          <w-switch v-model="fieldForm.required" />
        </w-form-item>
        <w-form-item label="默认值">
          <w-input v-model="fieldForm.defaultValue" />
        </w-form-item>
        <w-form-item v-if="['select', 'radio'].includes(fieldForm.type)" label="关联字典">
          <w-select v-model="fieldForm.dictCode" :options="dictOptions" />
        </w-form-item>
        <w-form-item v-if="['select', 'radio'].includes(fieldForm.type) && !fieldForm.dictCode" label="选项（JSON）">
          <w-input v-model="fieldForm.optionsText" type="textarea" placeholder='[{"label":"男","value":"1"}]' />
        </w-form-item>
        <w-form-item label="排序">
          <w-input-number v-model="fieldForm.sort" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="fieldForm.status" active-text="启用" inactive-text="禁用" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeFieldDialog">取消</w-button>
        <w-button type="primary" @click="handleSaveField">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as lowcodeApi from '@/api/lowcode'
import * as dictApi from '@/api/dict'

const route = useRoute()
const modelId = Number(route.params.id)

const activeTab = ref('fields')
const model = reactive<any>({})
const fields = ref<any[]>([])
const formConfig = reactive<any>({ fields: [] })
const tableConfig = reactive<any>({ fields: [] })
const formConfigMap = reactive<Record<string, any>>({})
const tableConfigMap = reactive<Record<string, any>>({})
const validationRules = ref<any[]>([])
const dicts = ref<any[]>([])

const fieldDialogVisible = ref(false)
const fieldForm = reactive<any>({})

const fieldTypeOptions = [
  { label: '字符串', value: 'string' },
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '布尔', value: 'boolean' },
  { label: '日期', value: 'date' },
  { label: '日期时间', value: 'datetime' },
  { label: '下拉选择', value: 'select' },
  { label: '单选', value: 'radio' },
  { label: '文件上传', value: 'upload' },
  { label: '级联选择', value: 'cascader' },
  { label: '富文本', value: 'rich-text' }
]

const validationRuleOptions = computed(() => [
  { label: '无', value: '' },
  ...(validationRules.value || []).map((r: any) => ({ label: r.name, value: r.code }))
])

const dictOptions = computed(() => [
  { label: '不使用字典', value: '' },
  ...(dicts.value || []).map((d: any) => ({ label: `${d.name}（${d.code}）`, value: d.code }))
])

function getDependFieldOptions(currentFieldName: string) {
  return [
    { label: '无', value: '' },
    ...fields.value
      .filter((f) => f.field_name !== currentFieldName)
      .map((f) => ({ label: f.display_name || f.field_name, value: f.field_name }))
  ]
}

const formTypeOptions = [
  { label: '输入框', value: 'input' },
  { label: '文本域', value: 'textarea' },
  { label: '数字', value: 'number' },
  { label: '开关', value: 'switch' },
  { label: '日期', value: 'date' },
  { label: '日期时间', value: 'datetime' },
  { label: '下拉', value: 'select' },
  { label: '单选', value: 'radio' },
  { label: '文件上传', value: 'upload' },
  { label: '级联选择', value: 'cascader' },
  { label: '富文本', value: 'rich-text' }
]

const fieldColumns = [
  { prop: 'field_name', label: '字段名' },
  { prop: 'display_name', label: '显示名称' },
  { prop: 'type', label: '类型' },
  { prop: 'length', label: '长度', width: 80 },
  { prop: 'required', label: '必填', width: 80 },
  { prop: 'sort', label: '排序', width: 70 },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

const formDesignColumns = [
  { prop: 'field_name', label: '字段名' },
  { prop: 'display_name', label: '显示名称' },
  { prop: 'inForm', label: '表单显示', width: 100 },
  { prop: 'formType', label: '表单类型', width: 140 },
  { prop: 'formRequired', label: '必填', width: 80 },
  { prop: 'validationRule', label: '校验规则', width: 150 },
  { prop: 'dependsOn', label: '联动显示', width: 180 }
]

const tableDesignColumns = [
  { prop: 'field_name', label: '字段名' },
  { prop: 'display_name', label: '显示名称' },
  { prop: 'inTable', label: '列表显示', width: 100 },
  { prop: 'searchable', label: '可查询', width: 90 },
  { prop: 'width', label: '列宽', width: 110 }
]

onMounted(() => loadData())

watch(fields, () => {
  syncConfigMaps()
}, { deep: true })

function syncConfigMaps() {
  fields.value.forEach((field) => {
    if (!formConfigMap[field.field_name]) {
      formConfigMap[field.field_name] = {
        field: field.field_name,
        label: field.display_name,
        inForm: true,
        type: mapFieldTypeToFormType(field.type),
        required: field.required === 1,
        validationRule: field.validation_rule || '',
        dependsOn: { field: '', value: '', operator: 'eq' },
        options: field.options ? JSON.parse(field.options) : undefined
      }
    }
    if (!tableConfigMap[field.field_name]) {
      tableConfigMap[field.field_name] = {
        field: field.field_name,
        label: field.display_name,
        inTable: true,
        searchable: field.type === 'string' || field.type === 'text',
        width: undefined
      }
    }
  })
}

function mapFieldTypeToFormType(type: string) {
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

function typeLabel(type: string) {
  return fieldTypeOptions.find((o) => o.value === type)?.label || type
}

async function loadData() {
  const [data, rules, dictList] = await Promise.all([
    lowcodeApi.getModel(modelId),
    lowcodeApi.getValidationRules(),
    dictApi.getDicts()
  ])
  Object.assign(model, data)
  fields.value = data.fields || []
  validationRules.value = rules || []
  dicts.value = dictList || []

  if (data.forms?.length) {
    const saved = typeof data.forms[0].config === 'string'
      ? JSON.parse(data.forms[0].config)
      : data.forms[0].config
    formConfig.fields = saved.fields || []
    formConfig.fields.forEach((f: any) => {
      formConfigMap[f.field] = f
    })
  }
  if (data.tables?.length) {
    const saved = typeof data.tables[0].config === 'string'
      ? JSON.parse(data.tables[0].config)
      : data.tables[0].config
    tableConfig.fields = saved.fields || []
    tableConfig.fields.forEach((f: any) => {
      tableConfigMap[f.field] = f
    })
  }
  syncConfigMaps()
}

function openFieldDialog(row?: any) {
  Object.keys(fieldForm).forEach((k) => delete fieldForm[k])
  if (row) {
    Object.assign(fieldForm, JSON.parse(JSON.stringify(row)))
    fieldForm.required = row.required === 1
    fieldForm.status = row.status === 1
    fieldForm.dictCode = row.dict_code || ''
    fieldForm.optionsText = row.options && !row.dict_code ? JSON.stringify(JSON.parse(row.options)) : ''
  } else {
    fieldForm.modelId = modelId
    fieldForm.type = 'string'
    fieldForm.length = 255
    fieldForm.required = false
    fieldForm.status = true
    fieldForm.dictCode = ''
    fieldForm.sort = 0
  }
  fieldDialogVisible.value = true
}

function closeFieldDialog() {
  fieldDialogVisible.value = false
}

async function handleSaveField() {
  const data = JSON.parse(JSON.stringify(fieldForm))
  data.modelId = modelId
  data.required = data.required ? 1 : 0
  data.status = data.status ? 1 : 0
  data.dictCode = data.dictCode || ''
  if (['select', 'radio'].includes(data.type)) {
    if (data.dictCode) {
      data.options = undefined
    } else {
      try {
        data.options = data.optionsText ? JSON.parse(data.optionsText) : undefined
      } catch {
        alert('选项 JSON 格式错误')
        return
      }
    }
  } else {
    data.options = undefined
    data.dictCode = ''
  }
  delete data.optionsText

  if (data.id) {
    await lowcodeApi.updateField(data.id, data)
  } else {
    await lowcodeApi.createField(data)
  }
  closeFieldDialog()
  await loadData()
}

function handleDependsOnFieldChange(fieldName: string, val: any) {
  if (!val) {
    formConfigMap[fieldName].dependsOn = { field: '', value: '', operator: 'eq' }
  } else if (!formConfigMap[fieldName].dependsOn) {
    formConfigMap[fieldName].dependsOn = { field: val, value: '', operator: 'eq' }
  }
}

async function handleDeleteField(row: any) {
  if (confirm(`确定删除字段 ${row.display_name} 吗？`)) {
    await lowcodeApi.deleteField(row.id)
    await loadData()
  }
}

async function saveFormConfig() {
  const configFields = fields.value
    .map((f) => {
      const config = { ...formConfigMap[f.field_name] }
      if (!config.dependsOn || !config.dependsOn.field) {
        delete config.dependsOn
      }
      return config
    })
    .filter((f) => f && f.inForm)
  await lowcodeApi.saveForm({
    modelId,
    name: '默认表单',
    config: { fields: configFields },
    status: 1
  })
  alert('表单配置已保存')
}

async function saveTableConfig() {
  const configFields = fields.value
    .map((f) => tableConfigMap[f.field_name])
    .filter((f) => f && f.inTable)
  await lowcodeApi.saveTable({
    modelId,
    name: '默认列表',
    config: { fields: configFields },
    status: 1
  })
  alert('列表配置已保存')
}
</script>

<style scoped>
.designer-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
