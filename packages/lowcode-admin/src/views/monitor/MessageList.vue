<template>
  <div class="list-page">
    <w-card header="消息管理">
      <div class="toolbar">
        <w-button type="primary" @click="openSendDialog()">+ 发送消息</w-button>
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
    </w-card>

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
const query = reactive({ page: 1, pageSize: 10 })
const sendDialogVisible = ref(false)
const sendForm = reactive<any>({})
const detailVisible = ref(false)
const currentMessage = reactive<any>({})

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'title', label: '标题' },
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

onMounted(() => {
  loadData()
  loadUnreadCount()
})

async function loadData() {
  const result = await monitorApi.getMessages(query)
  list.value = result.list
  total.value = result.total
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
</style>
