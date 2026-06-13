<template>
  <div class="list-page">
    <w-card :header="model.name || model.code || '低代码页面'">
      <w-crud-table
        :data="list"
        :columns="tableColumns"
        :query="query"
        :total="total"
        :current-page="query.page"
        :page-size="query.pageSize"
        @search="handleSearch"
        @reset="handleReset"
        @page-change="handlePageChange"
      >
        <template #search>
          <w-form-item v-if="searchableFields.length" label="关键词">
            <w-input v-model="query.keyword" placeholder="多字段模糊搜索" />
          </w-form-item>
        </template>
        <template #toolbar>
          <w-button type="primary" @click="openDialog()">+ 新增</w-button>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" @click="openDialog(row)">编辑</w-button>
            <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-crud-table>
    </w-card>

    <w-dialog v-model="dialogVisible" :title="dialogTitle" width="560">
      <w-dynamic-form v-model="formModel" :fields="formFields" :columns="2" />
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

const route = useRoute()
const modelCode = computed(() => route.params.modelCode as string)

const model = reactive<any>({})
const formConfig = reactive<any>({ fields: [] })
const tableConfig = reactive<any>({ fields: [] })
const list = ref<any[]>([])
const total = ref(0)
const query = reactive({ keyword: '', page: 1, pageSize: 10 })
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const formModel = reactive<any>({})

const formFields = computed(() => {
  return formConfig.fields.map((f: any) => ({
    prop: f.field,
    label: f.label,
    type: f.type || 'input',
    required: f.required,
    options: f.options
  }))
})

const tableColumns = computed(() => {
  return tableConfig.fields.map((f: any) => ({
    prop: f.field,
    label: f.label,
    width: f.width
  }))
})

const searchableFields = computed(() => {
  return tableConfig.fields.filter((f: any) => f.searchable)
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

function mapType(type: string) {
  const map: Record<string, string> = {
    string: 'input',
    text: 'textarea',
    number: 'number',
    boolean: 'switch',
    date: 'date',
    datetime: 'datetime',
    select: 'select',
    radio: 'radio'
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

async function handleSave() {
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

async function handleSearch() {
  query.page = 1
  await loadData()
}

async function handleReset() {
  query.keyword = ''
  query.page = 1
  await loadData()
}

async function handlePageChange(page: number) {
  query.page = page
  await loadData()
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>
