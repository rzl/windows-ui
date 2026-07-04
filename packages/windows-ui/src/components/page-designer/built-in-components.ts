import { h } from 'vue'
import { registerComponent } from './plugin-manager'
import GenericRender from './generic-render.vue'
import type { PageComponentDefinition } from './types'

function registerBuiltIn(def: {
  type: string
  label: string
  category: PageComponentDefinition['category']
  isContainer?: boolean
  defaultProps?: Record<string, any>
}) {
  registerComponent({
    type: def.type,
    label: def.label,
    category: def.category,
    isContainer: def.isContainer,
    defaultNode: () => ({
      type: def.type,
      props: def.defaultProps ?? {},
      styles: {}
    }),
    render: ({ node }) => h(GenericRender, { node })
  })
}

// 展示类：直接通过 v-bind 把 node.props 传给真实组件
const displayComponents: { type: string; label: string; defaultProps?: Record<string, any> }[] = [
  { type: 'calendar', label: '日历', defaultProps: {} },
  { type: 'carousel', label: '轮播', defaultProps: {} },
  { type: 'descriptions', label: '描述列表', defaultProps: { title: '描述列表', items: [{ label: '名称', value: '值' }] } },
  { type: 'empty', label: '空状态', defaultProps: { description: '暂无数据' } },
  { type: 'pagination', label: '分页', defaultProps: { total: 100, pageSize: 10 } },
  { type: 'result', label: '结果页', defaultProps: { icon: 'info', title: '结果标题', subTitle: '' } },
  { type: 'skeleton', label: '骨架屏', defaultProps: { rows: 3 } },
  { type: 'segmented', label: '分段控制器', defaultProps: { options: ['日', '周', '月'] } },
  { type: 'tree', label: '树', defaultProps: { data: [] } },
  { type: 'tour', label: '引导', defaultProps: {} }
]

// 表单类
const formComponents: { type: string; label: string; defaultProps?: Record<string, any> }[] = [
  { type: 'autocomplete', label: '自动补全', defaultProps: { placeholder: '请输入' } },
  { type: 'cascader', label: '级联选择', defaultProps: { options: [], placeholder: '请选择' } },
  { type: 'color-picker', label: '颜色选择器', defaultProps: {} },
  { type: 'date-time-picker', label: '日期时间选择', defaultProps: { placeholder: '请选择' } },
  { type: 'input-number', label: '数字输入', defaultProps: { placeholder: '请输入数字' } },
  { type: 'input-tag', label: '标签输入', defaultProps: { placeholder: '请输入标签' } },
  { type: 'input-otp', label: '验证码输入', defaultProps: {} },
  { type: 'mention', label: '提及输入', defaultProps: { placeholder: '@某人' } },
  { type: 'rate', label: '评分', defaultProps: { modelValue: 0 } },
  { type: 'slider', label: '滑块', defaultProps: { modelValue: 0 } },
  { type: 'time-picker', label: '时间选择', defaultProps: { placeholder: '请选择时间' } },
  { type: 'time-select', label: '时间选择（固定选项）', defaultProps: { placeholder: '请选择' } },
  { type: 'transfer', label: '穿梭框', defaultProps: { data: [] } },
  { type: 'tree-select', label: '树选择', defaultProps: { data: [], placeholder: '请选择' } },
  { type: 'upload', label: '上传', defaultProps: {} },
  { type: 'rich-text', label: '富文本', defaultProps: { modelValue: '' } }
]

displayComponents.forEach((c) => registerBuiltIn({ ...c, category: 'display' }))
formComponents.forEach((c) => registerBuiltIn({ ...c, category: 'form' }))
