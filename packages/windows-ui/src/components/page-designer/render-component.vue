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
    <div v-else-if="node.type === 'statistic'" class="stat-card" :class="`is-${node.props.color || 'primary'}`">
      <component :is="iconTag" :name="node.props.icon || 'star'" :size="40" />
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
    <component
      :is="alertTag"
      v-else-if="node.type === 'alert'"
      :type="node.props.type || 'info'"
      :title="node.props.content"
      :closable="false"
    />

    <!-- 图片 -->
    <img
      v-else-if="node.type === 'image'"
      class="render-image"
      :src="node.props.src || ''"
      :alt="node.props.alt || ''"
      :style="imageStyle"
      @click="handleEvent(node.events?.onClick)"
    />

    <!-- 分隔线 -->
    <div
      v-else-if="node.type === 'divider'"
      class="render-divider"
      :style="dividerStyle"
    >
      <span v-if="node.props.text" class="divider-text">{{ node.props.text }}</span>
    </div>

    <!-- 表格 -->
    <div v-else-if="node.type === 'table'" class="render-table-wrapper">
      <component
        :is="tableTag"
        :data="tableData"
        :columns="tableColumns"
        :height="node.props.height"
        stripe
        border
      />
    </div>

    <!-- 列表 -->
    <div v-else-if="node.type === 'list'" class="render-list">
      <div
        v-for="(item, idx) in listData"
        :key="idx"
        class="render-list-item"
        @click="handleItemClick(item)"
      >
        <component :is="iconTag" v-if="item.icon || node.props.itemIcon" :name="item.icon || node.props.itemIcon" />
        <div class="render-list-content">
          <div class="render-list-title">{{ item[node.props.itemTitle || 'title'] }}</div>
          <div class="render-list-desc">{{ item[node.props.itemDesc || 'description'] }}</div>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <component
      :is="buttonTag"
      v-else-if="node.type === 'button'"
      :type="node.props.type || 'default'"
      @click="handleEvent(node.events?.onClick)"
    >
      {{ node.props.label }}
    </component>

    <!-- 链接 -->
    <a v-else-if="node.type === 'link'" href="javascript:void(0)" @click="handleLinkClick">{{ node.props.label }}</a>

    <!-- 输入框 -->
    <component
      :is="inputTag"
      v-else-if="node.type === 'input'"
      v-model="node.props.modelValue"
      :placeholder="node.props.placeholder"
      :type="node.props.type || 'text'"
    />

    <!-- 选择器 -->
    <component
      :is="selectTag"
      v-else-if="node.type === 'select'"
      v-model="node.props.modelValue"
      :options="node.props.options || []"
      :placeholder="node.props.placeholder"
    />

    <!-- 开关 -->
    <component
      :is="switchTag"
      v-else-if="node.type === 'switch'"
      v-model="node.props.modelValue"
    />

    <!-- 单选框 -->
    <component
      :is="radioTag"
      v-else-if="node.type === 'radio'"
      v-model="node.props.modelValue"
      :options="node.props.options || []"
    />

    <!-- 多选框 -->
    <component
      :is="checkboxTag"
      v-else-if="node.type === 'checkbox'"
      v-model="node.props.modelValue"
      :options="node.props.options || []"
    />

    <!-- 日期选择 -->
    <component
      :is="datePickerTag"
      v-else-if="node.type === 'date-picker'"
      v-model="node.props.modelValue"
      :placeholder="node.props.placeholder"
    />

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
    <component
      :is="cardTag"
      v-else-if="node.type === 'card'"
      :header="node.props.title"
    >
      <render-component
        v-for="(child, idx) in node.children"
        :key="child.id || idx"
        :node="child"
        :page-code="pageCode"
      />
    </component>

    <!-- 栅格 -->
    <div
      v-else-if="node.type === 'row'"
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
    <template v-else-if="node.type === 'model'">
      <iframe
        v-if="modelUrl"
        class="embed-frame"
        :src="modelUrl"
        sandbox="allow-scripts allow-same-origin"
        :style="{ height: node.props.height || '500px' }"
      />
    </template>

    <!-- 嵌入仪表盘 -->
    <template v-else-if="node.type === 'dashboard'">
      <iframe
        v-if="dashboardUrl"
        class="embed-frame"
        :src="dashboardUrl"
        sandbox="allow-scripts allow-same-origin"
      />
    </template>

    <!-- 嵌入报表 -->
    <template v-else-if="node.type === 'report'">
      <iframe
        v-if="reportUrl"
        class="embed-frame"
        :src="reportUrl"
        sandbox="allow-scripts allow-same-origin"
      />
    </template>

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
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { getChart, getComponent } from './plugin-manager'
import { usePrefix } from '../../utils/prefix'
import type { PageContext, PageNode } from './types'

defineOptions({ name: 'WPageRenderComponent' })

const props = defineProps<{
  node: PageNode
  pageCode?: string
}>()

const { withPrefix } = usePrefix()
const iconTag = withPrefix('icon')
const alertTag = withPrefix('alert')
const buttonTag = withPrefix('button')
const tableTag = withPrefix('table')
const cardTag = withPrefix('card')
const inputTag = withPrefix('input')
const selectTag = withPrefix('select')
const switchTag = withPrefix('switch')
const radioTag = withPrefix('radio')
const checkboxTag = withPrefix('checkbox')
const datePickerTag = withPrefix('date-picker')

const pageContext = inject<PageContext | null>('pageContext', null)
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
    gridTemplateColumns: `repeat(${props.node.props?.columns || 2}, 1fr)`,
    gap: props.node.props?.gap || '12px'
  }
})

const imageStyle = computed(() => {
  return {
    width: props.node.props?.width || '100%',
    height: props.node.props?.height || 'auto',
    objectFit: props.node.props?.objectFit || 'cover',
    cursor: props.node.events?.onClick ? 'pointer' : 'default'
  }
})

const dividerStyle = computed(() => {
  const isVertical = props.node.props?.direction === 'vertical'
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: props.node.props?.margin || '16px 0',
    width: isVertical ? '1px' : '100%',
    height: isVertical ? '100%' : '1px',
    backgroundColor: '#ddd'
  }
})

const tableColumns = computed(() => {
  return props.node.props?.columns || []
})

const tableData = computed(() => {
  if (Array.isArray(dataValue.value)) return dataValue.value
  return props.node.props?.data || []
})

const listData = computed(() => {
  if (Array.isArray(dataValue.value)) return dataValue.value
  return props.node.props?.items || []
})

const activeTabChildren = computed(() => {
  const tabName = activeTab.value
  if (!tabName || !props.node.children) return []
  return props.node.children.filter((child: PageNode) => !child.tab || child.tab === tabName)
})

onMounted(() => {
  if (props.node.type === 'tabs' && props.node.props?.tabs?.length) {
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

watch(() => pageContext?.refreshKey.value, () => {
  loadDataSource()
})

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
    const ctx = pageContext ? { state: pageContext.pageState } : {}
    const result = pageContext
      ? await pageContext.executeDataSource?.(code, ds, ctx)
      : undefined
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
  const chartType = props.node.props?.chartType || 'echarts'
  const plugin = getChart(chartType)
  const html = plugin
    ? plugin.render(option, props.node.props || {}, dataValue.value)
    : `<!DOCTYPE html><html><body>未知图表类型: ${chartType}</body></html>`
  const blob = new Blob([html], { type: 'text/html' })
  chartUrl.value = URL.createObjectURL(blob)
}

function loadEmbedUrls() {
  const base = window.location.origin + window.location.pathname
  if (props.node.type === 'model' && props.node.props?.modelCode) {
    modelUrl.value = `${base}#/lowcode/run/${props.node.props.modelCode}`
  }
  if (props.node.type === 'dashboard' && props.node.props?.dashboardCode) {
    dashboardUrl.value = `${base}#/dashboard/run/${props.node.props.dashboardCode}`
  }
  if (props.node.type === 'report' && props.node.props?.reportCode) {
    reportUrl.value = `${base}#/report/run/${props.node.props.reportCode}`
  }
}

function revokeUrls() {
  if (chartUrl.value) URL.revokeObjectURL(chartUrl.value)
}

function handleEvent(event: any) {
  if (pageContext) {
    pageContext.executeEvent(event)
  }
}

function handleLinkClick() {
  if (props.node.props?.path) {
    handleEvent({ action: 'navigate', target: props.node.props.path })
  }
}

function handleItemClick(item: any) {
  if (props.node.events?.onClick) {
    const event = { ...props.node.events.onClick, item }
    handleEvent(event)
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
.render-image { max-width: 100%; display: block; }
.render-divider { position: relative; }
.divider-text { background: #fff; padding: 0 12px; color: #666; font-size: 12px; position: absolute; }
.render-table-wrapper { overflow-x: auto; }
.render-list { border: 1px solid #eee; border-radius: 4px; }
.render-list-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; }
.render-list-item:last-child { border-bottom: none; }
.render-list-item:hover { background: #f8f8f8; }
.render-list-content { flex: 1; }
.render-list-title { font-weight: bold; }
.render-list-desc { color: #666; font-size: 12px; }
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
