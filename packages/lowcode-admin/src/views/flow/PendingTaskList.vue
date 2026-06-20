<template>
  <div class="list-page">
    <w-table :data="tasks" :columns="columns" stripe border>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="openDetail(row)">详情</w-button>
          <w-button size="small" type="primary" @click="handleApprove(row)">通过</w-button>
          <w-button size="small" type="danger" @click="handleReject(row)">驳回</w-button>
        </w-space>
      </template>
    </w-table>

    <w-dialog v-model="detailVisible" title="审批详情" width="700">
      <w-tabs v-model="activeTab">
        <w-tab-pane label="业务数据" name="data">
          <w-descriptions v-if="businessData" :items="businessDataItems" :column="2" border />
          <w-empty v-else description="暂无业务数据" />
        </w-tab-pane>
        <w-tab-pane label="流程轨迹" name="trace">
          <w-timeline v-if="traceData?.tasks?.length" :items="traceItems" />
          <w-empty v-else description="暂无流程轨迹" />
        </w-tab-pane>
      </w-tabs>
      <template #footer>
        <w-button @click="closeDetail">关闭</w-button>
        <w-button type="primary" @click="handleApprove(currentTask)">通过</w-button>
        <w-button type="danger" @click="handleReject(currentTask)">驳回</w-button>
      </template>
    </w-dialog>

    <w-dialog v-model="dialogVisible" title="审批意见" width="400">
      <w-form :model="commentForm">
        <w-form-item label="审批意见">
          <w-input v-model="commentForm.comment" type="textarea" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeDialog">取消</w-button>
        <w-button type="primary" @click="confirmAction">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import * as flowApi from '@/api/flow'
import * as lowcodeApi from '@/api/lowcode'
import * as monitorApi from '@/api/monitor'

const tasks = ref<any[]>([])
const dialogVisible = ref(false)
const detailVisible = ref(false)
const commentForm = reactive({ comment: '' })
const currentTask = ref<any>(null)
const currentAction = ref<'approve' | 'reject'>('approve')
const activeTab = ref('data')
const businessData = ref<any>(null)
const traceData = ref<any>(null)

const columns = [
  { prop: 'flow_name', label: '流程名称' },
  { prop: 'model_code', label: '业务模型' },
  { prop: 'business_key', label: '业务主键' },
  { prop: 'node_name', label: '当前节点' },
  { prop: 'create_time', label: '创建时间' },
  { prop: 'action', label: '操作', width: 220, fixed: 'right' }
]

const businessDataItems = computed(() => {
  if (!businessData.value) return []
  return Object.entries(businessData.value)
    .filter(([key]) => !['id', 'create_by', 'update_by', 'dept_id', 'create_time', 'update_time', '__flow_status', '__flow_task_id'].includes(key))
    .map(([label, value]) => ({ label, value: value === null || value === undefined ? '' : String(value) }))
})

const traceItems = computed(() => {
  if (!traceData.value?.tasks?.length) return []
  return traceData.value.tasks.map((t: any) => ({
    time: t.updateTime || t.createTime || '',
    title: t.nodeName,
    content: formatTraceDesc(t),
    color: t.status === 'pending' ? '#e6a23c' : t.status === 'approved' ? '#67c23a' : t.status === 'rejected' ? '#f56c6c' : '#909399'
  }))
})

function formatTraceDesc(task: any) {
  const parts: string[] = []
  if (task.status === 'pending') {
    parts.push('待审批')
  } else if (task.status === 'approved') {
    parts.push(`审批通过${task.operatorName ? ` - ${task.operatorName}` : ''}`)
  } else if (task.status === 'rejected') {
    parts.push(`已驳回${task.operatorName ? ` - ${task.operatorName}` : ''}`)
  } else if (task.status === 'cc') {
    parts.push('抄送')
  }
  if (task.comment) parts.push(`意见：${task.comment}`)
  return parts.join(' · ')
}

onMounted(() => loadData())

async function loadData() {
  tasks.value = await flowApi.getPendingTasks()
}

async function openDetail(row: any) {
  currentTask.value = row
  activeTab.value = 'data'
  businessData.value = null
  traceData.value = null
  detailVisible.value = true

  try {
    const [detail, trace] = await Promise.all([
      lowcodeApi.getDynamicDetail(row.model_code, row.business_key),
      flowApi.getFlowTrace(row.business_key)
    ])
    businessData.value = detail
    traceData.value = trace
  } catch (error: any) {
    alert(error.message || '加载详情失败')
  }
}

function closeDetail() {
  detailVisible.value = false
}

function handleApprove(row: any) {
  currentTask.value = row
  currentAction.value = 'approve'
  commentForm.comment = ''
  dialogVisible.value = true
}

function handleReject(row: any) {
  currentTask.value = row
  currentAction.value = 'reject'
  commentForm.comment = ''
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function confirmAction() {
  if (!currentTask.value) return
  try {
    if (currentAction.value === 'approve') {
      await flowApi.approveTask(currentTask.value.id, commentForm.comment)
    } else {
      await flowApi.rejectTask(currentTask.value.id, commentForm.comment)
    }
    // 将对应的待办消息标为已读
    try {
      await monitorApi.markMessageReadByBusinessKey('flow', String(currentTask.value.id))
    } catch (e) {
      // 不影响主流程
    }
    closeDialog()
    closeDetail()
    await loadData()
  } catch (error: any) {
    alert(error.message || '操作失败')
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>
