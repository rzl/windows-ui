import { getChart, listComponents } from '../plugin-manager'
import type { PageNode } from '../types'

export function generateId() {
  return `comp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export function createDefaultComponent(type: string): PageNode {
  const pluginDef = listComponents().find((c) => c.type === type)
  if (pluginDef) {
    return { id: generateId(), ...pluginDef.defaultNode() }
  }

  const base: PageNode = {
    id: generateId(),
    type,
    props: {},
    styles: {}
  }

  switch (type) {
    case 'container':
      return { ...base, props: { padding: '12px' }, children: [] }
    case 'card':
      return { ...base, props: { title: '卡片标题' }, children: [] }
    case 'row':
      return { ...base, props: { columns: 2, gap: '12px' }, children: [] }
    case 'tabs':
      return { ...base, props: { tabs: [{ title: '标签1', name: 'tab1' }] }, children: [] }
    case 'text':
      return { ...base, props: { content: '这是一段文本', tag: 'p', align: 'left' } }
    case 'statistic':
      return { ...base, props: { title: '统计标题', field: 'value', icon: 'star', color: 'primary' }, dataSource: { type: 'static', value: 0 } }
    case 'chart': {
      const chartPlugin = getChart('echarts')
      return { ...base, props: { height: '300px', chartType: 'echarts' }, dataSource: { type: 'static' }, option: chartPlugin ? chartPlugin.defaultOption() : {} }
    }
    case 'alert':
      return { ...base, props: { content: '公告内容', type: 'info' } }
    case 'tag':
      return { ...base, props: { label: '标签', type: 'default' } }
    case 'progress':
      return { ...base, props: { percentage: 50, status: '', width: 200, showText: true } }
    case 'avatar':
      return { ...base, props: { src: '', alt: '用户', icon: 'user', shape: 'circle' } }
    case 'badge':
      return { ...base, props: { text: '徽标', value: 5, isDot: false, type: 'danger' } }
    case 'steps':
      return { ...base, props: { items: [{ title: '步骤1' }, { title: '步骤2' }, { title: '步骤3' }], active: 1 } }
    case 'timeline':
      return { ...base, props: { items: [{ time: '2026-07-01', title: '事件1', content: '描述内容', color: '#245edb' }, { time: '2026-07-02', title: '事件2' }] } }
    case 'image':
      return { ...base, props: { src: '', alt: '', width: '100%', height: 'auto', objectFit: 'cover' } }
    case 'divider':
      return { ...base, props: { text: '', direction: 'horizontal', margin: '16px 0' } }
    case 'table':
      return { ...base, props: { title: '表格', columns: [{ prop: 'name', label: '名称' }, { prop: 'value', label: '值' }], height: '' }, dataSource: { type: 'static', value: [] } }
    case 'list':
      return { ...base, props: { itemTitle: 'title', itemDesc: 'description', itemIcon: 'file' }, dataSource: { type: 'static', value: [] } }
    case 'model':
      return { ...base, props: { modelCode: '', height: '500px' } }
    case 'dashboard':
      return { ...base, props: { dashboardCode: '' } }
    case 'report':
      return { ...base, props: { reportCode: '' } }
    case 'button':
      return { ...base, props: { label: '按钮', type: 'default' }, events: { onClick: { action: 'navigate', target: '' } } }
    case 'link':
      return { ...base, props: { label: '链接', path: '' } }
    case 'input':
      return { ...base, props: { label: '输入框', placeholder: '请输入', type: 'text', modelValue: '' } }
    case 'select':
      return { ...base, props: { label: '选择器', placeholder: '请选择', options: [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }], modelValue: '' } }
    case 'radio':
      return { ...base, props: { label: '单选框', options: [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }], modelValue: '' } }
    case 'checkbox':
      return { ...base, props: { label: '多选框', options: [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }], modelValue: [] } }
    case 'date-picker':
      return { ...base, props: { label: '日期', placeholder: '请选择日期', modelValue: '' } }
    case 'switch':
      return { ...base, props: { label: '开关', modelValue: false } }
    default:
      return base
  }
}
