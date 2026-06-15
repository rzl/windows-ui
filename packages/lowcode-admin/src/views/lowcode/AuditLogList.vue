<template>
  <div class="list-page">
    <w-card header="数据审计日志">
      <w-form inline :model="query">
        <w-form-item label="模型编码">
          <w-input v-model="query.modelCode" placeholder="请输入模型编码" clearable />
        </w-form-item>
        <w-form-item label="操作类型">
          <w-select v-model="query.action" :options="actionOptions" placeholder="全部" clearable style="width: 120px" />
        </w-form-item>
        <w-form-item label="记录 ID">
          <w-input v-model.number="query.recordId" placeholder="请输入记录 ID" clearable />
        </w-form-item>
        <w-form-item label="操作人">
          <w-input v-model="query.operatorName" placeholder="请输入操作人" clearable />
        </w-form-item>
        <w-form-item label="开始时间">
          <w-input v-model="query.startTime" placeholder="YYYY-MM-DD HH:mm:ss" />
        </w-form-item>
        <w-form-item label="结束时间">
          <w-input v-model="query.endTime" placeholder="YYYY-MM-DD HH:mm:ss" />
        </w-form-item>
        <w-form-item>
          <w-button type="primary" @click="handleSearch">查询</w-button>
          <w-button @click="handleReset">重置</w-button>
        </w-form-item>
      </w-form>

      <w-table :data="list" :columns="columns" stripe border>
        <template #action_type="{ row }">
          <w-tag :type="actionTagType(row.action)">{{ actionText(row.action) }}</w-tag>
        </template>
        <template #create_time="{ row }">
          {{ formatTime(row.create_time) }}
        </template>
        <template #action="{ row }">
          <w-button size="small" @click="openDetail(row)">详情</w-button>
        </template>
      </w-table>

      <w-pagination
        :current-page="query.page"
        :page-size="query.pageSize"
        :total="total"
        @update:current-page="handlePageChange"
      />
    </w-card>

    <w-dialog v-model="detailVisible" title="审计详情" width="720">
      <div v-if="current" class="audit-detail">
        <div class="detail-row">
          <span class="detail-label">模型编码：</span>
          <span>{{ current.model_code }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">记录 ID：</span>
          <span>{{ current.record_id }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">操作类型：</span>
          <span>{{ actionText(current.action) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">操作人：</span>
          <span>{{ current.operator_name || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">IP：</span>
          <span>{{ current.ip || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">操作时间：</span>
          <span>{{ formatTime(current.create_time) }}</span>
        </div>
        <div class="detail-block">
          <div class="detail-label">变更内容（diff）</div>
          <pre>{{ formatJson(current.diff) }}</pre>
        </div>
        <div class="detail-block">
          <div class="detail-label">变更前（before）</div>
          <pre>{{ formatJson(current.before) }}</pre>
        </div>
        <div class="detail-block">
          <div class="detail-label">变更后（after）</div>
          <pre>{{ formatJson(current.after) }}</pre>
        </div>
      </div>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as auditApi from '@/api/audit'

const query = reactive({
  modelCode: '',
  action: '',
  recordId: undefined as number | undefined,
  operatorName: '',
  startTime: '',
  endTime: '',
  page: 1,
  pageSize: 10
})

const list = ref<any[]>([])
const total = ref(0)
const detailVisible = ref(false)
const current = ref<any>(null)
const actionOptions = ref<{ label: string; value: string }[]>([])

const columns = [
  { prop: 'id', label: 'ID', width: 70 },
  { prop: 'model_code', label: '模型编码' },
  { prop: 'record_id', label: '记录 ID', width: 90 },
  { prop: 'action', label: '操作类型', width: 100, slot: 'action_type' },
  { prop: 'operator_name', label: '操作人', width: 120 },
  { prop: 'ip', label: 'IP', width: 140 },
  { prop: 'create_time', label: '操作时间', width: 170, slot: 'create_time' },
  { prop: 'action', label: '操作', width: 90, fixed: 'right', slot: 'action' }
]

onMounted(() => {
  loadData()
  loadActions()
})

async function loadData() {
  const params: any = {
    page: query.page,
    pageSize: query.pageSize
  }
  if (query.modelCode) params.modelCode = query.modelCode
  if (query.action) params.action = query.action
  if (query.recordId) params.recordId = query.recordId
  if (query.operatorName) params.operatorName = query.operatorName
  if (query.startTime) params.startTime = query.startTime
  if (query.endTime) params.endTime = query.endTime

  const res = await auditApi.getAuditLogs(params)
  list.value = res.list || []
  total.value = res.total || 0
}

async function loadActions() {
  const actions = await auditApi.getAuditActions()
  actionOptions.value = (actions || []).map((a: string) => ({
    label: actionText(a),
    value: a
  }))
}

function handleSearch() {
  query.page = 1
  loadData()
}

function handleReset() {
  query.modelCode = ''
  query.action = ''
  query.recordId = undefined
  query.operatorName = ''
  query.startTime = ''
  query.endTime = ''
  query.page = 1
  loadData()
}

function handlePageChange(page: number) {
  query.page = page
  loadData()
}

function openDetail(row: any) {
  current.value = row
  detailVisible.value = true
}

function actionText(action: string) {
  const map: Record<string, string> = {
    create: '新增',
    update: '修改',
    delete: '删除'
  }
  return map[action] || action
}

function actionTagType(action: string) {
  const map: Record<string, string> = {
    create: 'success',
    update: 'warning',
    delete: 'danger'
  }
  return map[action] || 'default'
}

function formatJson(value: string | object | null | undefined) {
  if (!value) return '无'
  try {
    const obj = typeof value === 'string' ? JSON.parse(value) : value
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(value)
  }
}

function formatTime(value: string | Date | null | undefined) {
  if (!value) return '-'
  const date = typeof value === 'string' ? new Date(value) : value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
</script>

<style scoped>
.list-page { padding: 8px; }
.audit-detail { font-size: var(--w-font-size-base); }
.detail-row { display: flex; margin-bottom: 8px; }
.detail-label { color: var(--w-text-color-secondary); min-width: 90px; }
.detail-block { margin-top: 12px; }
.detail-block pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  max-height: 200px;
  overflow: auto;
  font-size: 12px;
  margin-top: 6px;
}
</style>
