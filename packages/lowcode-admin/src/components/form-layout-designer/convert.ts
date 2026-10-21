// 旧版 FormLayout → 页面设计器节点树的单向迁移转换。
// 布局设计器现在直接保存 PageNode 树（PageFormLayout），运行时由 dynamic-form 的
// PageNode 引擎渲染；本模块仅在打开设计器时把历史遗留的 FormLayout 迁移为节点树。
// 映射约定：
//   FormLayout root        → 画布 components 数组
//   FormLayout fieldset    → PageNode card（props.title）
//   FormLayout tabs        → PageNode tabs（props.tabs + 子节点 tab 属性关联）
//   FormLayout grid        → PageNode form-grid（props.span，N 列栅格）
//   FormLayout subtable    → PageNode form-subtable
//   FormLayout 字符串叶子   → PageNode form-field（props.field）
import type { FormLayout, PageNode } from '@windows-ui/core'
import { getFormLayoutDesignContext } from './context'

let idSeed = 0
function nextId() {
  idSeed += 1
  return `flayout_${Date.now()}_${idSeed}`
}

/** 把模型的旧版 FormLayout 布局迁移为画布 components；无布局时按当前表单字段生成两列默认布局 */
export function formLayoutToComponents(layout: FormLayout | undefined | null): PageNode[] {
  const children = layout?.children
  if (!children?.length) {
    const { formFields } = getFormLayoutDesignContext()
    return [{
      id: nextId(),
      type: 'form-grid',
      props: { span: 2 },
      styles: {},
      children: formFields.map((f) => ({
        id: nextId(),
        type: 'form-field',
        props: { field: f.field },
        styles: {}
      }))
    }]
  }
  return children.map(toPageNode)
}

function toPageNode(node: FormLayout | string): PageNode {
  if (typeof node === 'string') {
    return { id: nextId(), type: 'form-field', props: { field: node }, styles: {} }
  }
  if (node.type === 'fieldset') {
    return {
      id: nextId(),
      type: 'card',
      props: { title: node.title || '分组' },
      styles: {},
      children: (node.children || []).map(toPageNode)
    }
  }
  if (node.type === 'tabs') {
    const tabs = (node.tabs || []).map((tab) => ({
      label: tab.title || tab.name,
      name: tab.name
    }))
    const children: PageNode[] = []
    for (const tab of node.tabs || []) {
      for (const child of tab.children || []) {
        const childNode = toPageNode(child)
        childNode.tab = tab.name
        children.push(childNode)
      }
    }
    return {
      id: nextId(),
      type: 'tabs',
      props: { tabs, modelValue: tabs[0]?.name ?? '' },
      styles: {},
      children
    }
  }
  if (node.type === 'grid') {
    return {
      id: nextId(),
      type: 'form-grid',
      props: { span: node.span || 2 },
      styles: {},
      children: (node.children || []).map(toPageNode)
    }
  }
  if (node.type === 'subtable') {
    return {
      id: nextId(),
      type: 'form-subtable',
      props: {
        field: node.field || '',
        title: node.title || '子表',
        columns: node.columns || [],
        subModelCode: node.subModelCode || '',
        foreignField: node.foreignField || '',
        localField: node.localField || ''
      },
      styles: {}
    }
  }
  // 未知 FormLayout 节点：转为占位节点，运行时会被 PageNode 引擎跳过
  return {
    id: nextId(),
    type: `unknown:${node.type || 'root'}`,
    props: {},
    styles: {}
  }
}
