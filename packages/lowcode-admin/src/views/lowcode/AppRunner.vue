<template>
  <div class="app-runner-page">
    <w-card :header="app.name || app.code || '应用运行'">
      <div class="app-meta">
        <div v-if="app.description" class="app-desc">{{ app.description }}</div>
        <div class="app-category">分类：{{ app.category || '未分类' }}</div>
      </div>

      <div v-if="!items.length" class="empty-tip">
        <w-empty description="该应用下暂无资源" />
      </div>
      <div v-else class="resource-grid">
        <div
          v-for="item in items"
          :key="`${item.type}_${item.ref_code}`"
          class="resource-card"
          @click="enterResource(item)"
        >
          <div class="resource-icon">
            <w-icon :name="resourceIcon(item.type)" />
          </div>
          <div class="resource-info">
            <div class="resource-name">{{ item.ref_name || item.ref_code }}</div>
            <div class="resource-type">{{ resourceLabel(item.type) }}</div>
          </div>
        </div>
      </div>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as appApi from '@/api/app'

const route = useRoute()
const router = useRouter()
const code = route.params.code as string

const app = ref<any>({})
const items = ref<any[]>([])

const typeMap: Record<string, string> = {
  model: '数据模型',
  report: '报表',
  dashboard: '仪表盘',
  flow: '流程',
  print: '打印模板',
  datasource: '外部数据源',
  page: '页面'
}

const iconMap: Record<string, string> = {
  model: 'table',
  report: 'chart',
  dashboard: 'dashboard',
  flow: 'flow',
  print: 'printer',
  datasource: 'data',
  page: 'page'
}

onMounted(() => loadData())

async function loadData() {
  const data = await appApi.getApp(code)
  app.value = data
  items.value = (data.items || []).sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0))
}

function resourceLabel(type: string) {
  return typeMap[type] || type
}

function resourceIcon(type: string) {
  return iconMap[type] || 'app'
}

function enterResource(item: any) {
  switch (item.type) {
    case 'model':
      router.push(`/lowcode/run/${item.ref_code}`)
      break
    case 'report':
      router.push(`/report/run/${item.ref_code}`)
      break
    case 'dashboard':
      router.push(`/dashboard/run/${item.ref_code}`)
      break
    case 'flow':
      router.push('/flow/pending')
      break
    case 'print':
      router.push(`/print/preview/${item.ref_code}`)
      break
    default:
      break
  }
}
</script>

<style scoped>
.app-runner-page { padding: 8px; }
.app-meta {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f8f8;
  border: 1px solid #d4d0c8;
  border-radius: 4px;
}
.app-desc { margin-bottom: 8px; }
.app-category { color: #666; font-size: 12px; }
.empty-tip { padding: 40px 0; }
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.resource-card {
  background: #fff;
  border: 1px solid #d4d0c8;
  border-radius: 4px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
.resource-card:hover { background: #f0f0f0; }
.resource-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 20px;
}
.resource-info { flex: 1; min-width: 0; }
.resource-name { font-weight: bold; margin-bottom: 4px; }
.resource-type { color: #666; font-size: 12px; }
</style>
