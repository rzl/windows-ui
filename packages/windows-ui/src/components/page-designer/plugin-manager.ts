import type { ChartPluginDefinition, PageComponentDefinition } from './types'

const chartRegistry = new Map<string, ChartPluginDefinition>()
const componentRegistry = new Map<string, PageComponentDefinition>()

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

export function clearPageComponentRegistries() {
  componentRegistry.clear()
  chartRegistry.clear()
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


