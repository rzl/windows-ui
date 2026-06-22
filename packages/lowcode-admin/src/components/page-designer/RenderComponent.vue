<template>
  <div class="render-component" :style="node.styles">
    <!-- 文本 -->
    <component
      :is="node.props.tag || 'p'"
      v-if="node.type === 'text'"
      :style="{ textAlign: node.props.align || 'left' }"
    >
      {{ node.props.content }}
    </component>

    <!-- 统计卡片 -->
    <div v-else-if="node.type === 'stat'" class="stat-card" :class="`is-${node.props.color || 'primary'}`">
      <w-icon :name="node.props.icon || 'star'" :size="40" />
      <div class="stat-info">
        <div class="stat-title">{{ node.props.title }}</div>
        <div class="stat-value">{{ displayValue }}</div>
      </div>
    </div>

    <!-- 图表 -->
    <div v-else-if="node.type === 'chart'" class="chart-wrapper">
      <iframe v-if="chartUrl" class="chart-frame" :src="chartUrl" sandbox="allow-scripts allow-same-origin" />
    </div>

    <!-- 公告 -->
    <w-alert
      v-else-if="node.type === 'notice'"
      :type="node.props.type || 'info'"
      :title="node.props.content"
      :closable="false"
    />

    <!-- 按钮 -->
    <w-button
      v-else-if="node.type === 'button'"
      :type="node.props.type || 'default'"
      @click="handleButtonClick"
    >
      {{ node.props.label }}
    </w-button>

    <!-- 链接 -->
    <a v-else-if="node.type === 'link'" href="javascript:void(0)" @click="handleLinkClick">{{ node.props.label }}</a>

    <!-- 容器 -->
    <div
      v-else-if="node.type === 'container'"
      class="render-container"
      :style="{ padding: node.props.padding || '12px' }"
    >
      <render-component
        v-for="(child, idx) in node.children"
        :key="child.id || idx"
        :node="child"
        :page-code="pageCode"
      />
    </div>

    <!-- 卡片 -->
    <w-card
      v-else-if="node.type === 'card'"
      :header="node.props.title"
    >
      <render-component
        v-for="(child, idx) in node.children"
        :key="child.id || idx"
        :node="child"
        :page-code="pageCode"
      />
    </w-card>

    <!-- 栅格 -->
    <div
      v-else-if="node.type === 'grid'"
      class="render-grid"
      :style="gridStyle"
    >
      <div v-for="(child, idx) in node.children" :key="child.id || idx" class="grid-item">
        <render-component :node="child" :page-code="pageCode" />
      </div>
    </div>

    <!-- 标签页 -->
    <div v-else-if="node.type === 'tabs'" class="render-tabs">
      <div class="tabs-nav">
        <div
          v-for="tab in node.props.tabs"
          :key="tab.name"
          class="tabs-nav-item"
          :class="{ active: activeTab === tab.name }"
          @click="activeTab = tab.name"
        >
          {{ tab.title }}
        </div>
      </div>
      <div class="tabs-content">
        <render-component
          v-for="(child, idx) in activeTabChildren"
          :key="child.id || idx"
          :node="child"
          :page-code="pageCode"
        />
      </div>
    </div>

    <!-- 嵌入模型 -->
    <iframe
      v-else-if="node.type === 'model'"
      v-if="modelUrl"
      class="embed-frame"
      :src="modelUrl"
      sandbox="allow-scripts allow-same-origin"
      :style="{ height: node.props.height || '500px' }"
    />

    <!-- 嵌入仪表盘 -->
    <iframe
      v-else-if="node.type === 'dashboard'"
      v-if="dashboardUrl"
      class="embed-frame"
      :src="dashboardUrl"
      sandbox="allow-scripts allow-same-origin"
    />

    <!-- 嵌入报表 -->
    <iframe
      v-else-if="node.type === 'report'"
      v-if="reportUrl"
      class="embed-frame"
      :src="reportUrl"
      sandbox="allow-scripts allow-same-origin"
    />

    <component
      v-else-if="pluginComponent"
      :is="pluginComponent.render"
      :node="node"
      :page-code="pageCode"
      :data-value="dataValue"
    />

    <div v-else class="unknown-component">未知组件: {{ node.type }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as pageApi from '@/api/page'
import { getChart, getComponent } from '@/utils/pluginManager'

const props = defineProps<{
  node: any
  pageCode?: string
}>()

const router = useRouter()
const activeTab = ref('')
const dataValue = ref<any>(null)
const chartUrl = ref('')
const modelUrl = ref('')
const dashboardUrl = ref('')
const reportUrl = ref('')
const pluginComponent = computed(() => getComponent(props.node.type))

const displayValue = computed(() => {
  if (dataValue.value !== null && dataValue.value !== undefined) {
    return dataValue.value
  }
  return props.node.dataSource?.value ?? 0
})

const gridStyle = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.node.props.columns || 2}, 1fr)`,
    gap: props.node.props.gap || '12px'
  }
})

const activeTabChildren = computed(() => {
  const tabName = activeTab.value
  if (!tabName || !props.node.children) return []
  return props.node.children.filter((child: any) => !child.tab || child.tab === tabName)
})

onMounted(() => {
  if (props.node.type === 'tabs' && props.node.props.tabs?.length) {
    activeTab.value = props.node.props.tabs[0].name
  }
  loadDataSource()
  loadEmbedUrls()
})

onUnmounted(() => {
  revokeUrls()
})

watch(() => props.node.dataSource, () => {
  loadDataSource()
}, { deep: true })

async function loadDataSource() {
  const ds = props.node.dataSource
  if (!ds || !ds.type || ds.type === 'static') {
    dataValue.value = ds?.value ?? null
    if (props.node.type === 'chart') {
      generateChartUrl(props.node.option || {})
    }
    return
  }

  try {
    const code = props.pageCode || 'preview'
    const result = await pageApi.executePageDataSource(code, ds, {})
    dataValue.value = result
    if (props.node.type === 'chart') {
      generateChartUrl(result || props.node.option || {})
    }
  } catch {
    dataValue.value = null
  }
}

function generateChartUrl(option: any) {
  if (chartUrl.value) URL.revokeObjectURL(chartUrl.value)
  const chartType = props.node.props.chartType || 'echarts'
  const plugin = getChart(chartType)
  const html = plugin
    ? plugin.render(option, props.node.props, dataValue.value)
    : `<!DOCTYPE html><html><body>未知图表类型: ${chartType}</body></html>`
  const blob = new Blob([html], { type: 'text/html' })
  chartUrl.value = URL.createObjectURL(blob)
}

function loadEmbedUrls() {
  const base = window.location.origin + window.location.pathname
  if (props.node.type === 'model' && props.node.props.modelCode) {
    modelUrl.value = `${base}#/lowcode/run/${props.node.props.modelCode}`
  }
  if (props.node.type === 'dashboard' && props.node.props.dashboardCode) {
    dashboardUrl.value = `${base}#/dashboard/run/${props.node.props.dashboardCode}`
  }
  if (props.node.type === 'report' && props.node.props.reportCode) {
    reportUrl.value = `${base}#/report/run/${props.node.props.reportCode}`
  }
}

function revokeUrls() {
  if (chartUrl.value) URL.revokeObjectURL(chartUrl.value)
}

function handleButtonClick() {
  const event = props.node.events?.onClick
  if (!event) return
  if (event.action === 'navigate' && event.target) {
    router.push(event.target)
  } else if (event.action === 'refresh') {
    loadDataSource()
  }
}

function handleLinkClick() {
  if (props.node.props.path) {
    router.push(props.node.props.path)
  }
}
</script>

<style scoped>
.render-component { margin-bottom: 12px; }
.stat-card { display: flex; align-items: center; gap: 12px; padding: 16px; background: #f8f8f8; border: 1px solid #ddd; border-radius: 4px; }
.stat-card.is-primary { color: var(--w-color-primary); }
.stat-card.is-success { color: var(--w-color-success); }
.stat-card.is-warning { color: var(--w-color-warning); }
.stat-card.is-danger { color: var(--w-color-danger); }
.stat-title { color: #666; font-size: 12px; }
.stat-value { font-size: 28px; font-weight: bold; }
.chart-wrapper { width: 100%; }
.chart-frame { width: 100%; border: none; height: v-bind('node.props.height || "300px"'); }
.render-container { border: 1px solid #eee; }
.render-grid { width: 100%; }
.grid-item { min-width: 0; }
.render-tabs { border: 1px solid #ddd; }
.tabs-nav { display: flex; gap: 8px; border-bottom: 1px solid #ddd; background: #f8f8f8; }
.tabs-nav-item { padding: 8px 16px; cursor: pointer; }
.tabs-nav-item.active { background: #fff; border: 1px solid #ddd; border-bottom: none; }
.tabs-content { padding: 12px; }
.embed-frame { width: 100%; border: none; min-height: 300px; }
.unknown-component { padding: 12px; background: #fff0f0; color: #c00; }
</style>
