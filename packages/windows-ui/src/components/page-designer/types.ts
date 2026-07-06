import type { VNode } from 'vue'

export type PropertySchemaFieldType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'switch'
  | 'color'
  | 'json'
  | 'dataSource'
  | 'events'
  | 'options'
  | 'items'
  | 'slider'

export interface PropertySchemaOption {
  label: string
  value: any
}

export interface PropertySchemaField {
  /** 字段类型 */
  type: PropertySchemaFieldType
  /** 属性路径：props.xxx / styles.xxx / dataSource / events */
  key: string
  /** 显示名称 */
  label: string
  /** 占位提示 */
  placeholder?: string
  /** 下拉选项 */
  options?: PropertySchemaOption[]
  /** 默认值 */
  default?: any
  /** 数字最小值 */
  min?: number
  /** 数字最大值 */
  max?: number
  /** 数字步长 */
  step?: number
  /** 多行文本行数 */
  rows?: number
  /** 分组标题 */
  group?: string
}

export interface PageNode {
  id: string
  type: string
  props: Record<string, any>
  styles: Record<string, any>
  events?: Record<string, PageEventConfig>
  dataSource?: PageDataSource
  option?: any
  children?: PageNode[]
  tab?: string
}

export interface PageSubPage {
  code: string
  name: string
  config: PageConfig
}

export interface PageConfig {
  title?: string
  description?: string
  formData?: Record<string, any>
  components?: PageNode[]
  subPages?: PageSubPage[]
}

export interface PageItem {
  code: string
  name: string
  config: PageConfig
  isMain?: boolean
}

export interface ComponentGroup {
  key: string
  title: string
  items: { label: string; value: string; icon: string }[]
}

export interface PageEventConfig {
  action: string
  target?: string
  method?: string
  params?: Record<string, any>
  body?: Record<string, any>
  variable?: string
  value?: any
  condition?: string
  actions?: PageEventConfig[]
  dialogOptions?: DialogOpenOptions
}

export interface PageActionContext {
  pageCode: string
  pageState: Record<string, any>
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
  executeDataSource?: (code: string, ds: PageDataSource, ctx?: any) => Promise<any>
  refreshKey: { value: number }
  emit: (event: string, ...args: any[]) => void
  openDialog: (target: string, options?: DialogOpenOptions) => void | Promise<void>
  callApi: (target: string, method: string, params: any, body: any) => void | Promise<void>
}

export interface DialogOpenOptions {
  width?: number | string
  height?: number | string
  fullscreen?: boolean
  showFooter?: boolean
  footerActions?: PageEventConfig[]
}

export interface PageActionDefinition {
  /** 动作编码 */
  action: string
  /** 显示名称 */
  label: string
  /** 字段 schema：动作配置需要哪些字段 */
  fields?: PropertySchemaField[]
  /** 执行器 */
  execute: (config: PageEventConfig, ctx: PageActionContext) => void | Promise<void>
}

export interface PageDataSource {
  type?: '' | 'static' | 'sql' | 'api' | 'script'
  value?: any
  sql?: string
  script?: string
  transformScript?: string
  api?: {
    method?: string
    url?: string
    params?: Record<string, any>
    body?: Record<string, any>
  }
}

export interface PageContext {
  pageCode: { value: string }
  pageState: Record<string, any>
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
  executeEvent: (event: PageEventConfig | undefined) => void
  executeDataSource?: (code: string, ds: PageDataSource, ctx?: any) => Promise<any>
  refreshKey: { value: number }
}

export interface ChartPluginDefinition {
  type: string
  label: string
  defaultOption: () => any
  render: (option: any, props: Record<string, any>, data: any) => string
}

export interface PageComponentDefinition {
  type: string
  label: string
  category: 'layout' | 'display' | 'data' | 'action' | 'form'
  icon?: string
  isContainer?: boolean
  defaultNode: () => Omit<PageNode, 'id'>
  render: (ctx: { node: PageNode; pageCode?: string; dataValue?: any }) => VNode
  propertySchema?: PropertySchemaField[]
}
