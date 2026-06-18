<template>
  <div class="app-runner-page">
    <w-card :header="app.name || app.code || '应用运行'">
      <div class="app-meta">
        <div v-if="app.description" class="app-desc">{{ app.description }}</div>
        <div class="app-category">分类：{{ app.category || '未分类' }}</div>
      </div>

      <div v-if="auth.hasPermission('lowcode:app')" class="toolbar">
        <w-button size="small" @click="toggleMode">
          {{ isPortal ? '切换列表' : '切换工作台' }}
        </w-button>
      </div>

      <!-- 工作台模式 -->
      <template v-if="isPortal">
        <div class="widget-grid">
          <template v-for="(widget, _index) in portalWidgets" :key="_index">
            <w-card
              :header="widget.title"
              class="widget-card"
              :class="widget.type === 'dashboard' || widget.type === 'notice' || widget.type === 'app-resources' ? 'widget-wide' : ''"
            >
              <stat-widget v-if="widget.type === 'stat'" :widget="widget" :stats="stats" />
              <link-widget v-else-if="widget.type === 'link'" :widget="widget" />
              <dashboard-widget v-else-if="widget.type === 'dashboard'" :widget="widget" />
              <notice-widget v-else-if="widget.type === 'notice'" :widget="widget" />
              <pending-task-widget v-else-if="widget.type === 'pending-task'" :widget="widget" :flow-codes="flowCodes" />
              <app-resource-widget v-else-if="widget.type === 'app-resources'" :widget="widget" :items="items" />
            </w-card>
          </template>
        </div>
      </template>

      <!-- 列表模式 -->
      <template v-else>
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
      </template>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import * as appApi from '@/api/app'
import * as dashboardApi from '@/api/dashboard'
import StatWidget from '@/components/portal/StatWidget.vue'
import LinkWidget from '@/components/portal/LinkWidget.vue'
import DashboardWidget from '@/components/portal/DashboardWidget.vue'
import NoticeWidget from '@/components/portal/NoticeWidget.vue'
import PendingTaskWidget from '@/components/portal/PendingTaskWidget.vue'
import AppResourceWidget from '@/components/portal/AppResourceWidget.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const code = route.params.code as string

const app = ref<any>({})
const items = ref<any[]>([])
const stats = reactive<any>({})
const previewMode = ref<'list' | 'portal' | null>(null)

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

const portalConfig = computed(() => app.value.portalConfig || null)
const isPortal = computed(() => {
  if (previewMode.value) return previewMode.value === 'portal'
  return portalConfig.value?.mode === 'portal'
})
const portalWidgets = computed(() => portalConfig.value?.widgets || [])
const flowCodes = computed(() => {
  return (items.value || [])
    .filter((item) => item.type === 'flow')
    .map((item) => item.ref_code)
})

async function loadData() {
  const data = await appApi.getApp(code)
  app.value = data
  items.value = (data.items || []).sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0))

  if (isPortal.value && portalWidgets.value.length) {
    await loadStats()
  }
}

async function loadStats() {
  try {
    const statWidgets = portalWidgets.value.filter((w: any) => w.type === 'stat')
    if (statWidgets.length) {
      const statsData = await dashboardApi.getStats(statWidgets)
      Object.assign(stats, statsData)
    }
  } catch {
    // ignore
  }
}

function toggleMode() {
  previewMode.value = isPortal.value ? 'list' : 'portal'
  if (previewMode.value === 'portal') {
    loadStats()
  }
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
    case 'page':
      router.push(`/lowcode/page-run/${item.ref_code}`)
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
.toolbar { margin-bottom: 12px; }
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

.widget-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
.widget-card { min-height: 120px; }
.widget-wide { grid-column: span 2; }
</style>
