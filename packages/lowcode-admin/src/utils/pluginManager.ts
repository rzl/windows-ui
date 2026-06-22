import { computed, defineComponent, h, onMounted, ref, watch, type VNode } from 'vue'
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

// ---------- 图表注册表 ----------

const chartRegistry = new Map<string, ChartPluginDefinition>()

export function registerChart(def: ChartPluginDefinition) {
  chartRegistry.set(def.type, def)
}

export function getChart(type: string): ChartPluginDefinition | undefined {
  return chartRegistry.get(type)
}

export function listCharts(): ChartPluginDefinition[] {
  return Array.from(chartRegistry.values())
}

// 默认 ECharts 图表
registerChart({
  type: 'echarts',
  label: 'ECharts',
  defaultOption: () => ({
    title: { text: '示例图表' },
    xAxis: { data: ['一月', '二月', '三月'] },
    yAxis: {},
    series: [{ type: 'bar', data: [5, 20, 36] }]
  }),
  render(option: any, props: Record<string, any>) {
    const height = props.height || '300px'
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>body{margin:0;padding:8px;}</style>
</head>
<body>
  <div id="chart" style="width:100%;height:${height};"></div>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"><\/script>
  <script>
    var chart = echarts.init(document.getElementById('chart'));
    chart.setOption(${JSON.stringify(option || {})});
    window.addEventListener('resize', function() { chart.resize(); });
  <\/script>
</body>
</html>`
  }
})

// ---------- 页面组件注册表 ----------

const componentRegistry = new Map<string, PageComponentDefinition>()

export function registerComponent(def: PageComponentDefinition) {
  componentRegistry.set(def.type, def)
}

export function getComponent(type: string): PageComponentDefinition | undefined {
  return componentRegistry.get(type)
}

export function listComponents(): PageComponentDefinition[] {
  return Array.from(componentRegistry.values())
}

export function listComponentsByCategory(category: PageComponentDefinition['category']) {
  return listComponents().filter((c) => c.category === category)
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
  componentRegistry.clear()
  for (const key of chartRegistry.keys()) {
    if (key !== 'echarts') chartRegistry.delete(key)
  }
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
