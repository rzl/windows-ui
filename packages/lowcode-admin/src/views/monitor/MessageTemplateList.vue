<template>
  <div class="list-page">
    <w-card header="消息模板">
      <div class="toolbar">
        <w-button type="primary" @click="openDialog()">+ 新增模板</w-button>
      </div>
      <w-table :data="list" :columns="columns" stripe border>
        <template #channel="{ row }">
          <w-tag>{{ channelLabel(row.channel) }}</w-tag>
        </template>
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" @click="openDialog(row)">编辑</w-button>
            <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>
    </w-card>

    <w-dialog v-model="dialogVisible" title="消息模板" width="480">
      <w-form :model="formModel">
        <w-form-item label="模板编码">
          <w-input v-model="formModel.code" :disabled="!!formModel.id" />
        </w-form-item>
        <w-form-item label="模板名称">
          <w-input v-model="formModel.name" />
        </w-form-item>
        <w-form-item label="标题">
          <w-input v-model="formModel.title" />
        </w-form-item>
        <w-form-item label="内容">
          <w-input v-model="formModel.content" type="textarea" />
        </w-form-item>
        <w-form-item label="渠道">
          <w-select v-model="formModel.channel" :options="channelOptions" />
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
import { onMounted, reactive, ref } from 'vue'
import * as monitorApi from '@/api/monitor'

const list = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'code', label: '模板编码' },
  { prop: 'name', label: '模板名称' },
  { prop: 'title', label: '标题' },
  { prop: 'channel', label: '渠道' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

const channelOptions = [
  { label: '站内信', value: 'site' },
  { label: '短信', value: 'sms' },
  { label: '邮件', value: 'email' },
  { label: '微信', value: 'wechat' }
]

onMounted(() => loadData())

async function loadData() {
  list.value = await monitorApi.getMessageTemplates()
}

function channelLabel(channel: string) {
  return channelOptions.find((o) => o.value === channel)?.label || channel
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
  } else {
    formModel.status = true
    formModel.channel = 'site'
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
    await monitorApi.updateMessageTemplate(data.id, data)
  } else {
    await monitorApi.createMessageTemplate(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除模板 ${row.name} 吗？`)) {
    await monitorApi.deleteMessageTemplate(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
