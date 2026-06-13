<template>
  <div class="list-page">
    <w-card header="我的待办">
      <w-table :data="tasks" :columns="columns" stripe border>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" type="primary" @click="handleApprove(row)">通过</w-button>
            <w-button size="small" type="danger" @click="handleReject(row)">驳回</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

    <w-dialog v-model="dialogVisible" title="审批意见" width="400">
      <w-form :model="commentForm">
        <w-form-item label="审批意见">
          <w-input v-model="commentForm.comment" />
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
import { onMounted, reactive, ref } from 'vue'
import * as flowApi from '@/api/flow'

const tasks = ref<any[]>([])
const dialogVisible = ref(false)
const commentForm = reactive({ comment: '' })
const currentTask = ref<any>(null)
const currentAction = ref<'approve' | 'reject'>('approve')

const columns = [
  { prop: 'flow_name', label: '流程名称' },
  { prop: 'model_code', label: '业务模型' },
  { prop: 'business_key', label: '业务主键' },
  { prop: 'node_name', label: '当前节点' },
  { prop: 'create_time', label: '创建时间' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

onMounted(() => loadData())

async function loadData() {
  tasks.value = await flowApi.getPendingTasks()
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
  if (currentAction.value === 'approve') {
    await flowApi.approveTask(currentTask.value.id, commentForm.comment)
  } else {
    await flowApi.rejectTask(currentTask.value.id, commentForm.comment)
  }
  closeDialog()
  await loadData()
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>
