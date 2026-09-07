<template>
  <div class="list-page">
    <w-crud-table
      :data="pagedList"
      :columns="columns"
      :query="query"
      :total="total"
      :current-page="query.page"
      :page-size="query.pageSize"
      :searchable="false"
      storage-key="lowcode-coding-rule-list"
      column-draggable
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template #toolbar>
        <w-button type="primary" @click="openDialog()">+ 新增</w-button>
      </template>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="testGenerate(row)">生成</w-button>
          <w-button size="small" @click="openDialog(row)">编辑</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-crud-table>

    <w-dialog v-model="dialogVisible" title="编码规则" width="480">
      <w-form :model="formModel">
        <w-form-item label="规则编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" />
        </w-form-item>
        <w-form-item label="规则名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="前缀">
          <w-input v-model="formModel.prefix" />
        </w-form-item>
        <w-form-item label="日期格式">
          <w-input v-model="formModel.dateFormat" placeholder="YYYYMMDD" />
        </w-form-item>
        <w-form-item label="序号长度">
          <w-input-number v-model="formModel.seqLength" />
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
import * as lowcodeApi from '@/api/lowcode'

const list = ref<any[]>([])
const total = ref(0)
const query = reactive<any>({ page: 1, pageSize: 10 })
const dialogVisible = ref(false)
const formModel = reactive<any>({})

// 后端暂不支持分页，一次性返回全量数组，这里在前端做分页切片
const pagedList = computed(() =>
  list.value.slice((query.page - 1) * query.pageSize, query.page * query.pageSize)
)

const columns = [
  { prop: 'code', label: '规则编码' },
  { prop: 'name', label: '规则名称' },
  { prop: 'prefix', label: '前缀' },
  { prop: 'date_format', label: '日期格式' },
  { prop: 'seq_length', label: '序号长度' },
  { prop: 'current_seq', label: '当前序号' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 200, fixed: 'right' }
]

onMounted(() => loadData())

async function loadData() {
  list.value = await lowcodeApi.getCodingRules()
  // 后端暂不支持分页，total 取全量条数
  total.value = list.value.length
}

function handlePageChange(page: number) {
  query.page = page
}

function handleSizeChange(size: number) {
  query.pageSize = size
  query.page = 1
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
  } else {
    formModel.status = true
    formModel.dateFormat = 'YYYYMMDD'
    formModel.seqLength = 4
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
    await lowcodeApi.updateCodingRule(data.id, data)
  } else {
    await lowcodeApi.createCodingRule(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除规则 ${row.name} 吗？`)) {
    await lowcodeApi.deleteCodingRule(row.id)
    await loadData()
  }
}

async function testGenerate(row: any) {
  const code = await lowcodeApi.generateCode(row.code)
  alert(`生成结果：${code}`)
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>
