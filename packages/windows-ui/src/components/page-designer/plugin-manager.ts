import type { ChartPluginDefinition, PageComponentDefinition, PageActionDefinition, PageActionContext, PageEventConfig } from './types'

const chartRegistry = new Map<string, ChartPluginDefinition>()
const componentRegistry = new Map<string, PageComponentDefinition>()
const actionRegistry = new Map<string, PageActionDefinition>()

export function registerChart(def: ChartPluginDefinition) {
  chartRegistry.set(def.type, def)
}

export function getChart(type: string): ChartPluginDefinition | undefined {
  return chartRegistry.get(type)
}

export function listCharts(): ChartPluginDefinition[] {
  return Array.from(chartRegistry.values())
}

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

export function registerAction(def: PageActionDefinition) {
  actionRegistry.set(def.action, def)
}

export function getAction(action: string): PageActionDefinition | undefined {
  return actionRegistry.get(action)
}

export function listActions(): PageActionDefinition[] {
  return Array.from(actionRegistry.values())
}

export function clearPageComponentRegistries() {
  componentRegistry.clear()
  chartRegistry.clear()
  actionRegistry.clear()
}

// 内置 ECharts 图表
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

// 内置事件动作
registerAction({
  action: 'navigate',
  label: '跳转',
  fields: [
    { type: 'input', key: 'target', label: '目标路径', placeholder: '如 /lowcode/run/order' }
  ],
  execute(config: PageEventConfig, ctx: PageActionContext) {
    if (config.target) ctx.emit('navigate', config.target)
  }
})

registerAction({
  action: 'openDialog',
  label: '打开弹窗',
  fields: [
    { type: 'input', key: 'target', label: '页面编码 / URL', placeholder: '如 sub-page-code 或 https://example.com' },
    { type: 'input', key: 'dialogOptions.width', label: '弹窗宽度', placeholder: '如 800 或 80%' },
    { type: 'input', key: 'dialogOptions.height', label: '弹窗高度', placeholder: '如 600 或 60%' },
    { type: 'switch', key: 'dialogOptions.fullscreen', label: '全屏', default: false },
    { type: 'switch', key: 'dialogOptions.showFooter', label: '显示底部', default: true }
  ],
  execute(config: PageEventConfig, ctx: PageActionContext) {
    if (config.target) ctx.openDialog(config.target, config.dialogOptions)
  }
})

registerAction({
  action: 'callApi',
  label: '调用接口',
  fields: [
    { type: 'input', key: 'target', label: '接口地址', placeholder: '如 /api/lowcode/order' },
    { type: 'select', key: 'method', label: '请求方法', options: [{ label: 'GET', value: 'GET' }, { label: 'POST', value: 'POST' }], default: 'GET' },
    { type: 'json', key: 'params', label: '查询参数(JSON)', default: {} },
    { type: 'json', key: 'body', label: '请求体(JSON)', default: {} }
  ],
  execute(config: PageEventConfig, ctx: PageActionContext) {
    if (config.target) {
      ctx.callApi(config.target, config.method || 'GET', config.params || {}, config.body || {})
    }
  }
})

registerAction({
  action: 'setVariable',
  label: '设置变量',
  fields: [
    { type: 'input', key: 'variable', label: '变量名', placeholder: 'pageState 中的变量名' },
    { type: 'json', key: 'value', label: '变量值', placeholder: '支持字符串、数字或 JSON', default: '' }
  ],
  execute(config: PageEventConfig, ctx: PageActionContext) {
    if (config.variable) {
      ctx.pageState[config.variable] = config.value
    }
  }
})

registerAction({
  action: 'refresh',
  label: '刷新页面',
  execute(_config: PageEventConfig, ctx: PageActionContext) {
    ctx.refreshKey.value++
    ctx.emit('refresh')
  }
})

registerAction({
  action: 'goBack',
  label: '返回上一页',
  execute(_config: PageEventConfig, ctx: PageActionContext) {
    ctx.emit('back')
  }
})

registerAction({
  action: 'openExternal',
  label: '打开外部链接',
  fields: [
    { type: 'input', key: 'target', label: 'URL', placeholder: '如 https://example.com' }
  ],
  execute(config: PageEventConfig, ctx: PageActionContext) {
    if (config.target) ctx.emit('openExternal', config.target)
  }
})
