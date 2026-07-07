import type { PropertySchemaField } from '../types'

export const typeLabelMap: Record<string, string> = {
  container: '容器',
  card: '卡片',
  row: '栅格',
  col: '列',
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

export function getTypeLabel(type: string): string {
  return typeLabelMap[type] || type
}

export const styleGroupName = '外观'

export const groupIconMap: Record<string, string> = {
  [styleGroupName]: 'style',
  常规: 'settings',
  布局: 'layout',
  数据: 'database',
  事件: 'lightning',
  文本: 'font',
  图片: 'image',
  图表: 'chart',
  高级: 'tools'
}

export function getGroupIcon(name: string): string {
  return groupIconMap[name] || 'settings'
}

export const styleSchema: PropertySchemaField[] = [
  { type: 'input', key: 'styles.width', label: '宽度', placeholder: '如 100% 或 300px', group: styleGroupName },
  { type: 'input', key: 'styles.margin', label: '外边距', placeholder: '如 16px 或 8px 12px', group: styleGroupName },
  { type: 'input', key: 'styles.padding', label: '内边距', placeholder: '如 16px 或 8px 12px', group: styleGroupName },
  { type: 'color', key: 'styles.backgroundColor', label: '背景色', group: styleGroupName },
  { type: 'color', key: 'styles.color', label: '文字颜色', group: styleGroupName },
  { type: 'input', key: 'styles.fontSize', label: '字体大小', placeholder: '如 14px', group: styleGroupName },
  { type: 'input', key: 'styles.borderRadius', label: '圆角', placeholder: '如 4px', group: styleGroupName },
  {
    type: 'select',
    key: 'styles.textAlign',
    label: '对齐',
    options: [
      { label: '默认', value: '' },
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' }
    ],
    group: styleGroupName
  }
]
