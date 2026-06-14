<template>
  <div class="designer-page">
    <w-card :header="`模型设计 - ${model.name || model.code || ''}`">
      <w-tabs v-model="activeTab">
        <w-tab-pane label="字段管理" name="fields">
          <div class="toolbar">
            <w-button v-if="isAdmin" type="primary" size="small" @click="openFieldDialog()">+ 新增字段</w-button>
            <w-tag v-else type="warning">只读模式</w-tag>
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
                <w-button v-if="isAdmin" size="small" @click="openFieldDialog(row)">编辑</w-button>
                <w-button v-if="isAdmin" size="small" type="danger" @click="handleDeleteField(row)">删除</w-button>
                <w-tag v-else type="info">无权限</w-tag>
              </w-space>
            </template>
          </w-table>
        </w-tab-pane>

        <w-tab-pane label="表单设计" name="form">
          <div class="toolbar">
            <template v-if="isAdmin">
              <w-button type="primary" size="small" @click="saveFormConfig">保存表单配置</w-button>
              <w-button size="small" @click="openLayoutDialog">布局配置</w-button>
            </template>
            <w-tag v-else type="warning">只读模式</w-tag>
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
            <template #dynamicOptions="{ row }">
              <w-button size="small" @click="openOptionDialog(row.field_name)">
                {{ formConfigMap[row.field_name].dynamicOptions?.type ? '已配置' : '配置' }}
              </w-button>
            </template>
            <template #codingRule="{ row }">
              <w-select v-model="formConfigMap[row.field_name].codingRule" :options="codingRuleOptions" style="width: 130px" />
            </template>
          </w-table>
        </w-tab-pane>

        <w-tab-pane label="列表设计" name="table">
          <div class="toolbar">
            <w-button v-if="isAdmin" type="primary" size="small" @click="saveTableConfig">保存列表配置</w-button>
            <w-tag v-else type="warning">只读模式</w-tag>
          </div>
          <w-form :inline="true" style="margin-bottom: 12px">
            <w-form-item label="工具栏">
              <w-checkbox-group v-model="tableConfig.toolbar" :options="toolbarActionOptions" />
            </w-form-item>
            <w-form-item label="行操作">
              <w-checkbox-group v-model="tableConfig.rowActions" :options="rowActionOptions" />
            </w-form-item>
          </w-form>
          <w-card v-if="tableConfig.toolbar.length" header="工具栏按钮权限" size="small" style="margin-bottom: 12px">
            <w-form :inline="true">
              <w-form-item v-for="action in tableConfig.toolbar" :key="action" :label="actionLabel(action, toolbarActionOptions)">
                <w-input v-model="tableConfig.toolbarPermissions[action]" placeholder="权限标识，留空不控制" style="width: 180px" />
              </w-form-item>
            </w-form>
          </w-card>
          <w-card v-if="tableConfig.rowActions.length" header="行操作按钮权限" size="small" style="margin-bottom: 12px">
            <w-form :inline="true">
              <w-form-item v-for="action in tableConfig.rowActions" :key="action" :label="actionLabel(action, rowActionOptions)">
                <w-input v-model="tableConfig.rowActionPermissions[action]" placeholder="权限标识，留空不控制" style="width: 180px" />
              </w-form-item>
            </w-form>
          </w-card>
          <w-table :data="fields" :columns="tableDesignColumns" stripe border>
            <template #inTable="{ row }">
              <w-switch v-model="tableConfigMap[row.field_name].inTable" />
            </template>
            <template #format="{ row }">
              <w-select v-model="tableConfigMap[row.field_name].format" :options="formatOptions" style="width: 100px" />
            </template>
            <template #align="{ row }">
              <w-select v-model="tableConfigMap[row.field_name].align" :options="alignOptions" style="width: 80px" />
            </template>
            <template #fixed="{ row }">
              <w-select v-model="tableConfigMap[row.field_name].fixed" :options="fixedOptions" style="width: 80px" />
            </template>
            <template #searchable="{ row }">
              <w-switch v-model="tableConfigMap[row.field_name].searchable" />
            </template>
            <template #searchMode="{ row }">
              <w-select v-model="tableConfigMap[row.field_name].searchMode" :options="searchModeOptions" style="width: 100px" />
            </template>
            <template #sortable="{ row }">
              <w-switch v-model="tableConfigMap[row.field_name].sortable" />
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
        <w-form-item label="默认值类型">
          <w-select v-model="fieldForm.defaultValueType" :options="defaultValueTypeOptions" />
        </w-form-item>
        <w-form-item v-if="fieldForm.defaultValueType === 'constant'" label="默认值">
          <w-input v-model="fieldForm.defaultValueExpr" placeholder="常量值" />
        </w-form-item>
        <w-form-item v-else-if="fieldForm.defaultValueType === 'field'" label="关联字段">
          <w-select v-model="fieldForm.defaultValueExpr" :options="dependFieldOptions" />
        </w-form-item>
        <w-form-item v-else-if="fieldForm.defaultValueType === 'expr'" label="表达式">
          <w-input v-model="fieldForm.defaultValueExpr" placeholder="例如 date('Y-m-d')" />
        </w-form-item>
        <w-form-item v-if="['select', 'radio'].includes(fieldForm.type)" label="关联字典">
          <w-select v-model="fieldForm.dictCode" :options="dictOptions" />
        </w-form-item>
        <w-form-item v-if="['select', 'radio'].includes(fieldForm.type) && !fieldForm.dictCode" label="选项（JSON）">
          <w-input v-model="fieldForm.optionsText" type="textarea" placeholder='[{"label":"男","value":"1"}]' />
        </w-form-item>
        <w-form-item v-if="fieldForm.type === 'ref'" label="关联模型">
          <w-select v-model="fieldForm.refModel" :options="modelOptions" />
        </w-form-item>
        <w-form-item v-if="fieldForm.type === 'ref' && fieldForm.refModel" label="显示字段">
          <w-select v-model="fieldForm.refDisplayField" :options="refFieldOptions" />
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

    <!-- 布局配置弹窗 -->
    <w-dialog v-model="layoutDialogVisible" title="表单布局配置（JSON）" width="600">
      <w-input v-model="layoutText" type="textarea" :rows="16" placeholder='{"type":"tabs","tabs":[{"title":"基本信息","name":"base","children":["name","phone"]}]}' />
      <template #footer>
        <w-button @click="layoutDialogVisible = false">取消</w-button>
        <w-button type="primary" @click="saveLayoutConfig">保存</w-button>
      </template>
    </w-dialog>

    <!-- 动态选项配置弹窗 -->
    <w-dialog v-model="optionDialogVisible" title="动态选项配置" width="480">
      <w-form :model="optionForm">
        <w-form-item label="数据源类型">
          <w-select v-model="optionForm.type" :options="optionTypeOptions" />
        </w-form-item>
        <w-form-item label="依赖字段">
          <w-select v-model="optionForm.dependsOn" :options="dependFieldOptions" style="width: 200px" />
        </w-form-item>
        <w-form-item v-if="optionForm.type === 'external'" label="外部数据源">
          <w-select v-model="optionForm.externalDataSourceId" :options="externalDataSourceOptions" />
        </w-form-item>
        <w-form-item v-if="optionForm.type === 'external'" label="标签字段">
          <w-input v-model="optionForm.labelField" placeholder="label" />
        </w-form-item>
        <w-form-item v-if="optionForm.type === 'external'" label="值字段">
          <w-input v-model="optionForm.valueField" placeholder="value" />
        </w-form-item>
        <w-form-item v-if="optionForm.type === 'external'" label="额外参数(JSON)">
          <w-input v-model="optionForm.paramsText" type="textarea" :rows="2" placeholder='{"key":"value"}' />
        </w-form-item>
        <w-form-item v-if="optionForm.type === 'dict'" label="字典编码">
          <w-select v-model="optionForm.dictCode" :options="dictOptions" />
        </w-form-item>
        <w-form-item v-if="optionForm.type === 'sql'" label="SQL">
          <textarea v-model="optionForm.sql" class="w-xp-textarea" rows="3" placeholder="SELECT label, value FROM ... WHERE parent_id = ${ctx.依赖字段}" />
        </w-form-item>
        <w-form-item v-if="optionForm.type === 'api'" label="请求方式">
          <w-select v-model="optionForm.api.method" :options="httpMethodOptions" />
        </w-form-item>
        <w-form-item v-if="optionForm.type === 'api'" label="接口地址">
          <w-input v-model="optionForm.api.url" placeholder="例如 /lowcode/options/execute" />
        </w-form-item>
        <w-form-item v-if="optionForm.type === 'script'" label="执行脚本">
          <textarea v-model="optionForm.script" class="w-xp-textarea" rows="4" placeholder="return await db.raw('SELECT ... WHERE parent_id = ?', [ctx.依赖字段])" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeOptionDialog">取消</w-button>
        <w-button type="danger" @click="clearOptionConfig">清除</w-button>
        <w-button type="primary" @click="saveOptionConfig">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as lowcodeApi from '@/api/lowcode'
import * as dictApi from '@/api/dict'
import * as externalDatasourceApi from '@/api/external-datasource'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.userInfo?.roleId === 1 || authStore.permissions?.includes('*'))
const modelId = Number(route.params.id)

const activeTab = ref('fields')
const model = reactive<any>({})
const fields = ref<any[]>([])
const formConfig = reactive<any>({ fields: [] })
const tableConfig = reactive<any>({
  fields: [],
  toolbar: ['create', 'batchDelete', 'export', 'import'],
  rowActions: ['edit', 'delete', 'view'],
  toolbarPermissions: {},
  rowActionPermissions: {}
})
const formConfigMap = reactive<Record<string, any>>({})
const tableConfigMap = reactive<Record<string, any>>({})
const validationRules = ref<any[]>([])
const dicts = ref<any[]>([])
const codingRules = ref<any[]>([])

const fieldDialogVisible = ref(false)
const fieldForm = reactive<any>({})
const optionDialogVisible = ref(false)
const layoutDialogVisible = ref(false)
const layoutText = ref('')
const optionForm = reactive<any>({
  fieldName: '',
  type: '',
  dependsOn: '',
  dictCode: '',
  sql: '',
  api: { method: 'GET', url: '', params: {}, body: {} },
  script: ''
})

const optionTypeOptions = [
  { label: '无', value: '' },
  { label: '系统字典', value: 'dict' },
  { label: '外部数据源', value: 'external' },
  { label: 'SQL', value: 'sql' },
  { label: '内部接口', value: 'api' },
  { label: '脚本', value: 'script' }
]

const externalDataSources = ref<any[]>([])

const httpMethodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' }
]

const fieldTypeOptions = [
  { label: '字符串', value: 'string' },
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '布尔', value: 'boolean' },
  { label: '日期', value: 'date' },
  { label: '日期时间', value: 'datetime' },
  { label: '下拉选择', value: 'select' },
  { label: '单选', value: 'radio' },
  { label: '关联模型', value: 'ref' },
  { label: '文件上传', value: 'upload' },
  { label: '级联选择', value: 'cascader' },
  { label: '富文本', value: 'rich-text' }
]

const defaultValueTypeOptions = [
  { label: '常量', value: 'constant' },
  { label: '当前用户', value: 'currentUser' },
  { label: '当前时间', value: 'currentTime' },
  { label: '当前部门', value: 'currentDept' },
  { label: '关联字段', value: 'field' },
  { label: '表达式', value: 'expr' }
]

const validationRuleOptions = computed(() => [
  { label: '无', value: '' },
  ...(validationRules.value || []).map((r: any) => ({ label: r.name, value: r.code }))
])

const codingRuleOptions = computed(() => [
  { label: '无', value: '' },
  ...(codingRules.value || []).map((r: any) => ({ label: r.name, value: r.code }))
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

const modelOptions = computed(() => [
  { label: '请选择', value: '' },
  ...models.value.map((m: any) => ({ label: m.name, value: m.code }))
])

const refFieldOptions = computed(() => {
  if (!fieldForm.refModel) return []
  const target = models.value.find((m: any) => m.code === fieldForm.refModel)
  if (!target || !target.fields) return []
  return target.fields.map((f: any) => ({ label: f.display_name || f.field_name, value: f.field_name }))
})

const dependFieldOptions = computed(() => [
  { label: '无', value: '' },
  ...fields.value.map((f) => ({ label: f.display_name || f.field_name, value: f.field_name }))
])

const externalDataSourceOptions = computed(() => [
  { label: '请选择', value: '' },
  ...externalDataSources.value.map((ds: any) => ({ label: ds.name, value: String(ds.id) }))
])

const formTypeOptions = [
  { label: '输入框', value: 'input' },
  { label: '文本域', value: 'textarea' },
  { label: '数字', value: 'number' },
  { label: '开关', value: 'switch' },
  { label: '日期', value: 'date' },
  { label: '日期时间', value: 'datetime' },
  { label: '下拉', value: 'select' },
  { label: '单选', value: 'radio' },
  { label: '关联模型', value: 'ref' },
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
  { prop: 'dependsOn', label: '联动显示', width: 180 },
  { prop: 'dynamicOptions', label: '动态选项', width: 100 },
  { prop: 'codingRule', label: '编码规则', width: 150 }
]

const tableDesignColumns = [
  { prop: 'field_name', label: '字段名' },
  { prop: 'display_name', label: '显示名称' },
  { prop: 'inTable', label: '列表显示', width: 100 },
  { prop: 'format', label: '格式化', width: 120 },
  { prop: 'align', label: '对齐', width: 100 },
  { prop: 'fixed', label: '固定', width: 100 },
  { prop: 'searchable', label: '可查询', width: 90 },
  { prop: 'searchMode', label: '查询方式', width: 120 },
  { prop: 'sortable', label: '可排序', width: 90 },
  { prop: 'width', label: '列宽', width: 110 }
]

const formatOptions = [
  { label: '无', value: '' },
  { label: '日期', value: 'date' },
  { label: '日期时间', value: 'datetime' },
  { label: '数字', value: 'number' },
  { label: '金额', value: 'money' },
  { label: '百分比', value: 'percent' },
  { label: '布尔', value: 'boolean' },
  { label: '字典', value: 'dict' }
]

const alignOptions = [
  { label: '左', value: 'left' },
  { label: '中', value: 'center' },
  { label: '右', value: 'right' }
]

const fixedOptions = [
  { label: '无', value: '' },
  { label: '左侧', value: 'left' },
  { label: '右侧', value: 'right' }
]

const searchModeOptions = [
  { label: '等于', value: 'eq' },
  { label: '包含', value: 'like' },
  { label: '范围', value: 'between' },
  { label: '大于', value: 'gt' },
  { label: '小于', value: 'lt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于等于', value: 'lte' }
]

const toolbarActionOptions = [
  { label: '新增', value: 'create' },
  { label: '批量删除', value: 'batchDelete' },
  { label: '导出', value: 'export' },
  { label: '导入', value: 'import' }
]

const rowActionOptions = [
  { label: '编辑', value: 'edit' },
  { label: '删除', value: 'delete' },
  { label: '查看', value: 'view' }
]

function actionLabel(value: string, options: any[]) {
  return options.find((o) => o.value === value)?.label || value
}

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
        dynamicOptions: { type: '' },
        codingRule: '',
        refModel: field.ref_model || '',
        refDisplayField: field.ref_display_field || '',
        defaultValueType: field.default_value_type || 'constant',
        defaultValueExpr: field.default_value_expr || '',
        options: field.options ? JSON.parse(field.options) : undefined
      }
    } else {
      if (!formConfigMap[field.field_name].dependsOn) {
        formConfigMap[field.field_name].dependsOn = { field: '', value: '', operator: 'eq' }
      }
      if (!formConfigMap[field.field_name].dynamicOptions) {
        formConfigMap[field.field_name].dynamicOptions = { type: '' }
      }
      if (formConfigMap[field.field_name].codingRule === undefined) {
        formConfigMap[field.field_name].codingRule = ''
      }
      if (formConfigMap[field.field_name].defaultValueType === undefined) {
        formConfigMap[field.field_name].defaultValueType = 'constant'
      }
      if (formConfigMap[field.field_name].defaultValueExpr === undefined) {
        formConfigMap[field.field_name].defaultValueExpr = ''
      }
    }
    if (!tableConfigMap[field.field_name]) {
      tableConfigMap[field.field_name] = {
        field: field.field_name,
        label: field.display_name,
        inTable: true,
        format: '',
        align: 'left',
        fixed: '',
        searchable: field.type === 'string' || field.type === 'text',
        searchMode: 'like',
        sortable: false,
        width: undefined
      }
    } else {
      if (tableConfigMap[field.field_name].format === undefined) tableConfigMap[field.field_name].format = ''
      if (tableConfigMap[field.field_name].align === undefined) tableConfigMap[field.field_name].align = 'left'
      if (tableConfigMap[field.field_name].fixed === undefined) tableConfigMap[field.field_name].fixed = ''
      if (tableConfigMap[field.field_name].searchMode === undefined) tableConfigMap[field.field_name].searchMode = 'like'
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
    ref: 'ref',
    upload: 'upload',
    cascader: 'cascader',
    'rich-text': 'rich-text'
  }
  return map[type] || 'input'
}

function typeLabel(type: string) {
  return fieldTypeOptions.find((o) => o.value === type)?.label || type
}

const models = ref<any[]>([])

async function loadData() {
  const [data, rules, dictList, codingRuleList, modelList, dsList] = await Promise.all([
    lowcodeApi.getModel(modelId),
    lowcodeApi.getValidationRules(),
    dictApi.getDicts(),
    lowcodeApi.getCodingRules(),
    lowcodeApi.getModels(),
    externalDatasourceApi.getExternalDataSources()
  ])
  Object.assign(model, data)
  fields.value = data.fields || []
  validationRules.value = rules || []
  dicts.value = dictList || []
  codingRules.value = codingRuleList || []
  models.value = modelList || []
  externalDataSources.value = dsList || []

  if (data.forms?.length) {
    const saved = typeof data.forms[0].config === 'string'
      ? JSON.parse(data.forms[0].config)
      : data.forms[0].config
    formConfig.fields = saved.fields || []
    formConfig.layout = saved.layout
    formConfig.fields.forEach((f: any) => {
      formConfigMap[f.field] = f
    })
  }
  if (data.tables?.length) {
    const saved = typeof data.tables[0].config === 'string'
      ? JSON.parse(data.tables[0].config)
      : data.tables[0].config
    tableConfig.fields = saved.fields || []
    tableConfig.toolbar = saved.toolbar || ['create', 'batchDelete', 'export', 'import']
    tableConfig.rowActions = saved.rowActions || ['edit', 'delete', 'view']
    tableConfig.toolbarPermissions = saved.toolbarPermissions || {}
    tableConfig.rowActionPermissions = saved.rowActionPermissions || {}
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
    fieldForm.refModel = row.ref_model || ''
    fieldForm.refDisplayField = row.ref_display_field || ''
    fieldForm.defaultValueType = row.default_value_type || 'constant'
    fieldForm.defaultValueExpr = row.default_value_expr || ''
  } else {
    fieldForm.modelId = modelId
    fieldForm.type = 'string'
    fieldForm.length = 255
    fieldForm.required = false
    fieldForm.status = true
    fieldForm.dictCode = ''
    fieldForm.defaultValueType = 'constant'
    fieldForm.defaultValueExpr = ''
    fieldForm.sort = 0
  }
  fieldDialogVisible.value = true
}

function closeFieldDialog() {
  fieldDialogVisible.value = false
}

function openOptionDialog(fieldName: string) {
  Object.keys(optionForm).forEach((k) => delete optionForm[k])
  const existing = formConfigMap[fieldName].dynamicOptions || { type: '' }
  Object.assign(optionForm, {
    fieldName,
    type: existing.type || '',
    dependsOn: existing.dependsOn || '',
    dictCode: existing.dictCode || '',
    externalDataSourceId: existing.externalDataSourceId ? String(existing.externalDataSourceId) : '',
    labelField: existing.labelField || 'label',
    valueField: existing.valueField || 'value',
    paramsText: existing.params ? JSON.stringify(existing.params) : '',
    sql: existing.sql || '',
    api: { method: 'GET', url: '', params: {}, body: {}, ...(existing.api || {}) },
    script: existing.script || ''
  })
  optionDialogVisible.value = true
}

function closeOptionDialog() {
  optionDialogVisible.value = false
}

function saveOptionConfig() {
  const config: any = { type: optionForm.type || '' }
  if (!config.type) {
    formConfigMap[optionForm.fieldName].dynamicOptions = { type: '' }
    closeOptionDialog()
    return
  }
  if (optionForm.dependsOn) config.dependsOn = optionForm.dependsOn
  if (config.type === 'dict') config.dictCode = optionForm.dictCode || ''
  if (config.type === 'external') {
    config.externalDataSourceId = optionForm.externalDataSourceId ? Number(optionForm.externalDataSourceId) : undefined
    config.labelField = optionForm.labelField || 'label'
    config.valueField = optionForm.valueField || 'value'
    try {
      config.params = optionForm.paramsText ? JSON.parse(optionForm.paramsText) : {}
    } catch {
      alert('额外参数 JSON 格式错误')
      return
    }
  }
  if (config.type === 'sql') config.sql = optionForm.sql || ''
  if (config.type === 'api') config.api = optionForm.api || { method: 'GET', url: '' }
  if (config.type === 'script') config.script = optionForm.script || ''
  formConfigMap[optionForm.fieldName].dynamicOptions = config
  closeOptionDialog()
}

function clearOptionConfig() {
  formConfigMap[optionForm.fieldName].dynamicOptions = { type: '' }
  closeOptionDialog()
}

async function handleSaveField() {
  if (!checkDesignPermission()) return
  const data = JSON.parse(JSON.stringify(fieldForm))
  data.modelId = modelId
  data.required = data.required ? 1 : 0
  data.status = data.status ? 1 : 0
  data.dictCode = data.dictCode || ''
  data.refModel = data.refModel || ''
  data.refDisplayField = data.refDisplayField || ''
  data.defaultValueType = data.defaultValueType || 'constant'
  data.defaultValueExpr = data.defaultValueExpr || ''
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
  if (data.type !== 'ref') {
    data.refModel = ''
    data.refDisplayField = ''
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
  if (!checkDesignPermission()) return
  if (confirm(`确定删除字段 ${row.display_name} 吗？`)) {
    await lowcodeApi.deleteField(row.id)
    await loadData()
  }
}

function checkDesignPermission() {
  if (!isAdmin.value) {
    alert('您没有模型设计权限')
    return false
  }
  return true
}

async function saveFormConfig() {
  if (!checkDesignPermission()) return
  const configFields = fields.value
    .map((f) => {
      const config = { ...formConfigMap[f.field_name] }
      if (!config.dependsOn || !config.dependsOn.field) {
        delete config.dependsOn
      }
      if (!config.dynamicOptions || !config.dynamicOptions.type) {
        delete config.dynamicOptions
      }
      if (!config.codingRule) {
        delete config.codingRule
      }
      if (!config.defaultValueType || config.defaultValueType === 'constant') {
        delete config.defaultValueType
        delete config.defaultValueExpr
      }
      return config
    })
    .filter((f) => f && f.inForm)
  const config: any = { fields: configFields }
  if (formConfig.layout) config.layout = formConfig.layout
  await lowcodeApi.saveForm({
    modelId,
    name: '默认表单',
    config,
    status: 1
  })
  alert('表单配置已保存')
}

function openLayoutDialog() {
  layoutText.value = formConfig.layout ? JSON.stringify(formConfig.layout, null, 2) : ''
  layoutDialogVisible.value = true
}

function saveLayoutConfig() {
  try {
    const layout = layoutText.value ? JSON.parse(layoutText.value) : undefined
    formConfig.layout = layout
    layoutDialogVisible.value = false
  } catch {
    alert('JSON 格式错误')
  }
}

async function saveTableConfig() {
  if (!checkDesignPermission()) return
  const configFields = fields.value
    .map((f) => {
      const config = { ...tableConfigMap[f.field_name] }
      if (!config.format) delete config.format
      if (!config.fixed) delete config.fixed
      if (config.align === 'left') delete config.align
      if (config.searchMode === 'like') delete config.searchMode
      return config
    })
    .filter((f) => f && f.inTable)
  // 只保存已启用按钮的权限
  const toolbarPermissions: Record<string, string> = {}
  const rowActionPermissions: Record<string, string> = {}
  for (const action of tableConfig.toolbar || []) {
    if (tableConfig.toolbarPermissions?.[action]) {
      toolbarPermissions[action] = tableConfig.toolbarPermissions[action]
    }
  }
  for (const action of tableConfig.rowActions || []) {
    if (tableConfig.rowActionPermissions?.[action]) {
      rowActionPermissions[action] = tableConfig.rowActionPermissions[action]
    }
  }

  await lowcodeApi.saveTable({
    modelId,
    name: '默认列表',
    config: {
      fields: configFields,
      toolbar: tableConfig.toolbar || ['create', 'batchDelete', 'export', 'import'],
      rowActions: tableConfig.rowActions || ['edit', 'delete', 'view'],
      toolbarPermissions,
      rowActionPermissions
    },
    status: 1
  })
  alert('列表配置已保存')
}
</script>

<style scoped>
.designer-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
