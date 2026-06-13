<template>
  <div class="designer-page">
    <w-card :header="`仪表盘设计 - ${dashboard.name || dashboard.code || ''}`">
      <div class="toolbar">
        <w-button type="primary" @click="handleSave">保存配置</w-button>
        <w-button @click="handlePreview">刷新预览</w-button>
      </div>

      <w-form :model="dashboard">
        <w-form-item label="仪表盘编码">
          <w-input v-model="dashboard.code" disabled />
        </w-form-item>
        <w-form-item label="仪表盘名称">
          <w-input v-model="dashboard.name" />
        </w-form-item>
      </w-form>

      <div class="editor-layout">
        <div class="config-panel">
          <h4>ECharts 配置（JSON）</h4>
          <w-input v-model="optionText" type="textarea" :rows="20" placeholder='{"title":{"text":"示例"},"xAxis":{},"yAxis":{},"series":[{"type":"bar","data":[5,20,36]}]}' />
          <p class="tip">提示：配置需符合 ECharts option 规范，支持从 ECharts 示例复制。</p>
        </div>
        <div class="preview-panel">
          <h4>预览</h4>
          <iframe ref="previewFrame" class="preview-frame" sandbox="allow-scripts allow-same-origin"></iframe>
        </div>
      </div>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as dashboardApi from '@/api/dashboard'

const route = useRoute()
const code = route.params.code as string
const dashboard = reactive<any>({ code, name: '' })
const optionText = ref('')
const previewFrame = ref<HTMLIFrameElement>()

const defaultOption = {
  title: { text: '示例图表' },
  tooltip: {},
  xAxis: { data: ['一月', '二月', '三月', '四月', '五月'] },
  yAxis: {},
  series: [{ type: 'bar', data: [5, 20, 36, 10, 15] }]
}

onMounted(() => loadData())

watch(optionText, () => {
  updatePreview()
})

async function loadData() {
  const data = await dashboardApi.getDashboard(code)
  Object.assign(dashboard, data)
  const config = data.config || {}
  const option = config.option || defaultOption
  optionText.value = JSON.stringify(option, null, 2)
}

function getOption() {
  try {
    return JSON.parse(optionText.value)
  } catch {
    return null
  }
}

function updatePreview() {
  const option = getOption()
  if (!option || !previewFrame.value) return

  const html = generatePreviewHtml(option)
  const blob = new Blob([html], { type: 'text/html' })
  previewFrame.value.src = URL.createObjectURL(blob)
}

function generatePreviewHtml(option: any) {
  return `<!DOCTYPE html>
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
}

function handlePreview() {
  updatePreview()
}

async function handleSave() {
  const option = getOption()
  if (!option) {
    alert('ECharts 配置 JSON 格式错误')
    return
  }
  await dashboardApi.updateDashboard(dashboard.id, {
    name: dashboard.name,
    config: { option },
    status: dashboard.status
  })
  alert('保存成功')
}
</script>

<style scoped>
.designer-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.editor-layout { display: flex; gap: 16px; margin-top: 16px; }
.config-panel { flex: 1; min-width: 0; }
.preview-panel { flex: 1; min-width: 0; }
.preview-frame { width: 100%; height: 340px; border: 1px solid #d4d0c8; background: #fff; }
.tip { font-size: 12px; color: #666; margin-top: 8px; }
h4 { margin: 0 0 8px; }
</style>
