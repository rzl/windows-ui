// PageNode 布局桥接：把页面设计器节点树接入 WDynamicForm。
// 设计原则：不再维护独立的白名单渲染器——
//   - form-field / form-grid / form-subtable 注册为页面设计器插件组件，
//     渲染时桥接到 dynamic-form 的字段运行时（校验 / 联动 / 选项 / 默认值 / 编码）；
//   - 其余全部节点（内置组件与插件市场注册的自定义组件）委托给页面设计器渲染器
//     render-component，并注入以表单记录为 formData 的 PageContext，
//     因此渲染器的全部能力（静态组件 / 表单控件 / 图表 / iframe 嵌入 / 事件）均可在表单布局中使用。
import { h, inject, provide, ref, type VNode } from 'vue'
import RenderComponent from '../page-designer/render-component.vue'
import { registerComponent } from '../page-designer/plugin-manager'
import type { PageNode } from '../page-designer/types'
import type { DynamicFieldRuntime } from './form-runtime'
import { renderSubTableEditor } from './form-runtime'

/** 页面设计器形态的表单布局（与 legacy FormLayout 通过 components 字段区分） */
export interface PageFormLayout {
  components: PageNode[]
}

/** 判断 layout 是否为页面设计器 schema（否则为 legacy FormLayout 或空） */
export function isPageNodeLayout(layout: unknown): layout is PageFormLayout {
  return !!layout && typeof layout === 'object' && Array.isArray((layout as any).components)
}

/** 表单布局桥接上下文：字段运行时 + 表单记录 + 响应式栅格参数 */
export interface DynamicFormBridge {
  runtime: DynamicFieldRuntime
  model: Record<string, any>
  isMobile: () => boolean
  columns: () => number
  mobileColumns: () => number
}

const BRIDGE_KEY = 'wDynamicFormBridge'

/** 在 WDynamicForm setup 中调用，向布局树内的桥接组件提供字段运行时 */
export function provideDynamicFormBridge(bridge: DynamicFormBridge) {
  provide(BRIDGE_KEY, bridge)
}

function useBridge(): DynamicFormBridge | null {
  return inject<DynamicFormBridge | null>(BRIDGE_KEY, null)
}

/** 模型字段节点：委托字段运行时渲染（label / 必填星号 / 控件 / 校验错误） */
const FormFieldNode = {
  name: 'WFormPageFieldNode',
  props: { node: { type: Object as () => PageNode, required: true } },
  setup(nodeProps: { node: PageNode }) {
    return () => {
      const bridge = useBridge()
      if (!bridge) {
        return h('div', { class: 'w-dynamic-form__unsupported' }, '模型字段节点仅在动态表单布局中渲染')
      }
      return bridge.runtime.renderFieldItem(String(nodeProps.node.props?.field || ''))
    }
  }
}

/** 字段栅格节点：N 列响应式栅格，子节点递归走任意节点渲染 */
const FormGridNode = {
  name: 'WFormPageGridNode',
  props: { node: { type: Object as () => PageNode, required: true } },
  setup(nodeProps: { node: PageNode }) {
    return () => {
      const bridge = useBridge()
      if (!bridge) {
        return h('div', { class: 'w-dynamic-form__unsupported' }, '字段栅格节点仅在动态表单布局中渲染')
      }
      const columns = bridge.isMobile()
        ? bridge.mobileColumns()
        : (Number(nodeProps.node.props?.span) || bridge.columns())
      const children = (nodeProps.node.children || [])
        .map((child) => h(PageNodeAny, { node: child, key: child.id }))
      return h('div', {
        class: 'w-dynamic-form__grid',
        style: {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: bridge.isMobile() ? '8px' : '12px'
        }
      }, children)
    }
  }
}

/** 子表节点：委托共享的子表编辑器 */
const FormSubtableNode = {
  name: 'WFormPageSubtableNode',
  props: { node: { type: Object as () => PageNode, required: true } },
  setup(nodeProps: { node: PageNode }) {
    return () => {
      const bridge = useBridge()
      const field = nodeProps.node.props?.field
      if (!bridge || !field) {
        return h('div', { class: 'w-dynamic-form__unsupported' }, '子表节点仅在动态表单布局中渲染')
      }
      return renderSubTableEditor({
        model: bridge.model,
        field: String(field),
        title: nodeProps.node.props?.title,
        columns: nodeProps.node.props?.columns || []
      })
    }
  }
}

/** 任意节点：表单专用类型走桥接组件，其余委托页面设计器渲染器 */
const PageNodeAny = {
  name: 'WFormPageNode',
  props: { node: { type: Object as () => PageNode, required: true } },
  setup(nodeProps: { node: PageNode }) {
    return () => {
      // 前置重断言：设计器关闭时会注销同名设计时组件，保证 render-component
      // 递归渲染嵌套在 card / tabs 内的表单节点时始终能找到桥接组件
      ensureFormPageComponents()
      const type = nodeProps.node.type
      if (type === 'form-field') return h(FormFieldNode, { node: nodeProps.node })
      if (type === 'form-grid') return h(FormGridNode, { node: nodeProps.node })
      if (type === 'form-subtable') return h(FormSubtableNode, { node: nodeProps.node })
      return h(RenderComponent, { node: nodeProps.node, pageCode: '' })
    }
  }
}

let formPageComponentsRegistered = false

/**
 * 把表单专用节点注册为页面设计器插件组件（幂等，Map.set 覆盖式注册）。
 * 注册后 render-component 的递归渲染在遇到这些类型时自动走桥接组件，
 * 布局树里的 card / tabs / 栅格嵌套因此可以互相包含。
 * 每次渲染前重断言：设计器关闭时会注销同名设计时组件，这里保证运行时注册始终可用。
 */
export function ensureFormPageComponents() {
  if (formPageComponentsRegistered) return
  registerComponent({
    type: 'form-field',
    label: '模型字段（表单布局）',
    category: 'form',
    defaultNode: () => ({ type: 'form-field', props: { field: '' }, styles: {} }),
    render: ({ node }) => h(FormFieldNode, { node })
  })
  registerComponent({
    type: 'form-grid',
    label: '字段栅格（表单布局）',
    category: 'layout',
    isContainer: true,
    defaultNode: () => ({ type: 'form-grid', props: { span: 2 }, styles: {}, children: [] }),
    render: ({ node }) => h(FormGridNode, { node })
  })
  registerComponent({
    type: 'form-subtable',
    label: '子表（表单布局）',
    category: 'form',
    defaultNode: () => ({ type: 'form-subtable', props: { field: '', title: '子表', columns: [{ field: '', label: '' }] }, styles: {} }),
    render: ({ node }) => h(FormSubtableNode, { node })
  })
  formPageComponentsRegistered = true
}

/** 注销运行时桥接注册（测试用；业务侧保持常驻即可） */
export function unregisterFormPageComponents() {
  formPageComponentsRegistered = false
  // 类型注销由 plugin-manager.unregisterComponent 完成，这里仅复位幂等标记
}

/** 渲染 PageNode 组件树，返回根容器 VNode */
export function renderPageLayout(components: PageNode[]): VNode {
  ensureFormPageComponents()
  const children = components.map((node) => h(PageNodeAny, { node, key: node.id }))
  return h('div', { class: 'w-dynamic-form' }, children)
}

/** 页面设计器渲染器所需的 PageContext（formData 即表单记录，内置表单控件直接读写记录） */
export function createFormPageContext(model: Record<string, any>) {
  return {
    pageCode: ref(''),
    pageState: {} as Record<string, any>,
    formData: model,
    updateFormData(key: string, value: any) {
      model[key] = value
    },
    executeEvent: () => {
      // 表单布局内暂不执行页面事件动作（按钮可点击但无动作），后续按需接入
    },
    refreshKey: ref(0)
  }
}
