<template>
  <div class="property-editor">
    <div class="section-title">基础</div>
    <w-form-item label="组件类型">
      <w-input :model-value="typeLabel" disabled />
    </w-form-item>

    <!-- 通用样式 -->
    <w-form-item label="上边距">
      <w-input v-model="node.styles.marginTop" />
    </w-form-item>
    <w-form-item label="下边距">
      <w-input v-model="node.styles.marginBottom" />
    </w-form-item>
    <w-form-item label="左边距">
      <w-input v-model="node.styles.marginLeft" />
    </w-form-item>
    <w-form-item label="右边距">
      <w-input v-model="node.styles.marginRight" />
    </w-form-item>
    <w-form-item label="宽度">
      <w-input v-model="node.styles.width" placeholder="如 100% 或 300px" />
    </w-form-item>

    <!-- 文本 -->
    <template v-if="node.type === 'text'">
      <w-form-item label="内容">
        <w-input v-model="node.props.content" type="textarea" :rows="3" />
      </w-form-item>
      <w-form-item label="标签">
        <w-select v-model="node.props.tag" :options="tagOptions" />
      </w-form-item>
      <w-form-item label="对齐">
        <w-select v-model="node.props.align" :options="alignOptions" />
      </w-form-item>
    </template>

    <!-- 统计卡片 -->
    <template v-if="node.type === 'statistic'">
      <w-form-item label="标题">
        <w-input v-model="node.props.title" />
      </w-form-item>
      <w-form-item label="字段名">
        <w-input v-model="node.props.field" />
      </w-form-item>
      <w-form-item label="图标">
        <w-input v-model="node.props.icon" />
      </w-form-item>
      <w-form-item label="颜色">
        <w-select v-model="node.props.color" :options="colorOptions" />
      </w-form-item>
      <data-source-editor v-model="node.dataSource" />
    </template>

    <!-- 图表 -->
    <template v-if="node.type === 'chart'">
      <w-form-item label="标题">
        <w-input v-model="node.props.title" />
      </w-form-item>
      <w-form-item label="图表类型">
        <w-select v-model="node.props.chartType" :options="chartTypeOptions" @change="handleChartTypeChange" />
      </w-form-item>
      <w-form-item label="高度">
        <w-input v-model="node.props.height" />
      </w-form-item>
      <w-form-item label="图表配置（JSON）">
        <w-input v-model="optionText" type="textarea" :rows="8" />
      </w-form-item>
      <data-source-editor v-model="node.dataSource" />
    </template>

    <!-- 公告 -->
    <template v-if="node.type === 'alert'">
      <w-form-item label="内容">
        <w-input v-model="node.props.content" type="textarea" :rows="2" />
      </w-form-item>
      <w-form-item label="类型">
        <w-select v-model="node.props.type" :options="noticeTypeOptions" />
      </w-form-item>
    </template>

    <!-- 图片 -->
    <template v-if="node.type === 'image'">
      <w-form-item label="图片地址">
        <w-input v-model="node.props.src" />
      </w-form-item>
      <w-form-item label="替代文本">
        <w-input v-model="node.props.alt" />
      </w-form-item>
      <w-form-item label="宽度">
        <w-input v-model="node.props.width" placeholder="100% 或 300px" />
      </w-form-item>
      <w-form-item label="高度">
        <w-input v-model="node.props.height" placeholder="auto 或 200px" />
      </w-form-item>
      <w-form-item label="适应方式">
        <w-select v-model="node.props.objectFit" :options="objectFitOptions" />
      </w-form-item>
      <event-editor v-model="node.events" />
    </template>

    <!-- 分隔线 -->
    <template v-if="node.type === 'divider'">
      <w-form-item label="文字">
        <w-input v-model="node.props.text" />
      </w-form-item>
      <w-form-item label="方向">
        <w-select v-model="node.props.direction" :options="directionOptions" />
      </w-form-item>
      <w-form-item label="边距">
        <w-input v-model="node.props.margin" placeholder="如 16px 0" />
      </w-form-item>
    </template>

    <!-- 表格 -->
    <template v-if="node.type === 'table'">
      <w-form-item label="标题">
        <w-input v-model="node.props.title" />
      </w-form-item>
      <w-form-item label="高度">
        <w-input v-model="node.props.height" placeholder="如 300px，留空自适应" />
      </w-form-item>
      <w-form-item label="列配置(JSON)">
        <w-input v-model="columnsText" type="textarea" :rows="4" placeholder='[{"prop":"name","label":"名称","width":120}]' />
      </w-form-item>
      <data-source-editor v-model="node.dataSource" />
    </template>

    <!-- 列表 -->
    <template v-if="node.type === 'list'">
      <w-form-item label="标题字段">
        <w-input v-model="node.props.itemTitle" placeholder="默认 title" />
      </w-form-item>
      <w-form-item label="描述字段">
        <w-input v-model="node.props.itemDesc" placeholder="默认 description" />
      </w-form-item>
      <w-form-item label="图标字段">
        <w-input v-model="node.props.itemIcon" placeholder="默认 icon" />
      </w-form-item>
      <data-source-editor v-model="node.dataSource" />
      <event-editor v-model="node.events" />
    </template>

    <!-- 容器 -->
    <template v-if="node.type === 'container'">
      <w-form-item label="内边距">
        <w-input v-model="node.props.padding" />
      </w-form-item>
    </template>

    <!-- 卡片 -->
    <template v-if="node.type === 'card'">
      <w-form-item label="标题">
        <w-input v-model="node.props.title" />
      </w-form-item>
    </template>

    <!-- 栅格 -->
    <template v-if="node.type === 'row'">
      <w-form-item label="列数">
        <w-input-number v-model="node.props.columns" :min="1" :max="6" />
      </w-form-item>
      <w-form-item label="间距">
        <w-input v-model="node.props.gap" />
      </w-form-item>
    </template>

    <!-- 标签页 -->
    <template v-if="node.type === 'tabs'">
      <w-form-item label="标签配置（JSON）">
        <w-input v-model="tabsText" type="textarea" :rows="4" />
      </w-form-item>
    </template>

    <!-- 数据模型 -->
    <template v-if="node.type === 'model'">
      <w-form-item label="模型编码">
        <w-input v-model="node.props.modelCode" />
      </w-form-item>
      <w-form-item label="高度">
        <w-input v-model="node.props.height" />
      </w-form-item>
    </template>

    <!-- 仪表盘 -->
    <template v-if="node.type === 'dashboard'">
      <w-form-item label="仪表盘编码">
        <w-input v-model="node.props.dashboardCode" />
      </w-form-item>
    </template>

    <!-- 报表 -->
    <template v-if="node.type === 'report'">
      <w-form-item label="报表编码">
        <w-input v-model="node.props.reportCode" />
      </w-form-item>
    </template>

    <!-- 按钮 -->
    <template v-if="node.type === 'button'">
      <w-form-item label="按钮文字">
        <w-input v-model="node.props.label" />
      </w-form-item>
      <w-form-item label="按钮类型">
        <w-select v-model="node.props.type" :options="buttonTypeOptions" />
      </w-form-item>
      <event-editor v-model="node.events" />
    </template>

    <!-- 链接 -->
    <template v-if="node.type === 'link'">
      <w-form-item label="链接文字">
        <w-input v-model="node.props.label" />
      </w-form-item>
      <w-form-item label="链接路径">
        <w-input v-model="node.props.path" />
      </w-form-item>
    </template>

    <!-- 插件组件 -->
    <template v-else-if="pluginComponent">
      <w-form-item label="组件编码">
        <w-input :model-value="node.type" disabled />
      </w-form-item>
      <w-form-item label="属性（JSON）">
        <w-input v-model="propsText" type="textarea" :rows="8" />
      </w-form-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DataSourceEditor from './data-source-editor.vue'
import EventEditor from './event-editor.vue'
import { listCharts, getChart, getComponent } from './plugin-manager'
import type { PageNode } from './types'

defineOptions({ name: 'WPagePropertyEditor' })

const props = defineProps<{
  node: PageNode
}>()

const emit = defineEmits(['update'])

const typeLabelMap: Record<string, string> = {
  container: '容器',
  card: '卡片',
  row: '栅格',
  tabs: '标签页',
  text: '文本',
  statistic: '统计卡片',
  chart: '图表',
  alert: '公告',
  image: '图片',
  divider: '分隔线',
  table: '表格',
  list: '列表',
  model: '数据模型',
  dashboard: '仪表盘',
  report: '报表',
  button: '按钮',
  link: '链接'
}

const typeLabel = computed(() => typeLabelMap[props.node.type] || props.node.type)
const pluginComponent = computed(() => getComponent(props.node.type))

const chartTypeOptions = computed(() => listCharts().map((c) => ({ label: c.label, value: c.type })))

function handleChartTypeChange(type: string) {
  const plugin = getChart(type)
  if (plugin) {
    props.node.option = plugin.defaultOption()
  }
}

const tagOptions = [
  { label: '段落 p', value: 'p' },
  { label: '标题 h1', value: 'h1' },
  { label: '标题 h2', value: 'h2' },
  { label: '标题 h3', value: 'h3' },
  { label: '标题 h4', value: 'h4' },
  { label: 'div', value: 'div' },
  { label: 'span', value: 'span' }
]

const alignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
]

const colorOptions = [
  { label: '主色', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' }
]

const noticeTypeOptions = [
  { label: '信息', value: 'info' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '错误', value: 'error' }
]

const buttonTypeOptions = [
  { label: '默认', value: 'default' },
  { label: '主色', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' }
]

const objectFitOptions = [
  { label: '覆盖', value: 'cover' },
  { label: '包含', value: 'contain' },
  { label: '填充', value: 'fill' },
  { label: '原始大小', value: 'none' }
]

const directionOptions = [
  { label: '水平', value: 'horizontal' },
  { label: '垂直', value: 'vertical' }
]

const optionText = computed({
  get() {
    return JSON.stringify(props.node.option || {}, null, 2)
  },
  set(value: string) {
    try {
      props.node.option = JSON.parse(value)
      emit('update', props.node)
    } catch {
      // ignore invalid json
    }
  }
})

const tabsText = computed({
  get() {
    return JSON.stringify(props.node.props?.tabs || [], null, 2)
  },
  set(value: string) {
    try {
      if (!props.node.props) props.node.props = {}
      props.node.props.tabs = JSON.parse(value)
      emit('update', props.node)
    } catch {
      // ignore invalid json
    }
  }
})

const propsText = computed({
  get() {
    return JSON.stringify(props.node.props || {}, null, 2)
  },
  set(value: string) {
    try {
      props.node.props = JSON.parse(value)
      emit('update', props.node)
    } catch {
      // ignore invalid json
    }
  }
})

const columnsText = computed({
  get() {
    return JSON.stringify(props.node.props?.columns || [], null, 2)
  },
  set(value: string) {
    try {
      if (!props.node.props) props.node.props = {}
      props.node.props.columns = JSON.parse(value)
      emit('update', props.node)
    } catch {
      // ignore invalid json
    }
  }
})
</script>

<style scoped>
.property-editor { padding: 8px 0; }
.section-title { font-weight: bold; margin-bottom: 8px; color: #333; }
</style>
