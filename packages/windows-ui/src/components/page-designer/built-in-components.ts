import { h } from 'vue'
import { registerComponent } from './plugin-manager'
import GenericRender from './generic-render.vue'
import type { PageComponentDefinition, PropertySchemaField } from './types'

function registerBuiltIn(def: {
  type: string
  label: string
  category: PageComponentDefinition['category']
  isContainer?: boolean
  defaultProps?: Record<string, any>
  propertySchema?: PropertySchemaField[]
}) {
  registerComponent({
    type: def.type,
    label: def.label,
    category: def.category,
    isContainer: def.isContainer,
    propertySchema: def.propertySchema,
    defaultNode: () => ({
      type: def.type,
      props: def.defaultProps ?? {},
      styles: {}
    }),
    render: ({ node }) => h(GenericRender, { node })
  })
}

const commonStatusOptions = [
  { label: '信息', value: 'info' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' }
]

// 展示类：直接通过 v-bind 把 node.props 传给真实组件
const displayComponents: {
  type: string
  label: string
  defaultProps?: Record<string, any>
  propertySchema?: PropertySchemaField[]
}[] = [
  {
    type: 'calendar',
    label: '日历',
    defaultProps: {},
    propertySchema: [
      { type: 'input', key: 'props.modelValue', label: '选中日期' },
      { type: 'items', key: 'props.events', label: '事件数据', placeholder: '[{"date":"2026-07-01","title":"事件"}]', default: [] }
    ]
  },
  {
    type: 'carousel',
    label: '轮播',
    defaultProps: {},
    propertySchema: [
      { type: 'items', key: 'props.items', label: '轮播项', placeholder: '[{"src":"图片地址","alt":"描述"}]', default: [] },
      { type: 'input', key: 'props.height', label: '高度', default: '200px' },
      { type: 'switch', key: 'props.autoplay', label: '自动播放', default: true },
      { type: 'number', key: 'props.interval', label: '间隔(ms)', min: 500, step: 500, default: 3000 },
      { type: 'switch', key: 'props.showIndicators', label: '指示器', default: true },
      { type: 'switch', key: 'props.showArrows', label: '箭头', default: true }
    ]
  },
  {
    type: 'descriptions',
    label: '描述列表',
    defaultProps: { title: '描述列表', items: [{ label: '名称', value: '值' }] },
    propertySchema: [
      { type: 'input', key: 'props.title', label: '标题', default: '描述列表' },
      { type: 'items', key: 'props.items', label: '数据项', placeholder: '[{"label":"名称","value":"值"}]', default: [{ label: '名称', value: '值' }] },
      { type: 'number', key: 'props.column', label: '列数', min: 1, max: 6, default: 3 },
      { type: 'switch', key: 'props.border', label: '边框', default: false }
    ]
  },
  {
    type: 'empty',
    label: '空状态',
    defaultProps: { description: '暂无数据' },
    propertySchema: [
      { type: 'input', key: 'props.description', label: '描述', default: '暂无数据' }
    ]
  },
  {
    type: 'pagination',
    label: '分页',
    defaultProps: { total: 100, pageSize: 10 },
    propertySchema: [
      { type: 'number', key: 'props.total', label: '总条数', min: 0, default: 100 },
      { type: 'number', key: 'props.pageSize', label: '每页条数', min: 1, default: 10 },
      { type: 'number', key: 'props.currentPage', label: '当前页', min: 1, default: 1 },
      { type: 'items', key: 'props.pageSizes', label: '每页条数选项', placeholder: '[10,20,50,100]', default: [10, 20, 50, 100] }
    ]
  },
  {
    type: 'result',
    label: '结果页',
    defaultProps: { icon: 'info', title: '结果标题', subTitle: '' },
    propertySchema: [
      { type: 'select', key: 'props.status', label: '状态', options: commonStatusOptions },
      { type: 'input', key: 'props.icon', label: '图标', default: 'info' },
      { type: 'input', key: 'props.title', label: '标题', default: '结果标题' },
      { type: 'input', key: 'props.subtitle', label: '副标题', default: '' }
    ]
  },
  {
    type: 'skeleton',
    label: '骨架屏',
    defaultProps: { rows: 3 },
    propertySchema: [
      { type: 'number', key: 'props.rows', label: '行数', min: 1, max: 20, default: 3 },
      { type: 'switch', key: 'props.animated', label: '动画', default: true },
      { type: 'switch', key: 'props.loading', label: '加载中', default: true }
    ]
  },
  {
    type: 'segmented',
    label: '分段控制器',
    defaultProps: { options: ['日', '周', '月'] },
    propertySchema: [
      { type: 'options', key: 'props.options', label: '选项', placeholder: '["日","周","月"] 或 [{"label":"日","value":"day"}]', default: ['日', '周', '月'] },
      { type: 'input', key: 'props.modelValue', label: '当前值' }
    ]
  },
  {
    type: 'tree',
    label: '树',
    defaultProps: { data: [] },
    propertySchema: [
      { type: 'items', key: 'props.data', label: '树数据', placeholder: '[{"label":"节点","value":"1","children":[]}]', default: [] },
      { type: 'switch', key: 'props.expandAll', label: '展开全部', default: false }
    ]
  },
  {
    type: 'tour',
    label: '引导',
    defaultProps: {},
    propertySchema: [
      { type: 'items', key: 'props.steps', label: '步骤', placeholder: '[{"title":"标题","description":"描述","target":"#id"}]', default: [] },
      { type: 'switch', key: 'props.visible', label: '显示', default: false }
    ]
  }
]

// 表单类
const formComponents: {
  type: string
  label: string
  defaultProps?: Record<string, any>
  propertySchema?: PropertySchemaField[]
}[] = [
  {
    type: 'autocomplete',
    label: '自动补全',
    defaultProps: { placeholder: '请输入' },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.placeholder', label: '占位提示', default: '请输入' },
      { type: 'options', key: 'props.options', label: '选项', placeholder: '[{"label":"选项","value":"1"}]', default: [] },
      { type: 'switch', key: 'props.clearable', label: '可清空', default: true },
      { type: 'input', key: 'props.modelValue', label: '当前值' }
    ]
  },
  {
    type: 'cascader',
    label: '级联选择',
    defaultProps: { options: [], placeholder: '请选择' },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.placeholder', label: '占位提示', default: '请选择' },
      { type: 'items', key: 'props.options', label: '选项', placeholder: '[{"label":"省","value":"1","children":[]}]', default: [] },
      { type: 'switch', key: 'props.clearable', label: '可清空', default: true },
      { type: 'input', key: 'props.modelValue', label: '当前值' }
    ]
  },
  {
    type: 'color-picker',
    label: '颜色选择器',
    defaultProps: {},
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'color', key: 'props.modelValue', label: '颜色' }
    ]
  },
  {
    type: 'date-time-picker',
    label: '日期时间选择',
    defaultProps: { placeholder: '请选择' },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.placeholder', label: '占位提示', default: '选择日期时间' },
      { type: 'switch', key: 'props.clearable', label: '可清空', default: true },
      { type: 'input', key: 'props.modelValue', label: '当前值' }
    ]
  },
  {
    type: 'input-number',
    label: '数字输入',
    defaultProps: { placeholder: '请输入数字' },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.placeholder', label: '占位提示', default: '请输入数字' },
      { type: 'number', key: 'props.min', label: '最小值' },
      { type: 'number', key: 'props.max', label: '最大值' },
      { type: 'number', key: 'props.step', label: '步长', default: 1 },
      { type: 'switch', key: 'props.clearable', label: '可清空', default: true },
      { type: 'switch', key: 'props.disabled', label: '禁用', default: false },
      { type: 'number', key: 'props.modelValue', label: '当前值' }
    ]
  },
  {
    type: 'input-tag',
    label: '标签输入',
    defaultProps: { placeholder: '请输入标签' },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.placeholder', label: '占位提示', default: '请输入标签' },
      { type: 'number', key: 'props.max', label: '最大数量', min: 1 },
      { type: 'switch', key: 'props.clearable', label: '可清空', default: true },
      { type: 'items', key: 'props.modelValue', label: '当前值', placeholder: '["标签1","标签2"]', default: [] }
    ]
  },
  {
    type: 'input-otp',
    label: '验证码输入',
    defaultProps: {},
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'number', key: 'props.length', label: '长度', min: 1, max: 12, default: 6 },
      { type: 'switch', key: 'props.clearable', label: '可清空', default: true },
      { type: 'input', key: 'props.modelValue', label: '当前值' }
    ]
  },
  {
    type: 'mention',
    label: '提及输入',
    defaultProps: { placeholder: '@某人' },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.placeholder', label: '占位提示', default: '@某人' },
      { type: 'input', key: 'props.prefix', label: '触发前缀', default: '@' },
      { type: 'options', key: 'props.options', label: '候选选项', placeholder: '[{"label":"张三","value":"zs"}]', default: [] },
      { type: 'input', key: 'props.modelValue', label: '当前值' }
    ]
  },
  {
    type: 'rate',
    label: '评分',
    defaultProps: { modelValue: 0 },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'number', key: 'props.max', label: '最大分值', min: 1, max: 10, default: 5 },
      { type: 'switch', key: 'props.disabled', label: '禁用', default: false },
      { type: 'switch', key: 'props.showScore', label: '显示分数', default: false },
      { type: 'number', key: 'props.modelValue', label: '当前值', min: 0, default: 0 }
    ]
  },
  {
    type: 'slider',
    label: '滑块',
    defaultProps: { modelValue: 0 },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'number', key: 'props.min', label: '最小值', default: 0 },
      { type: 'number', key: 'props.max', label: '最大值', default: 100 },
      { type: 'number', key: 'props.step', label: '步长', default: 1 },
      { type: 'switch', key: 'props.showStops', label: '显示断点', default: false },
      { type: 'switch', key: 'props.showMinMax', label: '显示最值', default: false },
      { type: 'switch', key: 'props.disabled', label: '禁用', default: false },
      { type: 'number', key: 'props.modelValue', label: '当前值', default: 0 }
    ]
  },
  {
    type: 'time-picker',
    label: '时间选择',
    defaultProps: { placeholder: '请选择时间' },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.placeholder', label: '占位提示', default: '选择时间' },
      { type: 'switch', key: 'props.clearable', label: '可清空', default: true },
      { type: 'input', key: 'props.modelValue', label: '当前值' }
    ]
  },
  {
    type: 'time-select',
    label: '时间选择（固定选项）',
    defaultProps: { placeholder: '请选择' },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.placeholder', label: '占位提示', default: '请选择' },
      { type: 'input', key: 'props.start', label: '开始时间', default: '00:00' },
      { type: 'input', key: 'props.end', label: '结束时间', default: '23:59' },
      { type: 'input', key: 'props.step', label: '步长', default: '00:30' },
      { type: 'input', key: 'props.modelValue', label: '当前值' }
    ]
  },
  {
    type: 'transfer',
    label: '穿梭框',
    defaultProps: { data: [] },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'items', key: 'props.data', label: '数据', placeholder: '[{"key":"1","label":"选项"}]', default: [] },
      { type: 'input', key: 'props.leftTitle', label: '左侧标题', default: '待选' },
      { type: 'input', key: 'props.rightTitle', label: '右侧标题', default: '已选' },
      { type: 'items', key: 'props.modelValue', label: '已选值', placeholder: '["1","2"]', default: [] }
    ]
  },
  {
    type: 'tree-select',
    label: '树选择',
    defaultProps: { data: [], placeholder: '请选择' },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.placeholder', label: '占位提示', default: '请选择' },
      { type: 'items', key: 'props.data', label: '树数据', placeholder: '[{"label":"节点","value":"1","children":[]}]', default: [] },
      { type: 'switch', key: 'props.expandAll', label: '展开全部', default: false },
      { type: 'switch', key: 'props.clearable', label: '可清空', default: true },
      { type: 'input', key: 'props.modelValue', label: '当前值' }
    ]
  },
  {
    type: 'upload',
    label: '上传',
    defaultProps: {},
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.action', label: '上传地址' },
      { type: 'input', key: 'props.accept', label: '接受文件类型', placeholder: '如 .jpg,.png' },
      { type: 'switch', key: 'props.multiple', label: '多选', default: false },
      { type: 'input', key: 'props.buttonText', label: '按钮文字', default: '选择文件' }
    ]
  },
  {
    type: 'rich-text',
    label: '富文本',
    defaultProps: { modelValue: '' },
    propertySchema: [
      { type: 'input', key: 'props.field', label: '绑定字段', placeholder: 'formData 中的键名' },
      { type: 'input', key: 'props.placeholder', label: '占位提示', default: '请输入内容' },
      { type: 'switch', key: 'props.plainText', label: '纯文本模式', default: false },
      { type: 'switch', key: 'props.disabled', label: '禁用', default: false },
      { type: 'textarea', key: 'props.modelValue', label: '内容', rows: 4, default: '' }
    ]
  }
]

displayComponents.forEach((c) => registerBuiltIn({ ...c, category: 'display' }))
formComponents.forEach((c) => registerBuiltIn({ ...c, category: 'form' }))
