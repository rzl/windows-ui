<template>
  <w-form ref="formRef" :model="model" :rules="rules">
    <render-layout :layout="effectiveLayout" />
  </w-form>
</template>

<script setup lang="ts">
import { computed, h, provide, reactive, ref, onMounted, onBeforeUnmount, type PropType, type VNode } from 'vue'
import WForm from '../form/form.vue'
import WCard from '../card/card.vue'
import WTabs from '../tabs/tabs.vue'
import type { FormRule } from '../form/form.vue'
import { createFieldRuntime, renderSubTableEditor } from './form-runtime'
import {
  createFormPageContext,
  isPageNodeLayout,
  provideDynamicFormBridge,
  renderPageLayout,
  type PageFormLayout
} from './page-layout-engine'
export interface DynamicField {
  prop: string
  label: string
  type: 'input' | 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'switch' | 'date' | 'datetime' | 'ref' | 'upload' | 'cascader' | 'rich-text' | 'custom'
  inputType?: string
  placeholder?: string
  options?: { label: string; value: any }[]
  disabled?: boolean | ((model: Record<string, any>) => boolean)
  hidden?: boolean | ((model: Record<string, any>) => boolean)
  required?: boolean
  validationRule?: string
  rules?: FormRule[]
  codingRule?: string
  defaultValueType?: 'constant' | 'currentUser' | 'currentTime' | 'currentDept' | 'currentRole' | 'field' | 'expr' | 'urlParam' | 'parentField'
  defaultValueExpr?: string
  refModel?: string
  refDisplayField?: string
  refRelation?: string
  dependsOn?: {
    field: string
    value?: any
    operator?: 'eq' | 'ne' | 'empty' | 'notEmpty'
  }
  dynamicOptions?: {
    type: 'dict' | 'sql' | 'api' | 'script'
    dependsOn?: string
    dictCode?: string
    sql?: string
    api?: { method?: string; url?: string; params?: any; body?: any }
    script?: string
    option?: any
  }
  linkageRules?: LinkageRule[]
  clearable?: boolean
  min?: number
  max?: number
  rows?: number
  activeText?: string
  inactiveText?: string
  span?: number
}

export interface LinkageCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'notContains' | 'empty' | 'notEmpty' | 'in' | 'notIn'
  value?: any
}

export interface LinkageAction {
  type: 'show' | 'hide' | 'required' | 'unrequired' | 'enable' | 'disable' | 'setValue' | 'clear' | 'filterOptions'
  value?: any
  options?: { label: string; value: any }[]
}

export interface LinkageRule {
  conditions: LinkageCondition[]
  logic: 'and' | 'or'
  actions: LinkageAction[]
}

export interface FormLayout {
  type: 'root' | 'fieldset' | 'tabs' | 'grid' | 'subtable'
  title?: string
  name?: string
  span?: number
  activeTab?: string
  tabs?: { title: string; name: string; children: (FormLayout | string)[] }[]
  children?: (FormLayout | string)[]
  field?: string
  columns?: { field: string; label: string; width?: number; type?: string }[]
  subModelCode?: string
  foreignField?: string
  localField?: string
}

defineOptions({ name: 'WDynamicForm' })

export type ValidateRuleItem = { code: string; value: any }
export type ValidateRuleResult = { code: string; valid: boolean; message?: string }

const props = defineProps({
  model: { type: Object as () => Record<string, any>, default: () => ({}) },
  fields: { type: Array as () => DynamicField[], default: () => [] },
  columns: { type: Number, default: 1 },
  layout: { type: Object as () => FormLayout | PageFormLayout, default: undefined },
  mobileColumns: { type: Number, default: 1 },
  validateRules: {
    type: Function as PropType<(items: ValidateRuleItem[]) => Promise<ValidateRuleResult[]>>,
    default: undefined
  },
  loadOptions: {
    type: Function as PropType<(config: DynamicField['dynamicOptions'], model: Record<string, any>) => Promise<{ label: string; value: any }[]>>,
    default: undefined
  },
  loadRefOptions: {
    type: Function as PropType<(modelCode: string, displayField: string, keyword: string, relationCode?: string) => Promise<{ label: string; value: any }[]>>,
    default: undefined
  },
  userInfo: {
    type: Object as PropType<{ id?: number | string; deptId?: number | string; roleId?: number | string; [key: string]: any }>,
    default: undefined
  },
  parentModel: {
    type: Object as () => Record<string, any>,
    default: undefined
  },
  urlParams: {
    type: Object as () => Record<string, any>,
    default: undefined
  },
  generateCode: {
    type: Function as PropType<(ruleCode: string) => Promise<string>>,
    default: undefined
  },
  uploadRequest: {
    type: Function as PropType<(file: File) => Promise<{ url: string; name: string; size?: number }>>,
    default: undefined
  }
})

const formRef = ref<any>(null)
// 字段运行时：校验 / 联动 / 选项 / 默认值 / 编码 / 字段控件渲染
const runtime = createFieldRuntime(props, formRef)
// 顶层解包：模板绑定 plain object 内的 ref 不会自动 unwrap
const rules = runtime.rules

// PageNode 布局：向桥接组件提供字段运行时，并向页面设计器渲染器提供
// 以表单记录为 formData 的 PageContext（内置表单控件经 props.field 直接读写记录）
provideDynamicFormBridge({
  runtime,
  model: props.model,
  isMobile: () => isMobile.value,
  columns: () => props.columns,
  mobileColumns: () => props.mobileColumns
})
provide('pageContext', createFormPageContext(props.model))

const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
const isMobile = computed(() => screenWidth.value <= 768)

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth)
})

const activeTabMap = reactive<Record<string, number>>({})

const effectiveLayout = computed<FormLayout | PageFormLayout>(() => {
  if (props.layout) return props.layout
  return {
    type: 'grid',
    span: props.columns,
    children: runtime.visibleFields.value.map((f) => f.prop)
  }
})

const RenderLayout = {
  props: {
    layout: { type: Object as () => FormLayout | PageFormLayout, required: true }
  },
  setup(layoutProps: { layout: FormLayout | PageFormLayout }) {
    return () => {
      // 页面设计器 schema（含 components 数组）委托页面设计器渲染器，其余走 legacy FormLayout 引擎
      if (isPageNodeLayout(layoutProps.layout)) {
        return renderPageLayout(layoutProps.layout.components)
      }
      return renderLayoutNode(layoutProps.layout)
    }
  }
}

function renderLayoutNode(node: FormLayout | string): VNode | null {
  if (typeof node === 'string') {
    return runtime.renderFieldItem(node)
  }
  if (!node) return null

  const children: (VNode | null)[] = (node.children || []).map((child) => renderLayoutNode(child))

  if (node.type === 'root') {
    return h('div', { class: 'w-dynamic-form' }, children)
  }

  if (node.type === 'grid') {
    const columns = isMobile.value ? props.mobileColumns : (node.span || props.columns)
    return h('div', {
      class: 'w-dynamic-form__grid',
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: isMobile.value ? '8px' : '12px'
      }
    }, children)
  }

  if (node.type === 'fieldset') {
    return h(WCard, { header: node.title || '分组', class: 'w-dynamic-form__fieldset' }, () => children)
  }

  if (node.type === 'tabs') {
    const tabs = node.tabs || []
    const activeIndex = activeTabMap[node.name || 'default'] || 0
    const tabLabels = tabs.map((tab) => ({ label: tab.title, name: tab.name }))
    return h(WTabs, {
      tabs: tabLabels,
      modelValue: activeIndex,
      'onUpdate:modelValue': (v: number) => { activeTabMap[node.name || 'default'] = v }
    }, {
      default: ({ active }: { active: number }) => {
        const tab = tabs[active]
        if (!tab) return null
        return h('div', { class: 'w-dynamic-form__tab-content' }, tab.children.map((c) => renderLayoutNode(c)))
      }
    })
  }

  if (node.type === 'subtable') {
    if (!node.field) return null
    return renderSubTableEditor({
      model: props.model,
      field: node.field,
      title: node.title,
      columns: node.columns
    })
  }

  return h('div', { class: 'w-dynamic-form' }, children)
}

defineExpose({ validate: () => runtime.validate() })
</script>

<style scoped>
.w-dynamic-form { }
.w-dynamic-form__error { color: var(--w-color-danger); font-size: var(--w-font-size-small); margin-top: 2px; }
</style>
