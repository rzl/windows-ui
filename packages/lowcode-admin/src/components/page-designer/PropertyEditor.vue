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
    <template v-if="node.type === 'stat'">
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
      <w-form-item label="高度">
        <w-input v-model="node.props.height" />
      </w-form-item>
      <w-form-item label="ECharts 配置（JSON）">
        <w-input v-model="optionText" type="textarea" :rows="8" />
      </w-form-item>
      <data-source-editor v-model="node.dataSource" />
    </template>

    <!-- 公告 -->
    <template v-if="node.type === 'notice'">
      <w-form-item label="内容">
        <w-input v-model="node.props.content" type="textarea" :rows="2" />
      </w-form-item>
      <w-form-item label="类型">
        <w-select v-model="node.props.type" :options="noticeTypeOptions" />
      </w-form-item>
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
    <template v-if="node.type === 'grid'">
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
      <w-form-item label="点击动作">
        <w-select v-model="node.events.onClick.action" :options="actionOptions" />
      </w-form-item>
      <w-form-item label="目标">
        <w-input v-model="node.events.onClick.target" placeholder="路径或编码" />
      </w-form-item>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DataSourceEditor from './DataSourceEditor.vue'

const props = defineProps<{
  node: any
}>()

const emit = defineEmits(['update'])

const typeLabelMap: Record<string, string> = {
  container: '容器',
  card: '卡片',
  grid: '栅格',
  tabs: '标签页',
  text: '文本',
  stat: '统计卡片',
  chart: '图表',
  notice: '公告',
  model: '数据模型',
  dashboard: '仪表盘',
  report: '报表',
  button: '按钮',
  link: '链接'
}

const typeLabel = computed(() => typeLabelMap[props.node.type] || props.node.type)

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

const actionOptions = [
  { label: '跳转', value: 'navigate' },
  { label: '刷新', value: 'refresh' },
  { label: '打开弹窗', value: 'openDialog' }
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
    return JSON.stringify(props.node.props.tabs || [], null, 2)
  },
  set(value: string) {
    try {
      props.node.props.tabs = JSON.parse(value)
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
