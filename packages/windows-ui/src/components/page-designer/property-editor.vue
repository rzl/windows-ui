<template>
  <div class="property-editor">
    <component :is="formTag" :size="globalSize" label-width="80">
      <div class="section-title">基础</div>
      <component :is="formItemTag" label="组件类型">
      <component :is="inputTag" :size="globalSize" :model-value="typeLabel" disabled @update:model-value="emitUpdate" />
    </component>

    <!-- 通用样式 -->
    <div class="section-title">样式</div>
    <component :is="formItemTag" label="宽度">
      <component :is="inputTag" :size="globalSize" v-model="node.styles.width" placeholder="如 100% 或 300px" @update:model-value="emitUpdate" />
    </component>
    <component :is="formItemTag" label="外边距">
      <component :is="inputTag" :size="globalSize" v-model="node.styles.margin" placeholder="如 16px 或 8px 12px" @update:model-value="emitUpdate" />
    </component>
    <component :is="formItemTag" label="内边距">
      <component :is="inputTag" :size="globalSize" v-model="node.styles.padding" placeholder="如 16px 或 8px 12px" @update:model-value="emitUpdate" />
    </component>
    <component :is="formItemTag" label="背景色">
      <component :is="colorPickerTag" :size="globalSize" v-model="node.styles.backgroundColor" @update:model-value="emitUpdate" />
    </component>
    <component :is="formItemTag" label="文字颜色">
      <component :is="colorPickerTag" :size="globalSize" v-model="node.styles.color" @update:model-value="emitUpdate" />
    </component>
    <component :is="formItemTag" label="字体大小">
      <component :is="inputTag" :size="globalSize" v-model="node.styles.fontSize" placeholder="如 14px" @update:model-value="emitUpdate" />
    </component>
    <component :is="formItemTag" label="圆角">
      <component :is="inputTag" :size="globalSize" v-model="node.styles.borderRadius" placeholder="如 4px" @update:model-value="emitUpdate" />
    </component>
    <component :is="formItemTag" label="对齐">
      <component :is="selectTag" :size="globalSize" v-model="node.styles.textAlign" :options="textAlignOptions" @update:model-value="emitUpdate" />
    </component>

    <!-- 文本 -->
    <template v-if="node.type === 'text'">
      <component :is="formItemTag" label="内容">
        <component :is="inputTag" :size="globalSize" v-model="node.props.content" type="textarea" :rows="3" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="标签">
        <component :is="selectTag" :size="globalSize" v-model="node.props.tag" :options="tagOptions" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="对齐">
        <component :is="selectTag" :size="globalSize" v-model="node.props.align" :options="alignOptions" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 统计卡片 -->
    <template v-if="node.type === 'statistic'">
      <component :is="formItemTag" label="标题">
        <component :is="inputTag" :size="globalSize" v-model="node.props.title" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="字段名">
        <component :is="inputTag" :size="globalSize" v-model="node.props.field" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="图标">
        <component :is="inputTag" :size="globalSize" v-model="node.props.icon" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="颜色">
        <component :is="selectTag" :size="globalSize" v-model="node.props.color" :options="colorOptions" @update:model-value="emitUpdate" />
      </component>
      <data-source-editor v-model="node.dataSource" :size="globalSize" @update:model-value="emitUpdate" />
    </template>

    <!-- 图表 -->
    <template v-if="node.type === 'chart'">
      <component :is="formItemTag" label="标题">
        <component :is="inputTag" :size="globalSize" v-model="node.props.title" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="图表类型">
        <component :is="selectTag" :size="globalSize" v-model="node.props.chartType" :options="chartTypeOptions" @change="handleChartTypeChange" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="高度">
        <component :is="inputTag" :size="globalSize" v-model="node.props.height" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="图表配置（JSON）">
        <component :is="inputTag" :size="globalSize" v-model="optionText" type="textarea" :rows="8" @update:model-value="emitUpdate" />
      </component>
      <data-source-editor v-model="node.dataSource" :size="globalSize" @update:model-value="emitUpdate" />
    </template>

    <!-- 公告 -->
    <template v-if="node.type === 'alert'">
      <component :is="formItemTag" label="内容">
        <component :is="inputTag" :size="globalSize" v-model="node.props.content" type="textarea" :rows="2" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="类型">
        <component :is="selectTag" :size="globalSize" v-model="node.props.type" :options="noticeTypeOptions" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 标签 -->
    <template v-if="node.type === 'tag'">
      <component :is="formItemTag" label="文字">
        <component :is="inputTag" :size="globalSize" v-model="node.props.label" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="类型">
        <component :is="selectTag" :size="globalSize" v-model="node.props.type" :options="tagTypeOptions" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 进度条 -->
    <template v-if="node.type === 'progress'">
      <component :is="formItemTag" label="百分比">
        <component :is="inputNumberTag" :size="globalSize" v-model="node.props.percentage" :min="0" :max="100" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="状态">
        <component :is="selectTag" :size="globalSize" v-model="node.props.status" :options="progressStatusOptions" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="宽度">
        <component :is="inputNumberTag" :size="globalSize" v-model="node.props.width" :min="50" :max="600" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="显示文字">
        <component :is="switchTag" :size="globalSize" v-model="node.props.showText" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 头像 -->
    <template v-if="node.type === 'avatar'">
      <component :is="formItemTag" label="图片地址">
        <component :is="inputTag" :size="globalSize" v-model="node.props.src" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="替代文本">
        <component :is="inputTag" :size="globalSize" v-model="node.props.alt" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="图标">
        <component :is="inputTag" :size="globalSize" v-model="node.props.icon" placeholder="无图片时显示" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="形状">
        <component :is="selectTag" :size="globalSize" v-model="node.props.shape" :options="avatarShapeOptions" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 徽标 -->
    <template v-if="node.type === 'badge'">
      <component :is="formItemTag" label="包裹文字">
        <component :is="inputTag" :size="globalSize" v-model="node.props.text" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="数值">
        <component :is="inputTag" :size="globalSize" v-model="node.props.value" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="类型">
        <component :is="selectTag" :size="globalSize" v-model="node.props.type" :options="tagTypeOptions" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="圆点">
        <component :is="switchTag" :size="globalSize" v-model="node.props.isDot" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 步骤条 -->
    <template v-if="node.type === 'steps'">
      <component :is="formItemTag" label="当前步骤">
        <component :is="inputNumberTag" :size="globalSize" v-model="node.props.active" :min="0" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="步骤（JSON）">
        <component :is="inputTag" :size="globalSize" v-model="itemsText" type="textarea" :rows="4" placeholder='[{"title":"步骤1"}]' @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 时间线 -->
    <template v-if="node.type === 'timeline'">
      <component :is="formItemTag" label="数据（JSON）">
        <component :is="inputTag" :size="globalSize" v-model="itemsText" type="textarea" :rows="6" placeholder='[{"time":"2026-07-01","title":"事件","content":"描述"}]' @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 图片 -->
    <template v-if="node.type === 'image'">
      <component :is="formItemTag" label="图片地址">
        <component :is="inputTag" :size="globalSize" v-model="node.props.src" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="替代文本">
        <component :is="inputTag" :size="globalSize" v-model="node.props.alt" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="宽度">
        <component :is="inputTag" :size="globalSize" v-model="node.props.width" placeholder="100% 或 300px" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="高度">
        <component :is="inputTag" :size="globalSize" v-model="node.props.height" placeholder="auto 或 200px" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="适应方式">
        <component :is="selectTag" :size="globalSize" v-model="node.props.objectFit" :options="objectFitOptions" @update:model-value="emitUpdate" />
      </component>
      <event-editor v-model="node.events" :size="globalSize" @update:model-value="emitUpdate" />
    </template>

    <!-- 分隔线 -->
    <template v-if="node.type === 'divider'">
      <component :is="formItemTag" label="文字">
        <component :is="inputTag" :size="globalSize" v-model="node.props.text" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="方向">
        <component :is="selectTag" :size="globalSize" v-model="node.props.direction" :options="directionOptions" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="边距">
        <component :is="inputTag" :size="globalSize" v-model="node.props.margin" placeholder="如 16px 0" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 表格 -->
    <template v-if="node.type === 'table'">
      <component :is="formItemTag" label="标题">
        <component :is="inputTag" :size="globalSize" v-model="node.props.title" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="高度">
        <component :is="inputTag" :size="globalSize" v-model="node.props.height" placeholder="如 300px，留空自适应" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="列配置(JSON)">
        <component :is="inputTag" :size="globalSize" v-model="columnsText" type="textarea" :rows="4" placeholder='[{"prop":"name","label":"名称","width":120}]' @update:model-value="emitUpdate" />
      </component>
      <data-source-editor v-model="node.dataSource" :size="globalSize" @update:model-value="emitUpdate" />
    </template>

    <!-- 列表 -->
    <template v-if="node.type === 'list'">
      <component :is="formItemTag" label="标题字段">
        <component :is="inputTag" :size="globalSize" v-model="node.props.itemTitle" placeholder="默认 title" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="描述字段">
        <component :is="inputTag" :size="globalSize" v-model="node.props.itemDesc" placeholder="默认 description" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="图标字段">
        <component :is="inputTag" :size="globalSize" v-model="node.props.itemIcon" placeholder="默认 icon" @update:model-value="emitUpdate" />
      </component>
      <data-source-editor v-model="node.dataSource" :size="globalSize" @update:model-value="emitUpdate" />
      <event-editor v-model="node.events" :size="globalSize" @update:model-value="emitUpdate" />
    </template>

    <!-- 容器 -->
    <template v-if="node.type === 'container'">
      <component :is="formItemTag" label="内边距">
        <component :is="inputTag" :size="globalSize" v-model="node.props.padding" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 卡片 -->
    <template v-if="node.type === 'card'">
      <component :is="formItemTag" label="标题">
        <component :is="inputTag" :size="globalSize" v-model="node.props.title" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 栅格 -->
    <template v-if="node.type === 'row'">
      <component :is="formItemTag" label="列数">
        <component :is="inputNumberTag" :size="globalSize" v-model="node.props.columns" :min="1" :max="6" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="间距">
        <component :is="inputTag" :size="globalSize" v-model="node.props.gap" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 标签页 -->
    <template v-if="node.type === 'tabs'">
      <component :is="formItemTag" label="标签配置（JSON）">
        <component :is="inputTag" :size="globalSize" v-model="tabsText" type="textarea" :rows="4" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 数据模型 -->
    <template v-if="node.type === 'model'">
      <component :is="formItemTag" label="模型编码">
        <component :is="inputTag" :size="globalSize" v-model="node.props.modelCode" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="高度">
        <component :is="inputTag" :size="globalSize" v-model="node.props.height" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 仪表盘 -->
    <template v-if="node.type === 'dashboard'">
      <component :is="formItemTag" label="仪表盘编码">
        <component :is="inputTag" :size="globalSize" v-model="node.props.dashboardCode" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 报表 -->
    <template v-if="node.type === 'report'">
      <component :is="formItemTag" label="报表编码">
        <component :is="inputTag" :size="globalSize" v-model="node.props.reportCode" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 按钮 -->
    <template v-if="node.type === 'button'">
      <component :is="formItemTag" label="按钮文字">
        <component :is="inputTag" :size="globalSize" v-model="node.props.label" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="按钮类型">
        <component :is="selectTag" :size="globalSize" v-model="node.props.type" :options="buttonTypeOptions" @update:model-value="emitUpdate" />
      </component>
      <event-editor v-model="node.events" :size="globalSize" @update:model-value="emitUpdate" />
    </template>

    <!-- 链接 -->
    <template v-if="node.type === 'link'">
      <component :is="formItemTag" label="链接文字">
        <component :is="inputTag" :size="globalSize" v-model="node.props.label" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="链接路径">
        <component :is="inputTag" :size="globalSize" v-model="node.props.path" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 输入框 -->
    <template v-if="node.type === 'input'">
      <component :is="formItemTag" label="绑定字段">
        <component :is="inputTag" :size="globalSize" v-model="node.props.field" placeholder="formData 中的键名" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="标签">
        <component :is="inputTag" :size="globalSize" v-model="node.props.label" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="占位提示">
        <component :is="inputTag" :size="globalSize" v-model="node.props.placeholder" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="类型">
        <component :is="selectTag" :size="globalSize" v-model="node.props.type" :options="inputTypeOptions" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="默认值">
        <component :is="inputTag" :size="globalSize" v-model="node.props.modelValue" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 选择器 -->
    <template v-if="node.type === 'select'">
      <component :is="formItemTag" label="绑定字段">
        <component :is="inputTag" :size="globalSize" v-model="node.props.field" placeholder="formData 中的键名" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="标签">
        <component :is="inputTag" :size="globalSize" v-model="node.props.label" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="占位提示">
        <component :is="inputTag" :size="globalSize" v-model="node.props.placeholder" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="选项（JSON）">
        <component :is="inputTag" :size="globalSize" v-model="optionsText" type="textarea" :rows="4" placeholder='[{"label":"选项1","value":"1"}]' @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="默认值">
        <component :is="inputTag" :size="globalSize" v-model="node.props.modelValue" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 开关 -->
    <template v-if="node.type === 'switch'">
      <component :is="formItemTag" label="绑定字段">
        <component :is="inputTag" :size="globalSize" v-model="node.props.field" placeholder="formData 中的键名" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="标签">
        <component :is="inputTag" :size="globalSize" v-model="node.props.label" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="默认值">
        <component :is="switchTag" :size="globalSize" v-model="node.props.modelValue" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 单选框 -->
    <template v-if="node.type === 'radio'">
      <component :is="formItemTag" label="绑定字段">
        <component :is="inputTag" :size="globalSize" v-model="node.props.field" placeholder="formData 中的键名" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="标签">
        <component :is="inputTag" :size="globalSize" v-model="node.props.label" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="选项（JSON）">
        <component :is="inputTag" :size="globalSize" v-model="optionsText" type="textarea" :rows="4" placeholder='[{"label":"选项1","value":"1"}]' @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="默认值">
        <component :is="inputTag" :size="globalSize" v-model="node.props.modelValue" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 多选框 -->
    <template v-if="node.type === 'checkbox'">
      <component :is="formItemTag" label="绑定字段">
        <component :is="inputTag" :size="globalSize" v-model="node.props.field" placeholder="formData 中的键名" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="标签">
        <component :is="inputTag" :size="globalSize" v-model="node.props.label" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="选项（JSON）">
        <component :is="inputTag" :size="globalSize" v-model="optionsText" type="textarea" :rows="4" placeholder='[{"label":"选项1","value":"1"}]' @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="默认值">
        <component :is="inputTag" :size="globalSize" v-model="node.props.modelValue" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 日期选择 -->
    <template v-if="node.type === 'date-picker'">
      <component :is="formItemTag" label="绑定字段">
        <component :is="inputTag" :size="globalSize" v-model="node.props.field" placeholder="formData 中的键名" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="标签">
        <component :is="inputTag" :size="globalSize" v-model="node.props.label" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="占位提示">
        <component :is="inputTag" :size="globalSize" v-model="node.props.placeholder" @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="默认值">
        <component :is="inputTag" :size="globalSize" v-model="node.props.modelValue" @update:model-value="emitUpdate" />
      </component>
    </template>

    <!-- 插件组件 -->
    <template v-else-if="pluginComponent">
      <component :is="formItemTag" label="组件编码">
        <component :is="inputTag" :size="globalSize" :model-value="node.type" disabled @update:model-value="emitUpdate" />
      </component>
      <component :is="formItemTag" label="属性（JSON）">
        <component :is="inputTag" :size="globalSize" v-model="propsText" type="textarea" :rows="8" @update:model-value="emitUpdate" />
      </component>
    </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DataSourceEditor from './data-source-editor.vue'
import EventEditor from './event-editor.vue'
import { listCharts, getChart, getComponent } from './plugin-manager'
import { usePrefix, useGlobalSize } from '../../utils/prefix'
import type { PageNode } from './types'

defineOptions({ name: 'WPagePropertyEditor' })

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const formTag = withPrefix('form')
const formItemTag = withPrefix('form-item')
const inputTag = withPrefix('input')
const selectTag = withPrefix('select')
const inputNumberTag = withPrefix('input-number')
const switchTag = withPrefix('switch')
const colorPickerTag = withPrefix('color-picker')

const props = defineProps<{
  node: PageNode
}>()

const emit = defineEmits(['update'])

function emitUpdate() {
  emit('update', props.node)
}

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
  tag: '标签',
  progress: '进度条',
  avatar: '头像',
  badge: '徽标',
  steps: '步骤条',
  timeline: '时间线',
  table: '表格',
  list: '列表',
  model: '数据模型',
  dashboard: '仪表盘',
  report: '报表',
  button: '按钮',
  link: '链接',
  input: '输入框',
  select: '选择器',
  radio: '单选框',
  checkbox: '多选框',
  'date-picker': '日期选择',
  switch: '开关'
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

const tagTypeOptions = [
  { label: '默认', value: 'default' },
  { label: '主要', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' }
]

const progressStatusOptions = [
  { label: '默认', value: '' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' }
]

const avatarShapeOptions = [
  { label: '圆形', value: 'circle' },
  { label: '方形', value: 'square' }
]

const directionOptions = [
  { label: '水平', value: 'horizontal' },
  { label: '垂直', value: 'vertical' }
]

const textAlignOptions = [
  { label: '默认', value: '' },
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
]

const inputTypeOptions = [
  { label: '文本', value: 'text' },
  { label: '密码', value: 'password' },
  { label: '数字', value: 'number' },
  { label: '多行文本', value: 'textarea' }
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

const optionsText = computed({
  get() {
    return JSON.stringify(props.node.props?.options || [], null, 2)
  },
  set(value: string) {
    try {
      if (!props.node.props) props.node.props = {}
      props.node.props.options = JSON.parse(value)
      emit('update', props.node)
    } catch {
      // ignore invalid json
    }
  }
})

const itemsText = computed({
  get() {
    return JSON.stringify(props.node.props?.items || [], null, 2)
  },
  set(value: string) {
    try {
      if (!props.node.props) props.node.props = {}
      props.node.props.items = JSON.parse(value)
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
.section-title { font-weight: bold; margin-bottom: 8px; color: var(--w-text-color-regular); }
</style>
