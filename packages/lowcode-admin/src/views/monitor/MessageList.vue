<template>
  <div class="list-page">
    <div class="toolbar">
      <w-button type="primary" @click="openSendDialog()">+ 发送消息</w-button>
    </div>
    <div class="filter-bar">
      <w-select v-model="query.type" :options="typeOptions" placeholder="消息类型" clearable style="width: 120px" @change="handleFilterChange" />
      <w-select v-model="query.businessType" :options="businessTypeOptions" placeholder="业务类型" clearable style="width: 120px" @change="handleFilterChange" />
      <w-button size="small" @click="loadData">刷新</w-button>
    </div>
    <w-crud-table
      :data="list"
      :columns="columns"
      :query="query"
      :total="total"
      :current-page="query.page"
      :page-size="query.pageSize"
      :searchable="false"
      @page-change="handlePageChange"
    >
      <template #toolbar>
        <w-button size="small" @click="loadUnreadCount">刷新未读</w-button>
      </template>
      <template #title="{ row }">
        <w-link type="primary" @click="handleTitleClick(row)">{{ row.title }}</w-link>
      </template>
      <template #type="{ row }">
        <w-tag :type="row.type === 'todo' ? 'warning' : row.type === 'notice' ? 'success' : 'info'">{{ formatType(row.type) }}</w-tag>
      </template>
      <template #business_type="{ row }">
        {{ formatBusinessType(row.business_type) }}
      </template>
      <template #is_read="{ row }">
        <w-tag :type="row.is_read === 1 ? 'info' : 'success'">{{ row.is_read === 1 ? '已读' : '未读' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button v-if="row.is_read === 0" size="small" @click="handleRead(row)">标为已读</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-crud-table>

    <w-dialog v-model="sendDialogVisible" title="发送消息" width="480">
      <w-form :model="sendForm">
        <w-form-item label="接收人 ID">
          <w-input-number v-model="sendForm.receiverId" />
        </w-form-item>
        <w-form-item label="标题">
          <w-input v-model="sendForm.title" />
        </w-form-item>
        <w-form-item label="内容">
          <w-input v-model="sendForm.content" type="textarea" />
        </w-form-item>
        <w-form-item label="渠道">
          <w-select v-model="sendForm.channel" :options="channelOptions" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="closeSendDialog">取消</w-button>
        <w-button type="primary" @click="handleSend">发送</w-button>
      </template>
    </w-dialog>

    <w-dialog v-model="detailVisible" title="消息详情" width="420">
      <p><strong>标题：</strong>{{ currentMessage.title }}</p>
      <p><strong>内容：</strong>{{ currentMessage.content }}</p>
      <p><strong>时间：</strong>{{ currentMessage.create_time }}</p>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import * as monitorApi from '@/api/monitor'

const auth = useAuthStore()
const list = ref<any[]>([])
const total = ref(0)
const query = reactive<any>({ page: 1, pageSize: 10, type: '', businessType: '' })
const sendDialogVisible = ref(false)
const sendForm = reactive<any>({})
const detailVisible = ref(false)
const currentMessage = reactive<any>({})

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'title', label: '标题' },
  { prop: 'type', label: '类型', width: 90 },
  { prop: 'business_type', label: '业务类型', width: 100 },
  { prop: 'content', label: '内容', showOverflowTooltip: true },
  { prop: 'channel', label: '渠道' },
  { prop: 'is_read', label: '状态', width: 90 },
  { prop: 'create_time', label: '发送时间' },
  { prop: 'action', label: '操作', width: 160, fixed: 'right' }
]

const channelOptions = [
  { label: '站内信', value: 'site' },
  { label: '短信', value: 'sms' },
  { label: '邮件', value: 'email' },
  { label: '微信', value: 'wechat' }
]

const typeOptions = [
  { label: '待办', value: 'todo' },
  { label: '通知', value: 'notice' },
  { label: '系统', value: 'system' }
]

const businessTypeOptions = [
  { label: '流程', value: 'flow' },
  { label: '低代码', value: 'lowcode' },
  { label: '系统', value: 'system' }
]

function formatType(type?: string) {
  const map: Record<string, string> = { todo: '待办', notice: '通知', system: '系统' }
  return map[type || ''] || type || '-'
}

function formatBusinessType(type?: string) {
  const map: Record<string, string> = { flow: '流程', lowcode: '低代码', system: '系统' }
  return map[type || ''] || type || '-'
}

onMounted(() => {
  loadData()
  loadUnreadCount()
})

async function loadData() {
  const params: any = { page: query.page, pageSize: query.pageSize }
  if (query.type) params.type = query.type
  if (query.businessType) params.businessType = query.businessType
  const result = await monitorApi.getMessages(params)
  list.value = result.list
  total.value = result.total
}

function handleFilterChange() {
  query.page = 1
  loadData()
}

async function handleTitleClick(row: any) {
  if (row.is_read === 0) {
    await monitorApi.markMessageRead(row.id)
  }
  if (row.link) {
    // 在列表页通过 link 跳转
    window.location.hash = row.link.startsWith('/') ? row.link : `/${row.link}`
  } else {
    Object.assign(currentMessage, row)
    detailVisible.value = true
  }
  await loadData()
}

async function loadUnreadCount() {
  if (!auth.userInfo?.id) return
  const count = await monitorApi.getUnreadCount(auth.userInfo.id)
  console.log('未读消息数：', count)
}

function openSendDialog() {
  Object.keys(sendForm).forEach((k) => delete sendForm[k])
  sendForm.receiverId = 1
  sendForm.channel = 'site'
  sendDialogVisible.value = true
}

function closeSendDialog() {
  sendDialogVisible.value = false
}

async function handleSend() {
  const data = JSON.parse(JSON.stringify(sendForm))
  data.senderId = auth.userInfo?.id
  await monitorApi.sendMessage(data)
  closeSendDialog()
  await loadData()
}

async function handleRead(row: any) {
  await monitorApi.markMessageRead(row.id)
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm('确定删除该消息吗？')) {
    await monitorApi.deleteMessage(row.id)
    await loadData()
  }
}

async function handlePageChange(page: number) {
  query.page = page
  await loadData()
}

</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.filter-bar { margin-bottom: 12px; display: flex; gap: 8px; align-items: center; }
</style>
