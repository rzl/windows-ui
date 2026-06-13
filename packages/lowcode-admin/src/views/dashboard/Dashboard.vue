<template>
  <div class="dashboard-page">
    <div class="widget-grid">
      <template v-for="(widget, index) in config.widgets" :key="index">
        <!-- 统计卡片 -->
        <w-card v-if="widget.type === 'stat'" :header="widget.title" class="widget-card">
          <div class="stat-content" :class="`is-${widget.color}`">
            <w-icon :name="widget.icon || 'star'" :size="40" />
            <span class="stat-value">{{ stats[widget.field] || 0 }}</span>
          </div>
        </w-card>

        <!-- 快捷链接 -->
        <w-card v-else-if="widget.type === 'link'" :header="widget.title" class="widget-card">
          <div class="link-content">
            <w-button :type="widget.color || 'primary'" @click="router.push(widget.path)">
              <w-icon :name="widget.icon || 'arrow-right'" /> 进入
            </w-button>
          </div>
        </w-card>

        <!-- 仪表盘 -->
        <w-card v-else-if="widget.type === 'dashboard'" :header="widget.title" class="widget-card widget-wide">
          <iframe
            v-if="widget.dashboardUrl"
            class="dashboard-frame"
            :src="widget.dashboardUrl"
            sandbox="allow-scripts allow-same-origin"
          />
        </w-card>

        <!-- 公告 -->
        <w-card v-else-if="widget.type === 'notice'" :header="widget.title" class="widget-card widget-wide">
          <p class="notice-content">{{ widget.content || '暂无公告' }}</p>
        </w-card>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import * as dashboardApi from '@/api/dashboard'

const router = useRouter()
const config = reactive<any>({ widgets: [] })
const stats = reactive<any>({})

onMounted(() => loadData())

async function loadData() {
  const configData = await dashboardApi.getHomepageConfig('default')
  Object.assign(config, configData)

  const statsData = await dashboardApi.getStats(config.widgets || [])
  Object.assign(stats, statsData)

  // 为仪表盘组件生成 iframe blob URL
  for (const widget of config.widgets) {
    if (widget.type === 'dashboard' && widget.dashboardCode) {
      try {
        const dashboard = await dashboardApi.getDashboard(widget.dashboardCode)
        const option = await resolveDashboardOption(dashboard)
        widget.dashboardUrl = generateDashboardBlobUrl(option)
      } catch {
        widget.dashboardUrl = ''
      }
    }
  }
}

async function resolveDashboardOption(dashboard: any) {
  const config = dashboard.config || {}
  const dataSource = config.dataSource
  if (!dataSource || dataSource.type === 'static' || !dataSource.type) {
    return config.option || {}
  }
  return dashboardApi.executeDataSource(dataSource)
}

function generateDashboardBlobUrl(option: any) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>body{margin:0;padding:8px;}</style>
</head>
<body>
  <div id="chart" style="width:100%;height:300px;"></div>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"><\/script>
  <script>
    var chart = echarts.init(document.getElementById('chart'));
    chart.setOption(${JSON.stringify(option)});
    window.addEventListener('resize', function() { chart.resize(); });
  <\/script>
</body>
</html>`
  const blob = new Blob([html], { type: 'text/html' })
  return URL.createObjectURL(blob)
}
</script>

<style scoped>
.dashboard-page { padding: 8px; }
.widget-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
.widget-card { min-height: 120px; }
.widget-wide { grid-column: span 2; }
.stat-content { display: flex; align-items: center; gap: 12px; padding: 8px; }
.stat-value { font-size: 32px; font-weight: bold; }
.link-content { display: flex; justify-content: center; padding: 16px; }
.dashboard-frame { width: 100%; height: 300px; border: none; }
.notice-content { padding: 8px; color: #666; }

.is-primary { color: var(--w-color-primary); }
.is-success { color: var(--w-color-success); }
.is-warning { color: var(--w-color-warning); }
.is-danger { color: var(--w-color-danger); }
</style>
