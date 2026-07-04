import type { VNode } from 'vue'

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

export interface PageConfig {
  title?: string
  description?: string
  formData?: Record<string, any>
  components?: PageNode[]
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
  propertySchema?: any
}
