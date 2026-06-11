<template>
  <div class="dashboard-page">
    <div class="stat-row">
      <w-card v-for="s in stats" :key="s.label" :header="s.label" class="stat-card">
        <div class="stat-value" :style="{ color: s.color }">{{ s.value }}</div>
      </w-card>
    </div>

    <w-divider />

    <div class="section-row">
      <w-card header="快捷入口" class="shortcut-card">
        <w-space wrap>
          <w-button v-for="link in shortcuts" :key="link.path" type="primary" @click="$router.push(link.path)">
            {{ link.label }}
          </w-button>
        </w-space>
      </w-card>
    </div>

    <w-divider />

    <w-card header="最近动态" class="timeline-card">
      <w-timeline :items="activities" />
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { mockUsers, mockArticles, mockOrders } from '@/mock/data'

const auth = useAuthStore()

const stats = computed(() => [
  { label: '用户总数', value: mockUsers.length, color: '#245edb' },
  { label: '文章总数', value: mockArticles.length, color: '#3a9e3a' },
  { label: '订单总数', value: mockOrders.length, color: '#e4a010' },
  { label: '在线用户', value: 12, color: '#d92b2b' }
])

const shortcuts = computed(() => {
  const links: any[] = []
  if (auth.hasPermission('user:list')) links.push({ label: '用户管理', path: '/user' })
  if (auth.hasPermission('article:list')) links.push({ label: '文章管理', path: '/article' })
  if (auth.hasPermission('order:list')) links.push({ label: '订单管理', path: '/order' })
  links.push({ label: '富文本编辑器', path: '/editor' })
  return links
})

const activities = [
  { time: '2026-06-08 14:00', title: '系统初始化完成', content: '' },
  { time: '2026-06-08 13:30', title: '新增用户 admin', content: '' },
  { time: '2026-06-08 12:00', title: '发布文章《Windows UI 入门指南》', content: '' },
  { time: '2026-06-08 11:20', title: '订单 ORD100001 已支付', content: '' },
  { time: '2026-06-08 10:00', title: '系统更新到 v1.0.0', content: '' }
]
</script>

<style scoped>
.dashboard-page { padding: 8px; }
.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.stat-value {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  padding: 12px 0;
}
.shortcut-card, .timeline-card {
  margin-top: 0;
}
</style>
