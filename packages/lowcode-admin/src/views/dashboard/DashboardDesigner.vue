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
          <h4>数据源配置</h4>
          <w-form-item label="数据源类型">
            <w-select v-model="dataSource.type" :options="dataSourceTypeOptions" />
          </w-form-item>

          <template v-if="dataSource.type === 'sql'">
            <w-form-item label="SQL 查询">
              <w-input v-model="dataSource.sql" type="textarea" :rows="4" placeholder='SELECT status, COUNT(*) as value FROM users GROUP BY status' />
              <p class="tip">只允许 SELECT 查询，禁止写入/修改/删除操作。</p>
            </w-form-item>
          </template>

          <template v-if="dataSource.type === 'api'">
            <w-form-item label="请求方法">
              <w-select v-model="dataSource.api.method" :options="httpMethodOptions" />
            </w-form-item>
            <w-form-item label="请求地址">
              <w-input v-model="dataSource.api.url" placeholder='/api/lowcode/customer' />
            </w-form-item>
            <w-form-item label="查询参数（JSON）">
              <w-input v-model="dataSource.api.paramsText" type="textarea" :rows="2" placeholder='{"pageSize": 100}' />
            </w-form-item>
            <w-form-item label="请求体（JSON）">
              <w-input v-model="dataSource.api.bodyText" type="textarea" :rows="2" placeholder='{}' />
            </w-form-item>
          </template>

          <template v-if="dataSource.type === 'script'">
            <w-form-item label="脚本">
              <w-input v-model="dataSource.script" type="textarea" :rows="8" placeholder='const rows = await db.raw("SELECT status, COUNT(*) as value FROM users GROUP BY status");&#10;return { title: { text: "用户状态" }, xAxis: { data: rows.map(r => r.status) }, series: [{ type: "bar", data: rows.map(r => r.value) }] };' />
              <p class="tip">在线编写 JavaScript，可调用 db.raw() 和 http()，需返回完整 ECharts option。</p>
            </w-form-item>
          </template>

          <template v-if="['sql', 'api'].includes(dataSource.type)">
            <w-form-item label="数据转换脚本">
              <w-input v-model="dataSource.transformScript" type="textarea" :rows="8" placeholder='return { title: { text: "示例" }, xAxis: { data: data.map(r => r.status) }, series: [{ type: "bar", data: data.map(r => r.value) }] };' />
              <p class="tip">接收 data 参数，返回完整 ECharts option。</p>
            </w-form-item>
          </template>

          <template v-if="dataSource.type === 'static'">
            <h4>ECharts 配置（JSON）</h4>
            <w-input v-model="optionText" type="textarea" :rows="12" placeholder='{"title":{"text":"示例"},"xAxis":{},"yAxis":{},"series":[{"type":"bar","data":[5,20,36]}]}' />
          </template>
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
const dataSource = reactive<any>({
  type: 'static',
  sql: '',
  script: '',
  transformScript: '',
  api: {
    method: 'GET',
    url: '',
    paramsText: '{}',
    bodyText: '{}'
  }
})

const dataSourceTypeOptions = [
  { label: '静态配置', value: 'static' },
  { label: 'SQL 查询', value: 'sql' },
  { label: '在线脚本', value: 'script' },
  { label: '内部 API', value: 'api' }
]

const httpMethodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' }
]

const defaultOption = {
  title: { text: '示例图表' },
  tooltip: {},
  xAxis: { data: ['一月', '二月', '三月', '四月', '五月'] },
  yAxis: {},
  series: [{ type: 'bar', data: [5, 20, 36, 10, 15] }]
}

onMounted(() => loadData())

watch([optionText, () => dataSource.type, () => dataSource.sql, () => dataSource.script, () => dataSource.api.url, () => dataSource.transformScript], () => {
  updatePreview()
}, { deep: true })

async function loadData() {
  const data = await dashboardApi.getDashboard(code)
  Object.assign(dashboard, data)
  const config = data.config || {}

  if (config.dataSource) {
    Object.assign(dataSource, config.dataSource)
    if (config.dataSource.api) {
      dataSource.api.paramsText = JSON.stringify(config.dataSource.api.params || {}, null, 2)
      dataSource.api.bodyText = JSON.stringify(config.dataSource.api.body || {}, null, 2)
    }
  }

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

async function updatePreview() {
  if (!previewFrame.value) return
  const option = await getPreviewOption()
  if (!option) return

  const html = generatePreviewHtml(option)
  const blob = new Blob([html], { type: 'text/html' })
  previewFrame.value.src = URL.createObjectURL(blob)
}

async function getPreviewOption() {
  if (dataSource.type === 'static') {
    return getOption()
  }

  try {
    const result = await dashboardApi.executeDataSource(buildDataSourceConfig())
    if (result && typeof result === 'object' && (result.series || result.title || result.xAxis || result.yAxis)) {
      return result
    }
    return null
  } catch (e: any) {
    alert('数据源执行失败：' + (e.message || '未知错误'))
    return null
  }
}

function buildDataSourceConfig() {
  const config: any = { type: dataSource.type }
  if (dataSource.type === 'sql') {
    config.sql = dataSource.sql
    config.transformScript = dataSource.transformScript
  } else if (dataSource.type === 'script') {
    config.script = dataSource.script
  } else if (dataSource.type === 'api') {
    config.api = {
      method: dataSource.api.method,
      url: dataSource.api.url
    }
    try {
      config.api.params = dataSource.api.paramsText ? JSON.parse(dataSource.api.paramsText) : {}
    } catch {
      config.api.params = {}
    }
    try {
      config.api.body = dataSource.api.bodyText ? JSON.parse(dataSource.api.bodyText) : {}
    } catch {
      config.api.body = {}
    }
    config.transformScript = dataSource.transformScript
  }
  return config
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
  const config: any = { dataSource: buildDataSourceConfig() }

  if (dataSource.type === 'static') {
    const option = getOption()
    if (!option) {
      alert('ECharts 配置 JSON 格式错误')
      return
    }
    config.option = option
  }

  await dashboardApi.updateDashboard(dashboard.id, {
    name: dashboard.name,
    config,
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
