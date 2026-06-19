<template>
  <div class="designer-page">
    <div class="toolbar">
      <w-button size="small" @click="goBack">返回</w-button>
      <w-space>
        <w-button size="small" @click="handlePreview">预览</w-button>
        <w-button type="primary" size="small" @click="handleSave">保存</w-button>
      </w-space>
    </div>

    <div class="designer-layout">
      <!-- 组件库 -->
      <div class="component-library">
        <div class="panel-title">组件库</div>
        <div class="component-group">
          <div class="group-title">布局</div>
          <div
            v-for="type in layoutTypes"
            :key="type.value"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, type.value)"
          >
            {{ type.label }}
          </div>
        </div>
        <div class="component-group">
          <div class="group-title">展示</div>
          <div
            v-for="type in displayTypes"
            :key="type.value"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, type.value)"
          >
            {{ type.label }}
          </div>
        </div>
        <div class="component-group">
          <div class="group-title">数据</div>
          <div
            v-for="type in dataTypes"
            :key="type.value"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, type.value)"
          >
            {{ type.label }}
          </div>
        </div>
        <div class="component-group">
          <div class="group-title">交互</div>
          <div
            v-for="type in actionTypes"
            :key="type.value"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, type.value)"
          >
            {{ type.label }}
          </div>
        </div>
      </div>

      <!-- 画布 -->
      <div class="canvas-panel" @dragover.prevent @drop="handleDropToRoot($event)">
        <div class="panel-title">画布</div>
        <div class="canvas-body" :class="{ 'is-empty': !config.components?.length }">
          <component-node
            v-for="(node, index) in config.components"
            :key="node.id"
            :node="node"
            :index="index"
            :selected-id="selectedId"
            :parent-list="config.components"
            @select="selectNode"
            @delete="deleteNode"
            @move="moveNode"
          />
          <div v-if="!config.components?.length" class="empty-tip">
            从左侧拖拽组件到此处
          </div>
        </div>
      </div>

      <!-- 属性面板 -->
      <div class="property-panel">
        <div class="panel-title">属性</div>
        <property-editor
          v-if="selectedNode"
          :node="selectedNode"
          @update="onPropertyUpdate"
        />
        <div v-else class="empty-tip">选中画布中的组件以编辑属性</div>
      </div>
    </div>

    <w-dialog v-model="previewVisible" title="页面预览" width="900">
      <page-renderer :code="page.code" :config="config" :preview="true" />
      <template #footer>
        <w-button @click="previewVisible = false">关闭</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as pageApi from '@/api/page'
import ComponentNode from '@/components/page-designer/ComponentNode.vue'
import PropertyEditor from '@/components/page-designer/PropertyEditor.vue'
import PageRenderer from '@/components/page-designer/PageRenderer.vue'

const route = useRoute()
const router = useRouter()
const code = route.params.code as string

const page = reactive<any>({ code, name: '', description: '' })
const config = reactive<any>({
  title: '',
  description: '',
  components: []
})
const selectedId = ref<string>('')
const previewVisible = ref(false)

const layoutTypes = [
  { label: '容器', value: 'container' },
  { label: '卡片', value: 'card' },
  { label: '栅格', value: 'grid' },
  { label: '标签页', value: 'tabs' }
]

const displayTypes = [
  { label: '文本', value: 'text' },
  { label: '统计卡片', value: 'stat' },
  { label: '图表', value: 'chart' },
  { label: '公告', value: 'notice' }
]

const dataTypes = [
  { label: '数据模型', value: 'model' },
  { label: '仪表盘', value: 'dashboard' },
  { label: '报表', value: 'report' }
]

const actionTypes = [
  { label: '按钮', value: 'button' },
  { label: '链接', value: 'link' }
]

const selectedNode = computed(() => {
  return findNode(config.components, selectedId.value)
})

onMounted(() => loadData())

async function loadData() {
  const data = await pageApi.getPage(code)
  Object.assign(page, data)
  const cfg = data.config || {}
  config.title = cfg.title || data.name || ''
  config.description = cfg.description || data.description || ''
  config.components = cfg.components || []
}

function findNode(list: any[], id: string): any {
  if (!list) return null
  for (const node of list) {
    if (node.id === id) return node
    if (node.children?.length) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

function generateId() {
  return `comp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function createDefaultComponent(type: string): any {
  const base = {
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
    case 'grid':
      return { ...base, props: { columns: 2, gap: '12px' }, children: [] }
    case 'tabs':
      return { ...base, props: { tabs: [{ title: '标签1', name: 'tab1' }] }, children: [] }
    case 'text':
      return { ...base, props: { content: '这是一段文本', tag: 'p', align: 'left' } }
    case 'stat':
      return { ...base, props: { title: '统计标题', field: 'value', icon: 'star', color: 'primary' }, dataSource: { type: 'static', value: 0 } }
    case 'chart':
      return { ...base, props: { height: '300px' }, dataSource: { type: 'static' }, option: { title: { text: '示例图表' }, xAxis: { data: ['一月', '二月', '三月'] }, yAxis: {}, series: [{ type: 'bar', data: [5, 20, 36] }] } }
    case 'notice':
      return { ...base, props: { content: '公告内容', type: 'info' } }
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

function handleDragStart(event: DragEvent, type: string) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('componentType', type)
  }
}

function handleDropToRoot(event: DragEvent) {
  event.preventDefault()
  const type = event.dataTransfer?.getData('componentType')
  if (!type) return
  if (!config.components) config.components = []
  const node = createDefaultComponent(type)
  config.components.push(node)
  selectNode(node.id)
}

function selectNode(id: string) {
  selectedId.value = id
}

function deleteNode({ id }: { id: string }) {
  removeNode(config.components, id)
  if (selectedId.value === id) selectedId.value = ''
}

function removeNode(list: any[], id: string): boolean {
  const index = list.findIndex((n) => n.id === id)
  if (index >= 0) {
    list.splice(index, 1)
    return true
  }
  for (const node of list) {
    if (node.children?.length && removeNode(node.children, id)) return true
  }
  return false
}

function moveNode({ id, direction }: { id: string; direction: 'up' | 'down' }) {
  moveNodeInList(config.components, id, direction)
}

function moveNodeInList(list: any[], id: string, direction: 'up' | 'down'): boolean {
  const index = list.findIndex((n) => n.id === id)
  if (index >= 0) {
    if (direction === 'up' && index > 0) {
      const temp = list[index - 1]
      list[index - 1] = list[index]
      list[index] = temp
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index + 1]
      list[index + 1] = list[index]
      list[index] = temp
    }
    return true
  }
  for (const node of list) {
    if (node.children?.length && moveNodeInList(node.children, id, direction)) return true
  }
  return false
}

function onPropertyUpdate(_node: any) {
  // reactive 会自动更新，这里仅做校验或后续扩展
}

function handlePreview() {
  previewVisible.value = true
}

async function handleSave() {
  await pageApi.savePage({
    id: page.id,
    code: page.code,
    name: page.name,
    description: page.description,
    status: page.status,
    config: {
      title: config.title,
      description: config.description,
      components: config.components
    }
  })
  alert('保存成功')
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.designer-page { padding: 8px; }
.toolbar { display: flex; justify-content: space-between; margin-bottom: 12px; }
.designer-layout { display: flex; gap: 12px; min-height: 600px; }
.component-library { width: 180px; background: #fff; border: 1px solid #ddd; padding: 12px; }
.canvas-panel { flex: 1; background: #fff; border: 1px solid #ddd; padding: 12px; display: flex; flex-direction: column; }
.property-panel { width: 280px; background: #fff; border: 1px solid #ddd; padding: 12px; }
.panel-title { font-weight: bold; margin-bottom: 12px; }
.component-group { margin-bottom: 12px; }
.group-title { color: #666; font-size: 12px; margin-bottom: 6px; }
.component-item { padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 6px; cursor: grab; background: #f8f8f8; }
.component-item:hover { background: #f0f0f0; }
.canvas-body { flex: 1; border: 1px dashed #ccc; padding: 12px; position: relative; }
.canvas-body.is-empty { display: flex; align-items: center; justify-content: center; }
.empty-tip { color: #999; }
</style>
