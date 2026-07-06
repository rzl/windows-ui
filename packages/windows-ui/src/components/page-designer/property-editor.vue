<template>
  <div class="property-editor">
    <div class="section-title">基础</div>
    <component :is="formTag" :size="globalSize" label-width="80">
      <component :is="formItemTag" label="组件类型">
        <component :is="inputTag" :size="globalSize" :model-value="typeLabel" disabled />
      </component>
    </component>

    <!-- 通用样式 -->
    <div class="section-title">样式</div>
    <schema-property-editor
      :node="node"
      :schema="styleSchema"
      :size="globalSize"
      @update="emitUpdate"
    />

    <!-- 组件特定属性 -->
    <template v-if="componentSchema.length">
      <div class="section-title">属性</div>
      <schema-property-editor
        :node="node"
        :schema="componentSchema"
        :size="globalSize"
        @update="emitUpdate"
      />
    </template>

    <!-- 插件组件 fallback：JSON 编辑 -->
    <template v-if="pluginComponent && !componentSchema.length">
      <component :is="formTag" :size="globalSize" label-width="80">
        <component :is="formItemTag" label="组件编码">
          <component :is="inputTag" :size="globalSize" :model-value="node.type" disabled />
        </component>
        <component :is="formItemTag" label="属性（JSON）">
          <component
            :is="inputTag"
            :size="globalSize"
            :model-value="propsText"
            type="textarea"
            :rows="8"
            @update:model-value="updatePropsText"
          />
        </component>
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SchemaPropertyEditor from './schema-property-editor.vue'
import { getComponent, listCharts } from './plugin-manager'
import { usePrefix, useGlobalSize } from '../../utils/prefix'
import type { PageNode, PropertySchemaField } from './types'

defineOptions({ name: 'WPagePropertyEditor' })

const props = defineProps<{
  node: PageNode
}>()

const emit = defineEmits(['update'])

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const formTag = withPrefix('form')
const formItemTag = withPrefix('form-item')
const inputTag = withPrefix('input')

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

// 通用样式 schema
const styleSchema = computed<PropertySchemaField[]>(() => [
  { type: 'input', key: 'styles.width', label: '宽度', placeholder: '如 100% 或 300px' },
  { type: 'input', key: 'styles.margin', label: '外边距', placeholder: '如 16px 或 8px 12px' },
  { type: 'input', key: 'styles.padding', label: '内边距', placeholder: '如 16px 或 8px 12px' },
  { type: 'color', key: 'styles.backgroundColor', label: '背景色' },
  { type: 'color', key: 'styles.color', label: '文字颜色' },
  { type: 'input', key: 'styles.fontSize', label: '字体大小', placeholder: '如 14px' },
  { type: 'input', key: 'styles.borderRadius', label: '圆角', placeholder: '如 4px' },
  {
    type: 'select',
    key: 'styles.textAlign',
    label: '对齐',
    options: [
      { label: '默认', value: '' },
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' }
    ]
  }
])

const commonTypeOptions = [
  { label: '默认', value: 'default' },
  { label: '主要', value: 'primary' },
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

const alignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
]

const tagOptions = [
  { label: '段落 p', value: 'p' },
  { label: '标题 h1', value: 'h1' },
  { label: '标题 h2', value: 'h2' },
  { label: '标题 h3', value: 'h3' },
  { label: '标题 h4', value: 'h4' },
  { label: 'div', value: 'div' },
  { label: 'span', value: 'span' }
]

const objectFitOptions = [
  { label: '覆盖', value: 'cover' },
  { label: '包含', value: 'contain' },
  { label: '填充', value: 'fill' },
  { label: '原始大小', value: 'none' }
]

const inputTypeOptions = [
  { label: '文本', value: 'text' },
  { label: '密码', value: 'password' },
  { label: '数字', value: 'number' },
  { label: '多行文本', value: 'textarea' }
]

const directionOptions = [
  { label: '水平', value: 'horizontal' },
  { label: '垂直', value: 'vertical' }
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

const componentSchemas: Record<string, PropertySchemaField[]> = {
  container: [
    { type: 'input', key: 'props.padding', label: '内边距', placeholder: '如 12px', default: '12px' }
  ],
  card: [
    { type: 'input', key: 'props.title', label: '标题', default: '卡片标题' }
  ],
  row: [
    { type: 'number', key: 'props.columns', label: '列数', min: 1, max: 6, default: 2 },
    { type: 'input', key: 'props.gap', label: '间距', placeholder: '如 12px', default: '12px' }
  ],
  tabs: [
    { type: 'items', key: 'props.tabs', label: '标签配置（JSON）', placeholder: '[{"title":"标签1","name":"tab1"}]', default: [] }
  ],
  text: [
    { type: 'textarea', key: 'props.content', label: '内容', rows: 3, default: '文本内容' },
    { type: 'select', key: 'props.tag', label: '标签', options: tagOptions, default: 'p' },
    { type: 'select', key: 'props.align', label: '对齐', options: alignOptions, default: 'left' }
  ],
  statistic: [
    { type: 'input', key: 'props.title', label: '标题', default: '统计标题' },
    { type: 'input', key: 'props.field', label: '字段名', placeholder: 'formData 中的键名' },
    { type: 'input', key: 'props.icon', label: '图标' },
    { type: 'select', key: 'props.color', label: '颜色', options: commonTypeOptions, default: 'primary' },
    { type: 'input', key: 'props.prefix', label: '前缀' },
    { type: 'input', key: 'props.suffix', label: '后缀' },
    { type: 'number', key: 'props.precision', label: '精度', min: 0, max: 10, default: 0 },
    { type: 'dataSource', key: 'dataSource', label: '数据源', default: { type: 'static', value: 0 } }
  ],
  chart: [
    { type: 'input', key: 'props.title', label: '标题', default: '示例图表' },
    { type: 'select', key: 'props.chartType', label: '图表类型', options: [], default: 'echarts' },
    { type: 'input', key: 'props.height', label: '高度', placeholder: '如 300px', default: '300px' },
    { type: 'json', key: 'option', label: '图表配置（JSON）', default: {} },
    { type: 'dataSource', key: 'dataSource', label: '数据源', default: { type: 'static', value: null } }
  ],
  alert: [
    { type: 'textarea', key: 'props.content', label: '内容', rows: 2, default: '公告内容' },
    { type: 'select', key: 'props.type', label: '类型', options: noticeTypeOptions, default: 'info' }
  ],
  tag: [
    { type: 'input', key: 'props.label', label: '文字', default: '标签' },
    { type: 'select', key: 'props.type', label: '类型', options: commonTypeOptions, default: 'default' }
  ],
  progress: [
    { type: 'number', key: 'props.percentage', label: '百分比', min: 0, max: 100, default: 50 },
    { type: 'select', key: 'props.status', label: '状态', options: progressStatusOptions, default: '' },
    { type: 'number', key: 'props.width', label: '宽度', min: 50, max: 600, default: 200 },
    { type: 'switch', key: 'props.showText', label: '显示文字', default: true }
  ],
  avatar: [
    { type: 'input', key: 'props.src', label: '图片地址' },
    { type: 'input', key: 'props.alt', label: '替代文本' },
    { type: 'input', key: 'props.icon', label: '图标', placeholder: '无图片时显示', default: 'user' },
    { type: 'select', key: 'props.shape', label: '形状', options: avatarShapeOptions, default: 'circle' }
  ],
  badge: [
    { type: 'input', key: 'props.text', label: '包裹文字', default: '徽标' },
    { type: 'input', key: 'props.value', label: '数值' },
    { type: 'select', key: 'props.type', label: '类型', options: commonTypeOptions, default: 'danger' },
    { type: 'switch', key: 'props.isDot', label: '圆点', default: false }
  ],
  steps: [
    { type: 'number', key: 'props.active', label: '当前步骤', min: 0, default: 0 },
    { type: 'items', key: 'props.items', label: '步骤（JSON）', placeholder: '[{"title":"步骤1"}]', default: [] }
  ],
  timeline: [
    { type: 'items', key: 'props.items', label: '数据（JSON）', placeholder: '[{"time":"2026-07-01","title":"事件","content":"描述"}]', default: [] }
  ],
  image: [
    { type: 'input', key: 'props.src', label: '图片地址' },
    { type: 'input', key: 'props.alt', label: '替代文本' },
    { type: 'input', key: 'props.width', label: '宽度', placeholder: '100% 或 300px', default: '100%' },
    { type: 'input', key: 'props.height', label: '高度', placeholder: 'auto 或 200px', default: 'auto' },
    { type: 'select', key: 'props.objectFit', label: '适应方式', options: objectFitOptions, default: 'cover' },
    { type: 'events', key: 'events', label: '事件', default: {} }
  ],
  divider: [
    { type: 'input', key: 'props.text', label: '文字' },
    { type: 'select', key: 'props.direction', label: '方向', options: directionOptions, default: 'horizontal' },
    { type: 'input', key: 'props.margin', label: '边距', placeholder: '如 16px 0', default: '16px 0' }
  ],
  table: [
    { type: 'input', key: 'props.title', label: '标题', default: '示例表格' },
    { type: 'input', key: 'props.height', label: '高度', placeholder: '如 300px，留空自适应' },
    { type: 'items', key: 'props.columns', label: '列配置（JSON）', placeholder: '[{"prop":"name","label":"名称","width":120}]', default: [] },
    { type: 'dataSource', key: 'dataSource', label: '数据源', default: { type: 'static', value: [] } }
  ],
  list: [
    { type: 'input', key: 'props.itemTitle', label: '标题字段', placeholder: '默认 title', default: 'title' },
    { type: 'input', key: 'props.itemDesc', label: '描述字段', placeholder: '默认 description', default: 'description' },
    { type: 'input', key: 'props.itemIcon', label: '图标字段', placeholder: '默认 icon' },
    { type: 'dataSource', key: 'dataSource', label: '数据源', default: { type: 'static', value: [] } },
    { type: 'events', key: 'events', label: '事件', default: {} }
  ],
  model: [
    { type: 'input', key: 'props.modelCode', label: '模型编码' },
    { type: 'input', key: 'props.height', label: '高度', placeholder: '如 500px', default: '500px' }
  ],
  dashboard: [
    { type: 'input', key: 'props.dashboardCode', label: '仪表盘编码' }
  ],
  report: [
    { type: 'input', key: 'props.reportCode', label: '报表编码' }
  ],
  button: [
    { type: 'input', key: 'props.label', label: '按钮文字', default: '按钮' },
    { type: 'select', key: 'props.type', label: '按钮类型', options: commonTypeOptions, default: 'default' },
    { type: 'events', key: 'events', label: '事件', default: {} }
  ],
  link: [
    { type: 'input', key: 'props.label', label: '链接文字', default: '链接' },
    { type: 'input', key: 'props.path', label: '链接路径' }
  ],
  input: [
    { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
    { type: 'input', key: 'props.label', label: '标签' },
    { type: 'input', key: 'props.placeholder', label: '占位提示', placeholder: '请输入' },
    { type: 'select', key: 'props.type', label: '类型', options: inputTypeOptions, default: 'text' },
    { type: 'input', key: 'props.modelValue', label: '默认值' }
  ],
  select: [
    { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
    { type: 'input', key: 'props.label', label: '标签' },
    { type: 'input', key: 'props.placeholder', label: '占位提示', placeholder: '请选择' },
    { type: 'options', key: 'props.options', label: '选项（JSON）', placeholder: '[{"label":"选项1","value":"1"}]', default: [] },
    { type: 'input', key: 'props.modelValue', label: '默认值' }
  ],
  radio: [
    { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
    { type: 'input', key: 'props.label', label: '标签' },
    { type: 'options', key: 'props.options', label: '选项（JSON）', placeholder: '[{"label":"选项1","value":"1"}]', default: [] },
    { type: 'input', key: 'props.modelValue', label: '默认值' }
  ],
  checkbox: [
    { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
    { type: 'input', key: 'props.label', label: '标签' },
    { type: 'options', key: 'props.options', label: '选项（JSON）', placeholder: '[{"label":"选项1","value":"1"}]', default: [] },
    { type: 'input', key: 'props.modelValue', label: '默认值' }
  ],
  switch: [
    { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
    { type: 'input', key: 'props.label', label: '标签' },
    { type: 'switch', key: 'props.modelValue', label: '默认值', default: false }
  ],
  'date-picker': [
    { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
    { type: 'input', key: 'props.label', label: '标签' },
    { type: 'input', key: 'props.placeholder', label: '占位提示', placeholder: '请选择日期' },
    { type: 'input', key: 'props.modelValue', label: '默认值' }
  ]
}

const componentSchema = computed<PropertySchemaField[]>(() => {
  // 插件组件优先使用自身注册的 propertySchema
  if (pluginComponent.value?.propertySchema) {
    return pluginComponent.value.propertySchema as PropertySchemaField[]
  }
  const base = componentSchemas[props.node.type] || []
  // chart 类型需要动态获取图表类型选项
  if (props.node.type === 'chart') {
    return base.map((field) => {
      if (field.key === 'props.chartType') {
        return { ...field, options: listCharts().map((c) => ({ label: c.label, value: c.type })) }
      }
      return field
    })
  }
  return base
})

const propsText = computed({
  get() {
    return JSON.stringify(props.node.props || {}, null, 2)
  },
  set(value: string) {
    try {
      props.node.props = JSON.parse(value)
      emitUpdate()
    } catch {
      // ignore invalid json
    }
  }
})

function updatePropsText(value: string) {
  propsText.value = value
}
</script>

<style scoped>
.property-editor { padding: 8px 0; }
.section-title { font-weight: bold; margin-bottom: 8px; color: var(--w-text-color-regular); }
</style>
