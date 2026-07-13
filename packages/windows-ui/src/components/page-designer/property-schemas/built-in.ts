import type { PropertySchemaField } from '../types'

export const commonTypeOptions = [
  { label: '默认', value: 'default' },
  { label: '主要', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' }
]

export const noticeTypeOptions = [
  { label: '信息', value: 'info' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '错误', value: 'error' }
]

export const alignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
]

export const tagOptions = [
  { label: '段落 p', value: 'p' },
  { label: '标题 h1', value: 'h1' },
  { label: '标题 h2', value: 'h2' },
  { label: '标题 h3', value: 'h3' },
  { label: '标题 h4', value: 'h4' },
  { label: 'div', value: 'div' },
  { label: 'span', value: 'span' }
]

export const objectFitOptions = [
  { label: '覆盖', value: 'cover' },
  { label: '包含', value: 'contain' },
  { label: '填充', value: 'fill' },
  { label: '原始大小', value: 'none' }
]

export const inputTypeOptions = [
  { label: '文本', value: 'text' },
  { label: '密码', value: 'password' },
  { label: '数字', value: 'number' },
  { label: '多行文本', value: 'textarea' }
]

export const directionOptions = [
  { label: '水平', value: 'horizontal' },
  { label: '垂直', value: 'vertical' }
]

export const progressStatusOptions = [
  { label: '默认', value: '' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' }
]

export const avatarShapeOptions = [
  { label: '圆形', value: 'circle' },
  { label: '方形', value: 'square' }
]

export const builtInPropertySchemas: Record<string, PropertySchemaField[]> = {
  container: [
    { type: 'input', key: 'props.padding', label: '内边距', placeholder: '如 12px', default: '12px' }
  ],
  card: [
    { type: 'input', key: 'props.title', label: '标题', default: '卡片标题' }
  ],
  row: [
    { type: 'number', key: 'props.gutter', label: '栅格间隔', min: 0, max: 48, default: 16 },
    { type: 'select', key: 'props.type', label: '布局类型', options: [{ label: '普通', value: '' }, { label: 'Flex', value: 'flex' }], default: '' },
    { type: 'select', key: 'props.justify', label: '水平排列', options: [{ label: '默认', value: '' }, { label: '起始', value: 'start' }, { label: '居中', value: 'center' }, { label: '末尾', value: 'end' }, { label: '两端对齐', value: 'space-between' }, { label: '间隔对齐', value: 'space-around' }], default: '' },
    { type: 'select', key: 'props.align', label: '垂直对齐', options: [{ label: '默认', value: '' }, { label: '顶部', value: 'top' }, { label: '居中', value: 'middle' }, { label: '底部', value: 'bottom' }], default: '' },
    { type: 'switch', key: 'props.wrap', label: '自动换行', default: true }
  ],
  col: [
    { type: 'number', key: 'props.span', label: '占据列数', min: 1, max: 24, default: 12 },
    { type: 'number', key: 'props.offset', label: '偏移列数', min: 0, max: 24, default: 0 }
  ],
  tabs: [
    { type: 'items', key: 'props.tabs', label: '标签配置（JSON）', placeholder: '[{"label":"标签1","name":"tab1"}]', default: [] },
    { type: 'input', key: 'props.modelValue', label: '当前激活项', placeholder: '对应标签的 name' }
  ],
  collapse: [
    { type: 'switch', key: 'props.accordion', label: '手风琴模式', default: false }
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
