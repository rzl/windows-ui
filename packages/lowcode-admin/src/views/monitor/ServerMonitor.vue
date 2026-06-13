<template>
  <div class="monitor-page">
    <w-card header="服务器信息">
      <w-descriptions :column="2" border>
        <w-descriptions-item label="操作系统">{{ server.platform }}</w-descriptions-item>
        <w-descriptions-item label="架构">{{ server.arch }}</w-descriptions-item>
        <w-descriptions-item label="主机名">{{ server.hostname }}</w-descriptions-item>
        <w-descriptions-item label="Node 版本">{{ server.nodeVersion }}</w-descriptions-item>
        <w-descriptions-item label="运行时长">{{ formatUptime(server.uptime) }}</w-descriptions-item>
        <w-descriptions-item label="CPU 核心数">{{ server.cpus }}</w-descriptions-item>
        <w-descriptions-item label="总内存">{{ formatBytes(server.totalMemory) }}</w-descriptions-item>
        <w-descriptions-item label="空闲内存">{{ formatBytes(server.freeMemory) }}</w-descriptions-item>
        <w-descriptions-item label="负载">{{ server.loadavg?.join(', ') }}</w-descriptions-item>
      </w-descriptions>
    </w-card>

    <w-card header="在线用户" style="margin-top: 16px;">
      <w-table :data="onlineUsers" :columns="userColumns" stripe border />
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as monitorApi from '@/api/monitor'

const server = ref<any>({})
const onlineUsers = ref<any[]>([])

const userColumns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'username', label: '用户名' },
  { prop: 'nickname', label: '昵称' },
  { prop: 'ip', label: 'IP' },
  { prop: 'loginTime', label: '登录时间' }
]

onMounted(() => loadData())

async function loadData() {
  server.value = await monitorApi.getServerInfo()
  onlineUsers.value = await monitorApi.getOnlineUsers()
}

function formatUptime(seconds: number) {
  if (!seconds) return '-'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h}小时 ${m}分 ${s}秒`
}

function formatBytes(bytes: number) {
  if (!bytes) return '-'
  const gb = bytes / 1024 / 1024 / 1024
  return `${gb.toFixed(2)} GB`
}
</script>

<style scoped>
.monitor-page { padding: 8px; }
</style>
