<template>
  <div
    class="component-node"
    :class="{ selected: isSelected, container: isContainer }"
    :style="node.styles"
    @click.stop="selectNode(node.id)"
    @dragover.stop.prevent="handleDragOver"
    @drop.stop.prevent="handleDrop"
  >
    <div class="node-toolbar">
      <span class="node-type">{{ typeLabel }}</span>
      <component :is="spaceTag">
        <component :is="buttonTag" v-if="isContainer" size="mini" @click.stop="addChild">+ 子组件</component>
        <component :is="buttonTag" size="mini" @click.stop="moveUp">上移</component>
        <component :is="buttonTag" size="mini" @click.stop="moveDown">下移</component>
        <component :is="buttonTag" size="mini" type="danger" @click.stop="remove">删除</component>
      </component>
    </div>

    <div class="node-content">
      <!-- 文本 -->
      <template v-if="node.type === 'text'">
        <component :is="node.props.tag || 'p'" :style="{ textAlign: node.props.align || 'left' }">
          {{ node.props.content }}
        </component>
      </template>

      <!-- 统计卡片 -->
      <template v-else-if="node.type === 'statistic'">
        <div class="stat-preview">
          <div class="stat-title">{{ node.props.title }}</div>
          <div class="stat-value">{{ node.dataSource?.value ?? '-' }}</div>
        </div>
      </template>

      <!-- 图表 -->
      <template v-else-if="node.type === 'chart'">
        <div class="chart-preview">[图表] {{ node.props.title || '示例图表' }}</div>
      </template>

      <!-- 公告 -->
      <template v-else-if="node.type === 'alert'">
        <component :is="alertTag" :type="node.props.type || 'info'" :title="node.props.content" :closable="false" />
      </template>

      <!-- 数据模型 -->
      <template v-else-if="node.type === 'model'">
        <div class="embed-preview">[嵌入模型] {{ node.props.modelCode || '未配置' }}</div>
      </template>

      <!-- 仪表盘 -->
      <template v-else-if="node.type === 'dashboard'">
        <div class="embed-preview">[嵌入仪表盘] {{ node.props.dashboardCode || '未配置' }}</div>
      </template>

      <!-- 报表 -->
      <template v-else-if="node.type === 'report'">
        <div class="embed-preview">[嵌入报表] {{ node.props.reportCode || '未配置' }}</div>
      </template>

      <!-- 图片 -->
      <template v-else-if="node.type === 'image'">
        <img v-if="node.props.src" class="node-image" :src="node.props.src" :alt="node.props.alt" :style="{ width: node.props.width || '100%', height: node.props.height || 'auto', objectFit: node.props.objectFit || 'cover' }">
        <div v-else class="embed-preview">[图片] 未配置地址</div>
      </template>

      <!-- 分隔线 -->
      <template v-else-if="node.type === 'divider'">
        <div class="divider-preview">{{ node.props.text || '—' }}</div>
      </template>

      <!-- 表格 -->
      <template v-else-if="node.type === 'table'">
        <div class="embed-preview">[表格] {{ node.props.title || '示例表格' }}</div>
      </template>

      <!-- 列表 -->
      <template v-else-if="node.type === 'list'">
        <div class="list-preview">
          <div v-for="i in 3" :key="i" class="list-preview-item">
            <span class="list-preview-title">列表项 {{ i }}</span>
          </div>
        </div>
      </template>

      <!-- 按钮 -->
      <template v-else-if="node.type === 'button'">
        <component :is="buttonTag" :type="node.props.type || 'default'">{{ node.props.label }}</component>
      </template>

      <!-- 链接 -->
      <template v-else-if="node.type === 'link'">
        <a href="javascript:void(0)">{{ node.props.label }}</a>
      </template>

      <!-- 容器/卡片/栅格/标签页 -->
      <template v-else-if="isContainer">
        <div v-if="node.type === 'card'" class="card-title">{{ node.props.title }}</div>
        <div v-if="node.type === 'tabs'" class="tabs-header">
          <span v-for="tab in node.props.tabs" :key="tab.name" class="tab-item">{{ tab.title }}</span>
        </div>
        <div
          class="children-area"
          :class="`layout-${node.type}`"
          data-droppable="container"
          :data-node-id="node.id"
        >
          <component-node
            v-for="(child, index) in node.children"
            :key="child.id"
            :node="child"
            :index="index"
            :selected-id="selectedId"
            :parent-list="node.children || []"
            @select="$emit('select', $event)"
            @delete="$emit('delete', $event)"
            @move="$emit('move', $event)"
          />
          <div v-if="!node.children?.length" class="empty-children">拖入子组件</div>
        </div>
      </template>

      <template v-else-if="pluginComponent">
        <component :is="pluginComponent.render" :node="node" />
      </template>

      <template v-else>
        <div class="unknown-type">未知组件: {{ node.type }}</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { listComponents, getComponent } from './plugin-manager'
import { usePrefix } from '../../utils/prefix'
import type { PageNode } from './types'

defineOptions({ name: 'WPageComponentNode' })

const props = defineProps<{
  node: PageNode
  index: number
  selectedId: string
  parentList: PageNode[]
}>()

const emit = defineEmits(['select', 'delete', 'move'])

const { withPrefix } = usePrefix()
const iconTag = withPrefix('icon')
const alertTag = withPrefix('alert')
const buttonTag = withPrefix('button')
const spaceTag = withPrefix('space')

const isSelected = computed(() => props.node.id === props.selectedId)
const pluginComponent = computed(() => getComponent(props.node.type))
const isContainer = computed(() => ['container', 'card', 'row', 'tabs'].includes(props.node.type) || !!pluginComponent.value?.isContainer)

const typeLabelMap: Record<string, string> = {
  container: '容器',
  card: '卡片',
  row: '栅格',
  tabs: '标签页',
  text: '文本',
  statistic: '统计卡片',
  chart: '图表',
  alert: '公告',
  image: '图片',
  divider: '分隔线',
  table: '表格',
  list: '列表',
  model: '数据模型',
  dashboard: '仪表盘',
  report: '报表',
  button: '按钮',
  link: '链接'
}

const typeLabel = computed(() => typeLabelMap[props.node.type] || pluginComponent.value?.label || props.node.type)

function selectNode(id: string) {
  emit('select', id)
}

function remove() {
  emit('delete', { id: props.node.id })
}

function moveUp() {
  emit('move', { id: props.node.id, direction: 'up' })
}

function moveDown() {
  emit('move', { id: props.node.id, direction: 'down' })
}

function addChild() {
  if (!props.node.children) props.node.children = []
  const child = createDefaultComponent('text')
  props.node.children.push(child)
  emit('select', child.id)
}

function handleDragOver(event: DragEvent) {
  if (!isContainer.value) return
  event.preventDefault()
}

function handleDrop(event: DragEvent) {
  if (!isContainer.value) return
  event.preventDefault()
  const type = event.dataTransfer?.getData('componentType')
  if (!type) return
  if (!props.node.children) props.node.children = []
  const child = createDefaultComponent(type)
  props.node.children.push(child)
  emit('select', child.id)
}

function generateId() {
  return `comp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function createDefaultComponent(type: string): PageNode {
  const pluginDef = listComponents().find((c) => c.type === type)
  if (pluginDef) {
    return { id: generateId(), ...pluginDef.defaultNode() }
  }

  const base: PageNode = {
    id: generateId(),
    type,
    props: {},
    styles: {}
  }

  switch (type) {
    case 'container':
      return { ...base, props: { padding: '12px' }, children: [] }
    case 'card':
      return { ...base, props: { title: '卡片标题' }, children: [] }
    case 'row':
      return { ...base, props: { columns: 2, gap: '12px' }, children: [] }
    case 'tabs':
      return { ...base, props: { tabs: [{ title: '标签1', name: 'tab1' }] }, children: [] }
    case 'text':
      return { ...base, props: { content: '这是一段文本', tag: 'p', align: 'left' } }
    case 'statistic':
      return { ...base, props: { title: '统计标题', field: 'value', icon: 'star', color: 'primary' }, dataSource: { type: 'static', value: 0 } }
    case 'chart':
      return { ...base, props: { height: '300px', chartType: 'echarts' }, dataSource: { type: 'static' }, option: { title: { text: '示例图表' }, xAxis: { data: ['一月', '二月', '三月'] }, yAxis: {}, series: [{ type: 'bar', data: [5, 20, 36] }] } }
    case 'alert':
      return { ...base, props: { content: '公告内容', type: 'info' } }
    case 'image':
      return { ...base, props: { src: '', alt: '', width: '100%', height: 'auto', objectFit: 'cover' } }
    case 'divider':
      return { ...base, props: { text: '', direction: 'horizontal', margin: '16px 0' } }
    case 'table':
      return { ...base, props: { title: '表格', columns: [{ prop: 'name', label: '名称' }, { prop: 'value', label: '值' }], height: '' }, dataSource: { type: 'static', value: [] } }
    case 'list':
      return { ...base, props: { itemTitle: 'title', itemDesc: 'description', itemIcon: 'file' }, dataSource: { type: 'static', value: [] } }
    case 'model':
      return { ...base, props: { modelCode: '', height: '500px' } }
    case 'dashboard':
      return { ...base, props: { dashboardCode: '' } }
    case 'report':
      return { ...base, props: { reportCode: '' } }
    case 'button':
      return { ...base, props: { label: '按钮', type: 'default' }, events: { onClick: { action: 'navigate', target: '' } } }
    case 'link':
      return { ...base, props: { label: '链接', path: '' } }
    default:
      return base
  }
}
</script>

<style scoped>
.component-node {
  border: 1px dashed #d4d0c8;
  padding: 8px;
  margin-bottom: 8px;
  background: #fff;
  position: relative;
}
.component-node.selected { border: 2px solid #0078d7; }
.component-node.container { background: #fafafa; }
.node-toolbar {
  display: none;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  padding: 4px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 3px;
}
.component-node:hover .node-toolbar,
.component-node.selected .node-toolbar {
  display: flex;
}
.node-type { font-size: 12px; color: #666; }
.node-content { min-height: 24px; }
.children-area { min-height: 40px; padding: 8px; border: 1px dashed #e0e0e0; }
.children-area.drop-target-active { background: rgba(0, 120, 215, 0.1); border-color: var(--w-color-primary); }
.layout-grid { display: grid; grid-template-columns: repeat(var(--columns, 2), 1fr); gap: var(--gap, 12px); }
.card-title { font-weight: bold; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #eee; }
.tabs-header { display: flex; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid #ddd; }
.tab-item { padding: 4px 12px; background: #f0f0f0; border: 1px solid #ddd; border-bottom: none; }
.empty-children { color: #bbb; font-size: 12px; text-align: center; padding: 12px; }
.stat-preview { text-align: center; }
.stat-title { color: #666; font-size: 12px; }
.stat-value { font-size: 24px; font-weight: bold; }
.chart-preview,
.embed-preview,
.unknown-type {
  padding: 20px;
  background: #f8f8f8;
  border: 1px solid #eee;
  text-align: center;
  color: #666;
}
.node-image { max-width: 100%; display: block; }
.divider-preview { text-align: center; color: #999; padding: 8px 0; }
.list-preview { padding: 8px; }
.list-preview-item { padding: 6px; border-bottom: 1px dashed #eee; }
.list-preview-item:last-child { border-bottom: none; }
.list-preview-title { font-size: 12px; color: #666; }
</style>
