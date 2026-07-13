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
    <component
      :is="statisticTag"
      v-else-if="node.type === 'statistic'"
      :title="node.props.title"
      :value="displayValue"
      :prefix="node.props.prefix"
      :suffix="node.props.suffix"
      :precision="node.props.precision"
      :icon="node.props.icon"
      :color="node.props.color"
      :value-style="node.props.valueStyle"
    />

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

    <!-- 标签 -->
    <component
      :is="tagTag"
      v-else-if="node.type === 'tag'"
      :type="node.props.type || 'default'"
    >
      {{ node.props.label }}
    </component>

    <!-- 进度条 -->
    <component
      :is="progressTag"
      v-else-if="node.type === 'progress'"
      :percentage="node.props.percentage ?? 50"
      :status="node.props.status"
      :width="node.props.width ?? 200"
      :show-text="node.props.showText ?? true"
    />

    <!-- 头像 -->
    <component
      :is="avatarTag"
      v-else-if="node.type === 'avatar'"
      :src="node.props.src"
      :alt="node.props.alt"
      :icon="node.props.src ? '' : (node.props.icon || 'user')"
      :shape="node.props.shape || 'circle'"
    />

    <!-- 徽标 -->
    <component
      :is="badgeTag"
      v-else-if="node.type === 'badge'"
      :value="node.props.value"
      :is-dot="node.props.isDot"
      :type="node.props.type || 'danger'"
    >
      {{ node.props.text || '徽标' }}
    </component>

    <!-- 步骤条 -->
    <component
      :is="stepsTag"
      v-else-if="node.type === 'steps'"
      :items="node.props.items || []"
      :active="node.props.active ?? 0"
    />

    <!-- 时间线 -->
    <component
      :is="timelineTag"
      v-else-if="node.type === 'timeline'"
      :items="node.props.items || []"
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
      v-model="modelValue"
      :placeholder="node.props.placeholder"
      :type="node.props.type || 'text'"
    />

    <!-- 选择器 -->
    <component
      :is="selectTag"
      v-else-if="node.type === 'select'"
      v-model="modelValue"
      :options="node.props.options || []"
      :placeholder="node.props.placeholder"
    />

    <!-- 开关 -->
    <component
      :is="switchTag"
      v-else-if="node.type === 'switch'"
      v-model="modelValue"
    />

    <!-- 单选框 -->
    <component
      :is="radioTag"
      v-else-if="node.type === 'radio'"
      v-model="modelValue"
      :options="node.props.options || []"
    />

    <!-- 多选框 -->
    <component
      :is="checkboxTag"
      v-else-if="node.type === 'checkbox'"
      v-model="modelValue"
      :options="node.props.options || []"
    />

    <!-- 日期选择 -->
    <component
      :is="datePickerTag"
      v-else-if="node.type === 'date-picker'"
      v-model="modelValue"
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

    <!-- 列（仅作为 row 子容器使用） -->
    <component
      :is="colTag"
      v-else-if="node.type === 'col'"
      :span="node.props.span ?? 12"
      :offset="node.props.offset ?? 0"
    >
      <render-component
        v-for="(child, idx) in node.children"
        :key="child.id || idx"
        :node="child"
        :page-code="pageCode"
      />
    </component>

    <!-- 栅格 -->
    <component
      :is="rowTag"
      v-else-if="node.type === 'row'"
      :gutter="node.props.gutter ?? 16"
      :type="node.props.type || ''"
      :justify="node.props.justify || ''"
      :align="node.props.align || ''"
      :wrap="node.props.wrap ?? true"
    >
      <render-component
        v-for="(child, idx) in node.children"
        :key="child.id || idx"
        :node="child"
        :page-code="pageCode"
      />
    </component>

    <!-- 标签页 -->
    <component
      :is="tabsTag"
      v-else-if="node.type === 'tabs'"
      v-model="activeTabName"
      :tabs="tabsForRenderer"
    >
      <component
        :is="tabPaneTag"
        v-for="tab in node.props.tabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      >
        <render-component
          v-for="(child, idx) in childrenForTab(tab.name)"
          :key="child.id || idx"
          :node="child"
          :page-code="pageCode"
        />
      </component>
    </component>

    <!-- 折叠面板 -->
    <component
      :is="collapseTag"
      v-else-if="node.type === 'collapse'"
      :accordion="node.props.accordion"
    >
      <component
        :is="collapseItemTag"
        v-for="(child, idx) in node.children"
        :key="child.id || idx"
        :name="child.id || idx"
        :title="child.props?.title || `面板${idx + 1}`"
      >
        <render-component
          :node="child"
          :page-code="pageCode"
        />
      </component>
    </component>

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
const statisticTag = withPrefix('statistic')
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
const tagTag = withPrefix('tag')
const progressTag = withPrefix('progress')
const avatarTag = withPrefix('avatar')
const badgeTag = withPrefix('badge')
const stepsTag = withPrefix('steps')
const timelineTag = withPrefix('timeline')
const rowTag = withPrefix('row')
const colTag = withPrefix('col')
const tabsTag = withPrefix('tabs')
const tabPaneTag = withPrefix('tab-pane')
const collapseTag = withPrefix('collapse')
const collapseItemTag = withPrefix('collapse-item')

const pageContext = inject<PageContext | null>('pageContext', null)
const activeTabName = ref<string | number>('')
const dataValue = ref<any>(null)
const chartUrl = ref('')
const modelUrl = ref('')
const dashboardUrl = ref('')
const reportUrl = ref('')
const pluginComponent = computed(() => getComponent(props.node.type))
const fieldKey = computed(() => props.node.props?.field as string | undefined)

const modelValue = computed({
  get: () => {
    if (fieldKey.value && pageContext) {
      return pageContext.formData[fieldKey.value]
    }
    return props.node.props?.modelValue
  },
  set: (value) => {
    if (fieldKey.value && pageContext) {
      pageContext.updateFormData(fieldKey.value, value)
    } else {
      props.node.props.modelValue = value
    }
  }
})

const displayValue = computed(() => {
  if (dataValue.value !== null && dataValue.value !== undefined) {
    return dataValue.value
  }
  return props.node.dataSource?.value ?? 0
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

const tabsForRenderer = computed(() => {
  return (props.node.props?.tabs || []).map((tab: any) => ({
    label: tab.label || tab.title || tab.name,
    name: tab.name
  }))
})

function childrenForTab(tabName: string | number) {
  if (!props.node.children) return []
  return props.node.children.filter((child: PageNode) => child.tab === tabName)
}

onMounted(() => {
  if (props.node.type === 'tabs' && props.node.props?.tabs?.length) {
    activeTabName.value = props.node.props.modelValue || props.node.props.tabs[0].name
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
.stat-card { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--w-fill-color-lighter); border: 1px solid var(--w-border-color); border-radius: 4px; }
.stat-card.is-primary { color: var(--w-color-primary); }
.stat-card.is-success { color: var(--w-color-success); }
.stat-card.is-warning { color: var(--w-color-warning); }
.stat-card.is-danger { color: var(--w-color-danger); }
.stat-title { color: var(--w-text-color-secondary); font-size: 12px; }
.stat-value { font-size: 28px; font-weight: bold; }
.chart-wrapper { width: 100%; }
.chart-frame { width: 100%; border: none; height: v-bind('node.props.height || "300px"'); }
.render-image { max-width: 100%; display: block; }
.render-divider { position: relative; }
.divider-text { background: var(--w-bg-color); padding: 0 12px; color: var(--w-text-color-secondary); font-size: 12px; position: absolute; }
.render-table-wrapper { overflow-x: auto; }
.render-list { border: 1px solid var(--w-border-color-light); border-radius: 4px; }
.render-list-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid var(--w-border-color-light); cursor: pointer; }
.render-list-item:last-child { border-bottom: none; }
.render-list-item:hover { background: var(--w-fill-color-lighter); }
.render-list-content { flex: 1; }
.render-list-title { font-weight: bold; }
.render-list-desc { color: var(--w-text-color-secondary); font-size: 12px; }
.render-container { border: 1px solid var(--w-border-color-light); }
.render-grid { width: 100%; }
.grid-item { min-width: 0; }
.render-tabs { border: 1px solid var(--w-border-color); }
.tabs-nav { display: flex; gap: 8px; border-bottom: 1px solid var(--w-border-color); background: var(--w-fill-color-lighter); }
.tabs-nav-item { padding: 8px 16px; cursor: pointer; }
.tabs-nav-item.active { background: var(--w-bg-color); border: 1px solid var(--w-border-color); border-bottom: none; }
.tabs-content { padding: 12px; }
.embed-frame { width: 100%; border: none; min-height: 300px; }
.unknown-component { padding: 12px; background: var(--w-color-danger-lighter); color: var(--w-color-danger); }
</style>
