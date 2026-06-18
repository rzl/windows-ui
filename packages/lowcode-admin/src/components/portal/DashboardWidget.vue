<template>
  <iframe
    v-if="dashboardUrl"
    class="dashboard-frame"
    :src="dashboardUrl"
    sandbox="allow-scripts allow-same-origin"
  />
  <div v-else class="empty-tip">
    <w-empty description="暂无仪表盘数据" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as dashboardApi from '@/api/dashboard'

const props = defineProps<{
  widget: any
}>()

const dashboardUrl = ref('')

onMounted(() => loadDashboard())
onUnmounted(() => {
  if (dashboardUrl.value) {
    URL.revokeObjectURL(dashboardUrl.value)
  }
})

async function loadDashboard() {
  const code = props.widget.dashboardCode
  if (!code) return

  try {
    const dashboard = await dashboardApi.getDashboard(code)
    const option = await resolveDashboardOption(dashboard)
    dashboardUrl.value = generateDashboardBlobUrl(option)
  } catch {
    dashboardUrl.value = ''
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
.dashboard-frame { width: 100%; height: 300px; border: none; }
.empty-tip { padding: 20px 0; }
</style>
