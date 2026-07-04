<template>
  <div class="designer-page">
    <designer-toolbar
      :can-undo="canUndo"
      :can-redo="canRedo"
      :zoom="zoom"
      :show-grid="showGrid"
      :has-selected="!!selectedNode"
      :has-clipboard="!!clipboardNode"
      @back="goBack"
      @undo="undo"
      @redo="redo"
      @copy="copySelectedNode"
      @paste="pasteNode"
      @zoom-out="zoomOut"
      @zoom-reset="zoomReset"
      @zoom-in="zoomIn"
      @toggle-grid="showGrid = !showGrid"
      @preview="handlePreview"
      @preview-config="handlePreviewConfig"
      @save="handleSave"
    />

    <div v-if="isMobile" class="mobile-panel-tabs">
      <div
        v-for="tab in mobileTabs"
        :key="tab.value"
        :class="['mobile-panel-tab', { active: activePanel === tab.value }]"
        @click="activePanel = tab.value"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="designer-workspace" :class="{ mobile: isMobile }">
      <designer-page-tabs
        :pages="allPages"
        :active-code="activePageCode"
        @switch="switchPage"
        @add="addSubPage"
        @delete="deleteSubPage"
      />

      <div class="designer-layout">
        <!-- 左侧边栏 + 面板 -->
        <div v-if="!isMobile || activePanel === 'library' || activePanel === 'outline' || activePanel === 'pages'" class="left-panel">
          <designer-sidebar
            :mode="leftPanelMode"
            @change-mode="leftPanelMode = $event"
          />

          <div class="left-panel-content">
            <component-library-panel
              v-if="leftPanelMode === 'library'"
              :groups="componentGroups"
              :expanded-groups="expandedGroups"
              :global-size="globalSize"
              :is-mobile="isMobile"
              @drag-start="handleDragStart"
              @touch-start="handleTouchStart"
              @toggle-group="toggleGroup"
            />

            <outline-panel
              v-else-if="leftPanelMode === 'outline'"
              :components="config.components"
              :selected-id="selectedId"
              @select="selectNode"
            />

            <page-info-panel
              v-else
              :code="currentPage?.code || ''"
              :name="currentPageName"
              :config-text="pageInfoConfigText"
              @update:name="currentPageName = $event"
              @update:config-text="pageInfoConfigText = $event"
              @apply="applyPageInfo"
              @reset="resetPageInfo"
            />
          </div>
        </div>

        <!-- 画布 -->
        <designer-canvas
          v-if="!isMobile || activePanel === 'canvas'"
          :components="config.components"
          :selected-id="selectedId"
          :zoom="zoom"
          :show-grid="showGrid"
          @drop="handleDropToRoot"
          @wheel="handleCanvasWheel"
          @select="selectNode"
          @delete="deleteNode"
          @move="moveNode"
          @change="recordHistory"
        />

        <!-- 属性面板 -->
        <property-panel
          v-if="!isMobile || activePanel === 'property'"
          :selected-node="selectedNode"
          @update="onPropertyUpdate"
        />
      </div>
    </div>

    <component :is="dialogTag" v-model="previewVisible" title="页面预览" width="900">
      <page-renderer :code="page.code" :config="config" :preview="true" />
      <template #footer>
        <component :is="buttonTag" @click="previewVisible = false">关闭</component>
      </template>
    </component>

    <component :is="dialogTag" v-model="configVisible" title="页面配置（JSON）" width="700">
      <component :is="inputTag" v-model="configJson" type="textarea" :rows="16" readonly />
      <template #footer>
        <component :is="buttonTag" @click="configVisible = false">关闭</component>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import PageRenderer from './page-renderer.vue'
import DesignerToolbar from './designer-toolbar.vue'
import DesignerPageTabs from './designer-page-tabs.vue'
import DesignerSidebar from './designer-sidebar.vue'
import ComponentLibraryPanel from './component-library-panel.vue'
import OutlinePanel from './outline-panel.vue'
import PageInfoPanel from './page-info-panel.vue'
import DesignerCanvas from './designer-canvas.vue'
import PropertyPanel from './property-panel.vue'
import { getChart, listComponents, listComponentsByCategory } from './plugin-manager'
import './built-in-components'
import { usePrefix, useGlobalSize } from '../../utils/prefix'
import type { PageConfig, PageNode, PageItem, ComponentGroup } from './types'

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const buttonTag = withPrefix('button')
const dialogTag = withPrefix('dialog')
const inputTag = withPrefix('input')

defineOptions({ name: 'WPageDesigner' })

const props = defineProps<{
  code?: string
  page?: any
  config?: PageConfig
  loadPage?: (code: string) => Promise<any>
  savePage?: (data: any) => Promise<any>
  isMobile?: boolean
}>()

const emit = defineEmits(['save', 'back', 'preview'])

const page = reactive<any>({ code: props.code || '', name: '', description: '', status: 1 })
const config = reactive<PageConfig>({
  title: '',
  description: '',
  formData: {},
  components: []
})

const allPages = reactive<PageItem[]>([])
const activePageCode = ref('')
const selectedId = ref<string>('')
const previewVisible = ref(false)
const configVisible = ref(false)
const leftPanelMode = ref<'library' | 'outline' | 'pages'>('library')
const activePanel = ref<'library' | 'outline' | 'pages' | 'canvas' | 'property'>('canvas')
const zoom = ref(1)
const minZoom = 0.5
const maxZoom = 2
const zoomStep = 0.1
const showGrid = ref(false)
const pageInfoConfigText = ref('')

const currentPage = computed(() => allPages.find((p) => p.code === activePageCode.value))
const currentPageName = computed({
  get: () => currentPage.value?.name || '',
  set: (val) => {
    if (currentPage.value) currentPage.value.name = val
    if (currentPage.value?.isMain) {
      page.name = val
    }
  }
})

function zoomIn() {
  zoom.value = Math.min(maxZoom, Math.round((zoom.value + zoomStep) * 10) / 10)
}

function zoomOut() {
  zoom.value = Math.max(minZoom, Math.round((zoom.value - zoomStep) * 10) / 10)
}

function zoomReset() {
  zoom.value = 1
}

function handleCanvasWheel(event: WheelEvent) {
  if (!event.ctrlKey && !event.metaKey) return
  event.preventDefault()
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

const configJson = computed(() => JSON.stringify(config, null, 2))

// 撤销/重做历史栈
const history = reactive<{
  stack: PageConfig[]
  index: number
  maxLength: number
  isRestoring: boolean
}>({
  stack: [],
  index: -1,
  maxLength: 50,
  isRestoring: false
})

const canUndo = computed(() => history.index > 0)
const canRedo = computed(() => history.index < history.stack.length - 1)

function takeSnapshot<T>(cfg: T): T {
  return JSON.parse(JSON.stringify(cfg))
}

function recordHistory(cfg: PageConfig = config) {
  if (history.isRestoring) return
  const snapshot = takeSnapshot(cfg)
  // 删除当前指针之后的历史（重做记录）
  if (history.index < history.stack.length - 1) {
    history.stack = history.stack.slice(0, history.index + 1)
  }
  history.stack.push(snapshot)
  if (history.stack.length > history.maxLength) {
    history.stack.shift()
  } else {
    history.index++
  }
}

function undo() {
  if (!canUndo.value) return
  history.index--
  restoreHistory()
}

function redo() {
  if (!canRedo.value) return
  history.index++
  restoreHistory()
}

function restoreHistory() {
  const snapshot = history.stack[history.index]
  if (!snapshot) return
  history.isRestoring = true
  Object.assign(config, takeSnapshot(snapshot))
  selectedId.value = ''
  history.isRestoring = false
}

const clipboardNode = ref<PageNode | null>(null)

function cloneNodeWithNewIds(node: PageNode): PageNode {
  const cloned = takeSnapshot(node) as PageNode
  cloned.id = generateId()
  if (cloned.children?.length) {
    cloned.children = cloned.children.map(cloneNodeWithNewIds)
  }
  return cloned
}

function copySelectedNode() {
  const node = selectedNode.value
  if (!node) return
  clipboardNode.value = cloneNodeWithNewIds(node)
}

function pasteNode() {
  const source = clipboardNode.value
  if (!source) return
  const pasted = cloneNodeWithNewIds(source)
  const targetContainer = selectedNode.value && isContainerNode(selectedNode.value) ? selectedNode.value : null
  if (targetContainer) {
    if (!targetContainer.children) targetContainer.children = []
    targetContainer.children.push(pasted)
  } else {
    if (!config.components) config.components = []
    config.components.push(pasted)
  }
  selectNode(pasted.id)
  recordHistory()
}

function handleKeyDown(event: KeyboardEvent) {
  const isCtrl = event.ctrlKey || event.metaKey
  if (isCtrl) {
    if (event.key === 'z' && !event.shiftKey) {
      event.preventDefault()
      undo()
      return
    } else if ((event.key === 'z' && event.shiftKey) || event.key === 'y') {
      event.preventDefault()
      redo()
      return
    } else if (event.key === 'c') {
      event.preventDefault()
      copySelectedNode()
      return
    } else if (event.key === 'v') {
      event.preventDefault()
      pasteNode()
      return
    }
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (selectedNode.value) {
      event.preventDefault()
      deleteNode({ id: selectedId.value })
    }
  } else if (event.key === 'Escape') {
    selectedId.value = ''
  }
}

const touchState = reactive({
  type: '',
  label: '',
  startX: 0,
  startY: 0,
  dragging: false,
  ghost: null as HTMLElement | null
})

const layoutTypes = [
  { label: '容器', value: 'container' },
  { label: '卡片', value: 'card' },
  { label: '栅格', value: 'row' },
  { label: '标签页', value: 'tabs' }
]

const displayTypes = computed(() => [
  { label: '文本', value: 'text' },
  { label: '图片', value: 'image' },
  { label: '分隔线', value: 'divider' },
  { label: '统计卡片', value: 'statistic' },
  { label: '图表', value: 'chart' },
  { label: '公告', value: 'alert' },
  { label: '标签', value: 'tag' },
  { label: '进度条', value: 'progress' },
  { label: '头像', value: 'avatar' },
  { label: '徽标', value: 'badge' },
  { label: '步骤条', value: 'steps' },
  { label: '时间线', value: 'timeline' },
  { label: '表格', value: 'table' },
  { label: '列表', value: 'list' },
  ...listComponentsByCategory('display').map((c) => ({ label: c.label, value: c.type }))
])

const dataTypes = [
  { label: '数据模型', value: 'model' },
  { label: '仪表盘', value: 'dashboard' },
  { label: '报表', value: 'report' }
]

const actionTypes = computed(() => [
  { label: '按钮', value: 'button' },
  { label: '链接', value: 'link' },
  ...listComponentsByCategory('action').map((c) => ({ label: c.label, value: c.type }))
])

const formTypes = computed(() => [
  { label: '输入框', value: 'input' },
  { label: '选择器', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '多选框', value: 'checkbox' },
  { label: '日期选择', value: 'date-picker' },
  { label: '开关', value: 'switch' },
  ...listComponentsByCategory('form').map((c) => ({ label: c.label, value: c.type }))
])

const expandedGroups = reactive<Record<string, boolean>>({
  layout: true,
  display: true,
  form: true,
  data: true,
  action: true
})

function toggleGroup(key: string) {
  expandedGroups[key] = !expandedGroups[key]
}

const componentGroups = computed<ComponentGroup[]>(() => [
  { key: 'layout', title: '布局', items: layoutTypes },
  { key: 'display', title: '展示', items: displayTypes.value },
  { key: 'form', title: '表单', items: formTypes.value },
  { key: 'data', title: '数据', items: dataTypes },
  { key: 'action', title: '交互', items: actionTypes.value }
])

const mobileTabs = [
  { label: '组件库', value: 'library' as const },
  { label: '大纲', value: 'outline' as const },
  { label: '页面信息', value: 'pages' as const },
  { label: '画布', value: 'canvas' as const },
  { label: '属性', value: 'property' as const }
]

const isMobile = computed(() => !!props.isMobile)

const selectedNode = computed(() => {
  return findNode(config.components || [], selectedId.value)
})

onMounted(() => {
  loadData()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

async function loadData() {
  if (props.page) {
    Object.assign(page, props.page)
  } else if (props.code && props.loadPage) {
    const data = await props.loadPage(props.code)
    Object.assign(page, data)
  }

  let cfg: PageConfig
  if (props.config) {
    cfg = takeSnapshot(props.config) as PageConfig
  } else {
    cfg = takeSnapshot(page.config || {}) as PageConfig
  }

  config.title = cfg.title || page.name || ''
  config.description = cfg.description || page.description || ''
  config.formData = cfg.formData || {}
  config.components = cfg.components || []
  config.subPages = cfg.subPages || []

  initPages()

  // 初始状态记入历史
  history.stack = [takeSnapshot(config)]
  history.index = 0
}

function initPages() {
  const mainCfg = takeSnapshot(config) as PageConfig
  const subPages = mainCfg.subPages || []
  delete (mainCfg as any).subPages

  allPages.length = 0
  allPages.push({
    code: page.code || 'main',
    name: page.name || '主页面',
    config: mainCfg,
    isMain: true
  })
  for (const sp of subPages) {
    allPages.push({
      code: sp.code,
      name: sp.name || sp.code,
      config: (sp.config || { components: [] }) as PageConfig
    })
  }

  activePageCode.value = page.code || 'main'
  Object.assign(config, takeSnapshot(mainCfg))
  resetPageInfo()
}

function switchPage(code: string) {
  if (code === activePageCode.value) return
  const current = allPages.find((p) => p.code === activePageCode.value)
  if (current) {
    current.config = takeSnapshot(config) as PageConfig
  }
  const target = allPages.find((p) => p.code === code)
  if (target) {
    Object.assign(config, takeSnapshot(target.config))
    activePageCode.value = code
    selectedId.value = ''
    history.stack = [takeSnapshot(config)]
    history.index = 0
    resetPageInfo()
  }
}

function addSubPage() {
  const index = allPages.length
  const code = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`
  const newPage: PageItem = {
    code,
    name: `子页面${index}`,
    config: { components: [] }
  }
  allPages.push(newPage)
  switchPage(code)
}

function deleteSubPage(code: string) {
  const index = allPages.findIndex((p) => p.code === code)
  if (index <= 0) return
  allPages.splice(index, 1)
  if (activePageCode.value === code) {
    switchPage(allPages[0].code)
  }
}

watch(activePageCode, resetPageInfo)

function resetPageInfo() {
  const snapshot = takeSnapshot(config)
  if (currentPage.value?.isMain) {
    delete (snapshot as any).subPages
  }
  pageInfoConfigText.value = JSON.stringify(snapshot, null, 2)
}

function applyPageInfo() {
  let cfg: PageConfig
  try {
    cfg = JSON.parse(pageInfoConfigText.value || '{}')
  } catch {
    window.alert('配置 JSON 格式错误')
    return
  }
  if (currentPage.value?.isMain) {
    cfg.subPages = allPages.slice(1).map((p) => ({ code: p.code, name: p.name, config: p.config }))
  }
  Object.assign(config, cfg)
  recordHistory()
  const current = allPages.find((p) => p.code === activePageCode.value)
  if (current) {
    current.config = takeSnapshot(config) as PageConfig
  }
}

function findNode(list: PageNode[], id: string): PageNode | null {
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
    case 'chart': {
      const chartPlugin = getChart('echarts')
      return { ...base, props: { height: '300px', chartType: 'echarts' }, dataSource: { type: 'static' }, option: chartPlugin ? chartPlugin.defaultOption() : {} }
    }
    case 'alert':
      return { ...base, props: { content: '公告内容', type: 'info' } }
    case 'tag':
      return { ...base, props: { label: '标签', type: 'default' } }
    case 'progress':
      return { ...base, props: { percentage: 50, status: '', width: 200, showText: true } }
    case 'avatar':
      return { ...base, props: { src: '', alt: '用户', icon: 'user', shape: 'circle' } }
    case 'badge':
      return { ...base, props: { text: '徽标', value: 5, isDot: false, type: 'danger' } }
    case 'steps':
      return { ...base, props: { items: [{ title: '步骤1' }, { title: '步骤2' }, { title: '步骤3' }], active: 1 } }
    case 'timeline':
      return { ...base, props: { items: [{ time: '2026-07-01', title: '事件1', content: '描述内容', color: '#245edb' }, { time: '2026-07-02', title: '事件2' }] } }
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
    case 'input':
      return { ...base, props: { label: '输入框', placeholder: '请输入', type: 'text', modelValue: '' } }
    case 'select':
      return { ...base, props: { label: '选择器', placeholder: '请选择', options: [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }], modelValue: '' } }
    case 'radio':
      return { ...base, props: { label: '单选框', options: [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }], modelValue: '' } }
    case 'checkbox':
      return { ...base, props: { label: '多选框', options: [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }], modelValue: [] } }
    case 'date-picker':
      return { ...base, props: { label: '日期', placeholder: '请选择日期', modelValue: '' } }
    case 'switch':
      return { ...base, props: { label: '开关', modelValue: false } }
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
  recordHistory()
}

function selectNode(id: string) {
  selectedId.value = id
  if (isMobile.value) {
    activePanel.value = 'property'
  }
}

function isContainerNode(node: PageNode | null): boolean {
  if (!node) return false
  if (['container', 'card', 'row', 'tabs'].includes(node.type)) return true
  const pluginDef = listComponents().find((c) => c.type === node.type)
  return !!pluginDef?.isContainer
}

function addComponent(type: string) {
  const targetContainer = selectedNode.value && isContainerNode(selectedNode.value) ? selectedNode.value : null
  if (targetContainer) {
    if (!targetContainer.children) targetContainer.children = []
    const node = createDefaultComponent(type)
    targetContainer.children.push(node)
    selectNode(node.id)
  } else {
    if (!config.components) config.components = []
    const node = createDefaultComponent(type)
    config.components.push(node)
    selectNode(node.id)
  }
  recordHistory()
}

function handleTouchStart(event: TouchEvent, label: string, type: string) {
  const touch = event.touches[0]
  touchState.type = type
  touchState.label = label
  touchState.startX = touch.clientX
  touchState.startY = touch.clientY
  touchState.dragging = false
  document.addEventListener('touchmove', handleTouchMove, { passive: false })
  document.addEventListener('touchend', handleTouchEnd)
}

function handleTouchMove(event: TouchEvent) {
  if (!touchState.type) return
  const touch = event.touches[0]
  const dx = touch.clientX - touchState.startX
  const dy = touch.clientY - touchState.startY
  if (!touchState.dragging && Math.sqrt(dx * dx + dy * dy) > 10) {
    touchState.dragging = true
    touchState.ghost = createGhost(touchState.label)
  }
  if (touchState.dragging) {
    event.preventDefault()
    if (touchState.ghost) {
      touchState.ghost.style.left = `${touch.clientX}px`
      touchState.ghost.style.top = `${touch.clientY}px`
    }
    highlightDropTarget(touch.clientX, touch.clientY)
  }
}

function handleTouchEnd(event: TouchEvent) {
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  if (touchState.dragging && touchState.ghost) {
    const touch = event.changedTouches[0]
    doDrop(touch.clientX, touch.clientY)
    touchState.ghost.remove()
  } else {
    addComponent(touchState.type)
  }
  clearDropHighlight()
  touchState.type = ''
  touchState.label = ''
  touchState.dragging = false
  touchState.ghost = null
}

function createGhost(text: string) {
  const el = document.createElement('div')
  el.className = 'drag-ghost'
  el.textContent = text
  document.body.appendChild(el)
  return el
}

function findDropTarget(x: number, y: number) {
  let element = document.elementFromPoint(x, y)
  while (element && element !== document.body) {
    const droppable = element.getAttribute('data-droppable')
    if (droppable === 'root') return { type: 'root' as const }
    if (droppable === 'container') {
      const nodeId = element.getAttribute('data-node-id')
      if (nodeId) return { type: 'container' as const, nodeId }
    }
    element = element.parentElement
  }
  return null
}

function highlightDropTarget(x: number, y: number) {
  clearDropHighlight()
  const target = findDropTarget(x, y)
  if (!target) return
  if (target.type === 'root') {
    document.querySelector('.canvas-body')?.classList.add('drop-target-active')
  } else {
    document.querySelector(`[data-node-id="${target.nodeId}"][data-droppable="container"]`)?.classList.add('drop-target-active')
  }
}

function clearDropHighlight() {
  document.querySelectorAll('.drop-target-active').forEach((el) => el.classList.remove('drop-target-active'))
}

function doDrop(x: number, y: number) {
  const target = findDropTarget(x, y)
  if (!target) return
  const node = createDefaultComponent(touchState.type)
  if (target.type === 'root') {
    if (!config.components) config.components = []
    config.components.push(node)
  } else {
    const container = findNode(config.components || [], target.nodeId)
    if (container && isContainerNode(container)) {
      if (!container.children) container.children = []
      container.children.push(node)
    } else {
      if (!config.components) config.components = []
      config.components.push(node)
    }
  }
  selectNode(node.id)
  recordHistory()
}

function deleteNode({ id }: { id: string }) {
  removeNode(config.components || [], id)
  if (selectedId.value === id) selectedId.value = ''
  recordHistory()
}

function removeNode(list: PageNode[], id: string): boolean {
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
  const moved = moveNodeInList(config.components || [], id, direction)
  if (moved) recordHistory()
}

function moveNodeInList(list: PageNode[], id: string, direction: 'up' | 'down'): boolean {
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

function onPropertyUpdate(_node: PageNode) {
  // reactive 会自动更新，这里记录属性变更历史
  recordHistory()
}

function handlePreview() {
  previewVisible.value = true
  emit('preview')
}

function handlePreviewConfig() {
  configVisible.value = true
}

function buildFormData(components: PageNode[]): Record<string, any> {
  const formTypes = new Set(['input', 'select', 'switch', 'radio', 'checkbox', 'date-picker'])
  const result: Record<string, any> = {}
  function walk(list: PageNode[]) {
    for (const node of list) {
      if (formTypes.has(node.type) && node.props?.field) {
        result[node.props.field] = node.props.modelValue ?? ''
      }
      if (node.children?.length) walk(node.children)
    }
  }
  walk(components)
  return result
}

async function handleSave() {
  const current = allPages.find((p) => p.code === activePageCode.value)
  if (current) {
    current.config = takeSnapshot(config) as PageConfig
  }

  const mainPage = allPages[0]
  const subPages = allPages.slice(1).map((p) => ({
    code: p.code,
    name: p.name,
    config: p.config
  }))

  const data = {
    id: page.id,
    code: mainPage.code,
    name: mainPage.name,
    description: page.description,
    status: page.status,
    config: {
      title: mainPage.config.title,
      description: mainPage.config.description,
      formData: buildFormData(mainPage.config.components || []),
      components: mainPage.config.components,
      subPages
    }
  }
  if (props.savePage) {
    await props.savePage(data)
  }
  emit('save', data)
}

function goBack() {
  emit('back')
}
</script>

<style scoped>
.designer-page { padding: 8px; }
.designer-workspace { border: 1px solid var(--w-border-color); background: var(--w-bg-color); border-radius: 4px; overflow: hidden; }
.designer-layout { display: flex; min-height: 600px; }
.left-panel { display: flex; width: 260px; border-right: 1px solid var(--w-border-color); background: var(--w-bg-color); }
.left-panel-content { flex: 1; min-width: 0; overflow: auto; }

.mobile-panel-tabs { display: none; }

@media (max-width: 768px) {
  .designer-page { padding: 6px; }
  .designer-workspace { border-radius: 0; }
  .mobile-panel-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--w-border-color);
  }
  .mobile-panel-tab {
    flex: 1;
    text-align: center;
    padding: 8px;
    cursor: pointer;
    background: var(--w-bg-color);
    border: 1px solid var(--w-border-color);
    border-bottom: none;
    font-size: 13px;
  }
  .mobile-panel-tab.active {
    background: var(--w-color-primary);
    color: var(--w-text-color-inverse);
    border-color: var(--w-color-primary);
  }
  .designer-workspace.mobile .designer-layout {
    flex-direction: column;
    min-height: auto;
  }
  .designer-workspace.mobile .left-panel,
  .designer-workspace.mobile .canvas-panel,
  .designer-workspace.mobile .property-panel {
    width: auto;
    flex: none;
    min-height: 300px;
    border: none;
    border-bottom: 1px solid var(--w-border-color);
  }
}
</style>
