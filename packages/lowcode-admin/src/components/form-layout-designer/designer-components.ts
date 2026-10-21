// 表单布局设计器专用节点类型注册：
//   form-field    模型字段（叶子，属性面板下拉选择模型字段）
//   form-grid     字段栅格（N 列，对应 FormLayout grid）
//   form-subtable 子表（对应 FormLayout subtable）
// fieldset / tabs 复用页面设计器内置 card / tabs，画布与预览无需额外处理。
// 注册依赖当前模型的字段元数据（context），因此每次打开设计器时需重新调用注册函数。
import { h } from 'vue'
import type { VNode } from 'vue'
import {
  WCascader,
  WCard,
  WCheckbox,
  WDatePicker,
  WDateTimePicker,
  WInput,
  WInputNumber,
  WRadio,
  WSelect,
  WSwitch,
  WTable,
  WTabs,
  WUpload,
  registerComponent,
  unregisterComponent
} from '@windows-ui/core'
import type { PageNode, PropertySchemaField } from '@windows-ui/core'
import { getFormLayoutDesignContext } from './context'
import type { FormLayoutFieldMeta } from './context'

export const FORM_LAYOUT_COMPONENT_TYPES = ['form-field', 'form-grid', 'form-subtable']

function fieldOptions(): PropertySchemaField['options'] {
  return getFormLayoutDesignContext().formFields.map((f) => ({
    label: `${f.label}（${f.field}）`,
    value: f.field
  }))
}

function modelOptions(): PropertySchemaField['options'] {
  return [{ label: '请选择', value: '' }, ...getFormLayoutDesignContext().models]
}

function findFieldMeta(field: unknown): FormLayoutFieldMeta | undefined {
  return getFormLayoutDesignContext().formFields.find((f) => f.field === field)
}

function renderFieldPreview(node: PageNode) {
  const field = node.props?.field
  const meta = findFieldMeta(field)
  const label = meta?.label || field || '未绑定字段'
  return h('div', { class: 'w-fl-field' }, [
    h('div', { class: 'w-fl-field__label' }, [
      meta?.required ? h('span', { class: 'is-required' }, '*') : null,
      label
    ]),
    meta ? renderFieldControl(meta) : h('div', { class: 'w-fl-field__missing' }, '未绑定模型字段，请在右侧属性面板选择')
  ])
}

function renderFieldControl(meta: FormLayoutFieldMeta) {
  const common = { modelValue: undefined, disabled: true, placeholder: '表单控件预览' }
  switch (meta.type) {
    case 'textarea':
      return h(WInput, { ...common, type: 'textarea', rows: 2 })
    case 'number':
      return h(WInputNumber, common)
    case 'switch':
      return h('div', [h(WSwitch, { modelValue: false, disabled: true })])
    case 'date':
      return h(WDatePicker, common)
    case 'datetime':
      return h(WDateTimePicker, common)
    case 'select':
    case 'ref':
      return h(WSelect, { ...common, options: meta.type === 'select' ? meta.options || [] : [], filterable: meta.type === 'ref' })
    case 'radio':
      return h('div', { class: 'w-fl-field__options' },
        (meta.options || []).map((opt) => h(WRadio, { modelValue: '', label: opt.value, disabled: true }, () => opt.label)))
    case 'checkbox':
      return h('div', { class: 'w-fl-field__options' },
        (meta.options || []).map((opt) => h(WCheckbox, { modelValue: [], label: opt.value, disabled: true }, () => opt.label)))
    case 'cascader':
      return h(WCascader, { ...common, options: meta.options || [] })
    case 'upload':
      return h(WUpload, { disabled: true, buttonText: '选择文件' })
    case 'rich-text':
      return h('div', { class: 'w-fl-field__missing' }, '富文本控件')
    default:
      return h(WInput, common)
  }
}

function renderSubtablePreview(node: PageNode) {
  const columns = (node.props?.columns || []).map((col: any) => ({
    prop: col.field,
    label: col.label || col.field
  }))
  return h(WCard, { header: node.props?.title || '子表' }, () => [
    h(WTable, { data: [], columns, stripe: true, border: true }),
    h('div', { class: 'w-fl-subtable-tip' }, `子表字段：${node.props?.field || '未绑定'}，运行时可在表格中增删行`)
  ])
}

/** 画布/预览递归渲染：处理表单布局专用类型，内置 card / tabs 手动渲染以支持嵌套在栅格内 */
function renderFormLayoutNode(node: PageNode): VNode {
  switch (node.type) {
    case 'form-field':
      return renderFieldPreview(node)
    case 'form-subtable':
      return renderSubtablePreview(node)
    case 'form-grid':
      return h('div', {
        class: 'w-fl-grid',
        style: {
          display: 'grid',
          gridTemplateColumns: `repeat(${node.props?.span || 2}, 1fr)`,
          gap: '12px'
        }
      }, (node.children || []).map(renderFormLayoutNode))
    case 'card':
      return h(WCard, { header: node.props?.title || '分组' }, () => (node.children || []).map(renderFormLayoutNode))
    case 'tabs': {
      const tabs = (node.props?.tabs || []).map((t: any) => ({ label: t.label || t.title || t.name, name: t.name }))
      return h(WTabs, { tabs, modelValue: 0 }, {
        default: ({ active }: { active: number }) => {
          const tab = tabs[active]
          const children = (node.children || []).filter((c) => (c.tab || tabs[0]?.name) === tab?.name)
          return h('div', children.map(renderFormLayoutNode))
        }
      })
    }
    default:
      return h('div', { class: 'w-fl-field__missing' }, `该组件类型（${node.type}）在表单布局预览中不支持`)
  }
}

export function registerFormLayoutComponents() {
  registerComponent({
    type: 'form-field',
    label: '模型字段',
    category: 'form',
    defaultNode: () => ({
      type: 'form-field',
      props: { field: getFormLayoutDesignContext().formFields[0]?.field || '' },
      styles: {}
    }),
    render: ({ node }) => renderFormLayoutNode(node),
    propertySchema: [
      { type: 'select', key: 'props.field', label: '绑定字段', options: fieldOptions(), placeholder: '请选择模型字段' }
    ]
  })

  registerComponent({
    type: 'form-grid',
    label: '字段栅格',
    category: 'layout',
    isContainer: true,
    defaultNode: () => ({
      type: 'form-grid',
      props: { span: 2 },
      styles: {},
      children: []
    }),
    render: ({ node }) => renderFormLayoutNode(node),
    propertySchema: [
      { type: 'number', key: 'props.span', label: '列数', min: 1, max: 6, step: 1, default: 2 }
    ]
  })

  registerComponent({
    type: 'form-subtable',
    label: '子表',
    category: 'form',
    defaultNode: () => ({
      type: 'form-subtable',
      props: { field: '', title: '子表', columns: [{ field: '', label: '' }], subModelCode: '', foreignField: '', localField: '' },
      styles: {}
    }),
    render: ({ node }) => renderFormLayoutNode(node),
    propertySchema: [
      { type: 'select', key: 'props.field', label: '绑定字段', options: fieldOptions(), placeholder: '请选择模型字段' },
      { type: 'input', key: 'props.title', label: '子表标题', default: '子表' },
      {
        type: 'items',
        key: 'props.columns',
        label: '列配置',
        columns: [
          { key: 'field', label: '字段名' },
          { key: 'label', label: '列标题' },
          { key: 'width', label: '列宽', type: 'number' }
        ],
        default: []
      },
      { type: 'select', key: 'props.subModelCode', label: '关联模型', options: modelOptions() },
      { type: 'input', key: 'props.foreignField', label: '外键字段', placeholder: '子表模型的外键字段' },
      { type: 'input', key: 'props.localField', label: '本地字段', placeholder: '主表的关联字段' }
    ]
  })
}

export function unregisterFormLayoutComponents() {
  for (const type of FORM_LAYOUT_COMPONENT_TYPES) {
    unregisterComponent(type)
  }
}
