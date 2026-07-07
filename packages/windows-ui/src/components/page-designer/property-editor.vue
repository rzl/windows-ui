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
import { getPropertySchema } from './property-schemas'
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

const componentSchema = computed<PropertySchemaField[]>(() => {
  // 插件组件优先使用自身注册的 propertySchema
  if (pluginComponent.value?.propertySchema) {
    return pluginComponent.value.propertySchema as PropertySchemaField[]
  }
  const base = getPropertySchema(props.node.type) || []
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
