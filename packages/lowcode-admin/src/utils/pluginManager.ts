import { computed, defineComponent, h, onMounted, ref, watch, type VNode } from 'vue'
import {
  registerComponent as uiRegisterComponent,
  registerChart as uiRegisterChart,
  getComponent as uiGetComponent,
  getChart as uiGetChart,
  listComponents as uiListComponents,
  listCharts as uiListCharts,
  listComponentsByCategory as uiListComponentsByCategory,
  clearPageComponentRegistries
} from '@windows-ui/core'
import * as pluginApi from '@/api/plugin'

export interface FieldTypeDefinition {
  type: string
  label: string
  dbType?: string
  formType?: string
  format?: string
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
  category: 'layout' | 'display' | 'data' | 'action'
  icon?: string
  isContainer?: boolean
  defaultNode: () => any
  render: (ctx: { node: any; pageCode?: string; dataValue?: any }) => VNode
  propertySchema?: any
}

// ---------- 内置字段类型 ----------

const builtInFieldTypes: FieldTypeDefinition[] = [
  { type: 'string', label: '字符串', dbType: 'string', formType: 'input' },
  { type: 'text', label: '文本', dbType: 'text', formType: 'textarea' },
  { type: 'number', label: '数字', dbType: 'integer', formType: 'number' },
  { type: 'boolean', label: '布尔', dbType: 'tinyint', formType: 'switch' },
  { type: 'date', label: '日期', dbType: 'string', formType: 'date' },
  { type: 'datetime', label: '日期时间', dbType: 'datetime', formType: 'datetime' },
  { type: 'select', label: '下拉选择', dbType: 'string', formType: 'select' },
  { type: 'radio', label: '单选', dbType: 'string', formType: 'radio' },
  { type: 'ref', label: '关联模型', dbType: 'integer', formType: 'ref' },
  { type: 'upload', label: '文件上传', dbType: 'integer', formType: 'upload' },
  { type: 'cascader', label: '级联选择', dbType: 'integer', formType: 'cascader' },
  { type: 'rich-text', label: '富文本', dbType: 'text', formType: 'rich-text' }
]

// ---------- 字段类型注册表 ----------

const pluginFieldTypes = new Map<string, FieldTypeDefinition>()

export function registerFieldType(def: FieldTypeDefinition) {
  pluginFieldTypes.set(def.type, def)
}

export function getFieldTypeMeta(type: string): FieldTypeDefinition | undefined {
  const builtIn = builtInFieldTypes.find((f) => f.type === type)
  if (builtIn) return builtIn
  return pluginFieldTypes.get(type)
}

export function getFieldTypeOptions() {
  return [
    ...builtInFieldTypes.map((f) => ({ label: f.label, value: f.type })),
    ...Array.from(pluginFieldTypes.values()).map((f) => ({ label: f.label, value: f.type }))
  ]
}

export function mapFieldTypeToFormType(type: string) {
  return getFieldTypeMeta(type)?.formType || 'input'
}

// ---------- 页面组件与图表注册表（委托给组件库） ----------

export function registerComponent(def: PageComponentDefinition) {
  uiRegisterComponent(def as any)
}

export function registerChart(def: ChartPluginDefinition) {
  uiRegisterChart(def as any)
}

export function getChart(type: string): ChartPluginDefinition | undefined {
  return uiGetChart(type) as ChartPluginDefinition | undefined
}

export function getComponent(type: string): PageComponentDefinition | undefined {
  return uiGetComponent(type) as PageComponentDefinition | undefined
}

export function listComponents(): PageComponentDefinition[] {
  return uiListComponents() as PageComponentDefinition[]
}

export function listCharts(): ChartPluginDefinition[] {
  return uiListCharts() as ChartPluginDefinition[]
}

export function listComponentsByCategory(category: PageComponentDefinition['category']) {
  return uiListComponentsByCategory(category) as PageComponentDefinition[]
}

// ---------- 插件运行时 API ----------

function createPluginApi() {
  return {
    h,
    defineComponent,
    ref,
    computed,
    watch,
    onMounted,
    registerChart,
    registerComponent,
    registerFieldType,
    registerFieldRenderer: (_type: string, _renderFn: any) => {
      // MVP 占位：自定义字段渲染后续接入 dynamic-form / table
    }
  }
}

async function executePlugin(plugin: any) {
  const runtimeUrl = plugin.runtime_url
  const runtimeCode = plugin.runtime_code || ''

  if (runtimeUrl) {
    try {
      const mod = await import(/* @vite-ignore */ runtimeUrl)
      if (typeof mod.default === 'function') {
        await mod.default(createPluginApi())
      }
    } catch (err) {
      console.error(`[plugin] 加载外部插件失败: ${plugin.code}`, err)
    }
    return
  }

  if (!runtimeCode.trim()) return

  const blob = new Blob([runtimeCode], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)
  try {
    const mod = await import(/* @vite-ignore */ url)
    if (typeof mod.default === 'function') {
      await mod.default(createPluginApi())
    }
  } catch (err) {
    console.error(`[plugin] 执行插件失败: ${plugin.code}`, err)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function parseContributions(contributions: any) {
  if (!contributions) return {}
  if (typeof contributions === 'string') {
    try {
      return JSON.parse(contributions)
    } catch {
      return {}
    }
  }
  return contributions
}

async function loadPluginFieldTypes(plugin: any) {
  const contributions = parseContributions(plugin.contributions)
  for (const ft of contributions.fieldTypes || []) {
    if (ft.type) {
      registerFieldType({
        type: ft.type,
        label: ft.label || ft.type,
        dbType: ft.dbType,
        formType: ft.formType || 'input',
        format: ft.format
      })
    }
  }
}

function clearPluginRegistries() {
  pluginFieldTypes.clear()
  clearPageComponentRegistries()
}

export async function initPlugins() {
  try {
    clearPluginRegistries()
    const plugins = await pluginApi.getActivePlugins()
    for (const plugin of plugins) {
      await loadPluginFieldTypes(plugin)
      await executePlugin(plugin)
    }
  } catch (err) {
    console.error('[plugin] 初始化插件失败', err)
  }
}
