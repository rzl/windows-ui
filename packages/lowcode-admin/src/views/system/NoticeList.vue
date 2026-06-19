<template>
  <div class="list-page">
    <div class="toolbar">
      <w-button type="primary" @click="openDialog()">+ 新增公告</w-button>
    </div>
    <w-table :data="notices" :columns="columns" stripe border>
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

    <w-dialog v-model="dialogVisible" title="系统公告" width="520">
      <w-form :model="formModel">
        <w-form-item label="标题">
          <w-input v-model="formModel.title" />
        </w-form-item>
        <w-form-item label="类型">
          <w-select v-model="formModel.type" :options="typeOptions" />
        </w-form-item>
        <w-form-item label="内容">
          <textarea v-model="formModel.content" class="w-xp-textarea" rows="5" />
        </w-form-item>
        <w-form-item label="排序">
          <w-input-number v-model="formModel.sort" />
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
import * as noticeApi from '@/api/notice'

const notices = ref<any[]>([])
const dialogVisible = ref(false)
const formModel = reactive<any>({})

const columns = [
  { prop: 'title', label: '标题' },
  { prop: 'type', label: '类型' },
  { prop: 'sort', label: '排序', width: 80 },
  { prop: 'status', label: '状态', width: 80 },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

const typeOptions = [
  { label: '通知', value: 'notice' },
  { label: '公告', value: 'announcement' }
]

onMounted(() => loadData())

async function loadData() {
  notices.value = await noticeApi.getNotices()
}

function openDialog(row?: any) {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  if (row) {
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    formModel.status = row.status === 1
  } else {
    formModel.status = true
    formModel.sort = 0
    formModel.type = 'notice'
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
    await noticeApi.updateNotice(data.id, data)
  } else {
    await noticeApi.createNotice(data)
  }
  closeDialog()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除公告 ${row.title} 吗？`)) {
    await noticeApi.deleteNotice(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
