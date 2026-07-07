<template>
  <div class="designer-page">
    <designer-toolbar
      :can-undo="canUndo"
      :can-redo="canRedo"
      :zoom="zoom"
      :show-grid="showGrid"
      :has-selected="!!selectedNode"
      :has-clipboard="!!clipboardNode"
      :is-dark="isDark"
      @back="goBack"
      @undo="undo"
      @redo="redo"
      @copy="copySelectedNode"
      @paste="handlePasteNode"
      @zoom-out="zoomOut"
      @zoom-reset="zoomReset"
      @zoom-in="zoomIn"
      @toggle-grid="showGrid = !showGrid"
      @preview="handlePreview"
      @preview-config="handlePreviewConfig"
      @save="handleSave"
      @toggle-dark="toggleDark"
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
              @add="handleAddComponent"
            />

            <outline-panel
              v-else-if="leftPanelMode === 'outline'"
              :components="config.components"
              :selected-id="selectedId"
              @select="selectNode"
              @reorder="handleReorder"
              @move-to-root="handleMoveNodeToRoot"
            />

            <page-info-panel
              v-else
              :code="currentPage?.code || ''"
              :name="currentPageName"
              :config-text="pageInfoConfigText"
              @update:name="currentPageName = $event"
              @update:config-text="pageInfoConfigText = $event"
              @apply="handleApplyPageInfo"
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
          @drop="handleDropToRootWithFlush"
          @wheel="handleCanvasWheel"
          @select="selectNode"
          @delete="handleDeleteNode"
          @move="handleMoveNode"
          @reorder="handleReorder"
          @move-to-root="handleMoveNodeToRoot"
          @change="handleNodeChange"
        />

        <!-- 属性面板 -->
        <property-panel
          v-if="!isMobile || activePanel === 'property'"
          :selected-node="selectedNode"
          @update="onPropertyUpdate"
        />
      </div>
    </div>

    <!-- 移动端底部操作条 -->
    <div v-if="isMobile && selectedNode" class="mobile-action-bar">
      <component :is="buttonTag" :size="globalSize" @click="handleMoveNode({ id: selectedId, direction: 'up' })">上移</component>
      <component :is="buttonTag" :size="globalSize" @click="handleMoveNode({ id: selectedId, direction: 'down' })">下移</component>
      <component :is="buttonTag" :size="globalSize" type="danger" @click="handleDeleteNode({ id: selectedId })">删除</component>
    </div>

    <component :is="dialogTag" v-model="previewVisible" title="页面预览" :width="900">
      <page-renderer :code="page.code" :config="config" :preview="true" />
      <template #footer>
        <component :is="buttonTag" @click="previewVisible = false">关闭</component>
      </template>
    </component>

    <component :is="dialogTag" v-model="configVisible" title="页面配置（JSON）" :width="700">
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
import { listComponents, listComponentsByCategory } from './plugin-manager'
import { usePageHistory } from './composables/usePageHistory'
import { usePageSelection } from './composables/usePageSelection'
import { usePageDragDrop } from './composables/usePageDragDrop'
import { useNodeTree } from './composables/useNodeTree'
import { createDefaultComponent, generateId } from './utils/createDefaultComponent'
import './built-in-components'
import { usePrefix, useGlobalSize } from '../../utils/prefix'
import type { PageConfig, PageNode, PageItem, ComponentGroup } from './types'

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const buttonTag = withPrefix('button')
const dialogTag = withPrefix('dialog')
const inputTag = withPrefix('input')

defineOptions({ name: 'WPageDesigner' })

type ThemeMode = 'light' | 'dark' | 'auto'

const props = withDefaults(
  defineProps<{
    code?: string
    page?: any
    config?: PageConfig
    loadPage?: (code: string) => Promise<any>
    savePage?: (data: any) => Promise<any>
    isMobile?: boolean
    mode?: ThemeMode
  }>(),
  { mode: 'auto' }
)

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
const selection = usePageSelection(() => config.components || [])
const { selectedId, selectedNode, findNode, select } = selection

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
const activeMode = ref<ThemeMode>(props.mode)

function isSystemDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = computed(() => {
  if (activeMode.value === 'dark') return true
  if (activeMode.value === 'light') return false
  return isSystemDark()
})

function applyDarkClass() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', isDark.value)
}

function toggleDark() {
  activeMode.value = isDark.value ? 'light' : 'dark'
}

watch(isDark, applyDarkClass, { immediate: true })
watch(() => props.mode, (mode) => { activeMode.value = mode })

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

function takeSnapshot<T>(cfg: T): T {
  return JSON.parse(JSON.stringify(cfg))
}

const history = usePageHistory<PageConfig>({
  maxLength: 50,
  snapshot: takeSnapshot,
  onRestore: (snapshot) => {
    Object.assign(config, snapshot)
    selectedId.value = ''
  }
})

const canUndo = history.canUndo
const canRedo = history.canRedo

function recordHistory(cfg: PageConfig = config) {
  history.record(cfg)
}

let propertyChangeTimer: ReturnType<typeof setTimeout> | null = null
const PROPERTY_CHANGE_DELAY = 300

function recordPropertyChange() {
  if (propertyChangeTimer) clearTimeout(propertyChangeTimer)
  propertyChangeTimer = setTimeout(() => {
    propertyChangeTimer = null
    recordHistory()
  }, PROPERTY_CHANGE_DELAY)
}

function flushPropertyChange() {
  if (!propertyChangeTimer) return
  clearTimeout(propertyChangeTimer)
  propertyChangeTimer = null
  recordHistory()
}

function undo() {
  flushPropertyChange()
  history.undo()
}

function redo() {
  flushPropertyChange()
  history.redo()
}

function wrapForContainer(node: PageNode, containerType: string): PageNode {
  if (containerType === 'row' && node.type !== 'col') {
    const col = createDefaultComponent('col')
    col.children = [node]
    return col
  }
  return node
}

const dragDrop = usePageDragDrop({
  getComponents: () => config.components || [],
  findNode,
  isContainerNode,
  createDefaultComponent,
  wrapForContainer,
  onSelect: selectNode,
  onChange: recordHistory
})
const { handleDragStart, handleDropToRoot, handleTouchStart } = dragDrop

const nodeTree = useNodeTree({
  getComponents: () => config.components || [],
  selectedNode,
  selectedId,
  isContainerNode,
  createDefaultComponent,
  wrapForContainer,
  onSelect: selectNode,
  onChange: recordHistory
})
const { addComponent, deleteNode, moveNode, moveNodeTo, moveNodeToRoot } = nodeTree

function handleAddComponent(type: string) {
  flushPropertyChange()
  addComponent(type)
}

function handleDropToRootWithFlush(event: DragEvent) {
  flushPropertyChange()
  handleDropToRoot(event)
}

function handleDeleteNode(payload: { id: string }) {
  flushPropertyChange()
  deleteNode(payload)
}

function handleMoveNode(payload: { id: string; direction: 'up' | 'down' }) {
  flushPropertyChange()
  moveNode(payload)
}

function handleReorder(payload: { sourceId: string; targetId: string; position: 'before' | 'after' | 'inside' }) {
  flushPropertyChange()
  moveNodeTo(payload)
}

function handleMoveNodeToRoot(payload: { sourceId: string }) {
  flushPropertyChange()
  moveNodeToRoot(payload.sourceId)
}

function handleNodeChange() {
  flushPropertyChange()
  recordHistory()
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

function handlePasteNode() {
  flushPropertyChange()
  pasteNode()
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
      handlePasteNode()
      return
    }
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (selectedNode.value) {
      event.preventDefault()
      handleDeleteNode({ id: selectedId.value })
    }
  } else if (event.key === 'Escape') {
    selectedId.value = ''
  }
}

const componentIconMap: Record<string, string> = {
  // 布局
  container: 'box',
  card: 'card',
  row: 'layout',
  col: 'layout',
  tabs: 'tabs',
  collapse: 'collapse',
  space: 'space',
  'page-header': 'document',
  'page-container': 'box',
  layout: 'layout',
  border: 'border',
  splitter: 'splitter',
  affix: 'affix',
  // 展示
  text: 'font',
  typography: 'font',
  image: 'image',
  divider: 'divider',
  statistic: 'stats',
  chart: 'chart',
  alert: 'alert',
  tag: 'tag',
  progress: 'progress',
  avatar: 'avatar',
  badge: 'badge',
  steps: 'steps',
  timeline: 'timeline',
  table: 'table',
  list: 'list',
  descriptions: 'descriptions',
  empty: 'empty',
  result: 'info',
  skeleton: 'skeleton',
  carousel: 'carousel',
  // 表单
  input: 'input',
  textarea: 'input',
  'input-number': 'number',
  'input-tag': 'tag',
  'input-otp': 'checkbox',
  select: 'select',
  radio: 'radio',
  checkbox: 'checkbox',
  switch: 'switch',
  'date-picker': 'calendar',
  'date-picker-panel': 'date-picker-panel',
  'date-time-picker': 'calendar',
  'time-picker': 'clock',
  'time-select': 'clock',
  calendar: 'calendar',
  cascader: 'cascader',
  'tree-select': 'tree',
  autocomplete: 'autocomplete',
  mention: 'message',
  slider: 'slider',
  rate: 'rate',
  'color-picker': 'color',
  'color-picker-panel': 'color',
  upload: 'upload',
  transfer: 'transfer',
  form: 'form',
  'dynamic-form': 'dynamic-form',
  'search-form': 'search-form',
  // 数据
  model: 'model',
  dashboard: 'dashboard',
  report: 'report',
  'crud-table': 'table',
  'advanced-query-builder': 'query-builder',
  'query-builder': 'query-builder',
  'virtualized-table': 'table',
  'virtualized-select': 'select',
  'virtualized-tree': 'tree',
  // 交互
  button: 'button',
  link: 'link',
  dropdown: 'menu',
  dialog: 'dialog',
  drawer: 'drawer',
  popover: 'popover',
  popconfirm: 'alert',
  tooltip: 'tooltip',
  menu: 'menu',
  pagination: 'pagination',
  breadcrumb: 'breadcrumb',
  segmented: 'segmented',
  tour: 'tour',
  backtop: 'backtop',
  anchor: 'anchor',
  // 其他
  monaco: 'code',
  'monaco-editor': 'code',
  'rich-text': 'rich-text',
  watermark: 'image',
  permission: 'lock',
  loading: 'loading',
  infinite: 'infinite-scroll',
  'infinite-scroll': 'infinite-scroll',
  scrollbar: 'scrollbar',
  icon: 'star',
  notification: 'notification',
  message: 'message',
  'message-box': 'message-box',
  'config-provider': 'settings',
  'page-designer': 'page-designer'
}

function getComponentIcon(type: string) {
  return componentIconMap[type] || 'component'
}

const layoutTypes = computed(() => [
  { label: '容器', value: 'container', icon: getComponentIcon('container') },
  { label: '卡片', value: 'card', icon: getComponentIcon('card') },
  { label: '栅格', value: 'row', icon: getComponentIcon('row') },
  { label: '列', value: 'col', icon: getComponentIcon('col') },
  { label: '标签页', value: 'tabs', icon: getComponentIcon('tabs') },
  { label: '折叠面板', value: 'collapse', icon: getComponentIcon('collapse') },
  { label: '间距', value: 'space', icon: getComponentIcon('space') },
  ...listComponentsByCategory('layout').map((c) => ({ label: c.label, value: c.type, icon: c.icon || getComponentIcon(c.type) }))
])

const displayTypes = computed(() => [
  { label: '文本', value: 'text', icon: getComponentIcon('text') },
  { label: '图片', value: 'image', icon: getComponentIcon('image') },
  { label: '分隔线', value: 'divider', icon: getComponentIcon('divider') },
  { label: '统计卡片', value: 'statistic', icon: getComponentIcon('statistic') },
  { label: '图表', value: 'chart', icon: getComponentIcon('chart') },
  { label: '公告', value: 'alert', icon: getComponentIcon('alert') },
  { label: '标签', value: 'tag', icon: getComponentIcon('tag') },
  { label: '进度条', value: 'progress', icon: getComponentIcon('progress') },
  { label: '头像', value: 'avatar', icon: getComponentIcon('avatar') },
  { label: '徽标', value: 'badge', icon: getComponentIcon('badge') },
  { label: '步骤条', value: 'steps', icon: getComponentIcon('steps') },
  { label: '时间线', value: 'timeline', icon: getComponentIcon('timeline') },
  { label: '表格', value: 'table', icon: getComponentIcon('table') },
  { label: '列表', value: 'list', icon: getComponentIcon('list') },
  ...listComponentsByCategory('display').map((c) => ({ label: c.label, value: c.type, icon: c.icon || getComponentIcon(c.type) }))
])

const dataTypes = computed(() => [
  { label: '数据模型', value: 'model', icon: getComponentIcon('model') },
  { label: '仪表盘', value: 'dashboard', icon: getComponentIcon('dashboard') },
  { label: '报表', value: 'report', icon: getComponentIcon('report') },
  { label: 'CRUD表格', value: 'crud-table', icon: getComponentIcon('crud-table') },
  { label: '高级查询', value: 'advanced-query-builder', icon: getComponentIcon('advanced-query-builder') },
  ...listComponentsByCategory('data').map((c) => ({ label: c.label, value: c.type, icon: c.icon || getComponentIcon(c.type) }))
])

const actionTypes = computed(() => [
  { label: '按钮', value: 'button', icon: getComponentIcon('button') },
  { label: '链接', value: 'link', icon: getComponentIcon('link') },
  ...listComponentsByCategory('action').map((c) => ({ label: c.label, value: c.type, icon: c.icon || getComponentIcon(c.type) }))
])

const formTypes = computed(() => [
  { label: '输入框', value: 'input', icon: getComponentIcon('input') },
  { label: '选择器', value: 'select', icon: getComponentIcon('select') },
  { label: '单选框', value: 'radio', icon: getComponentIcon('radio') },
  { label: '多选框', value: 'checkbox', icon: getComponentIcon('checkbox') },
  { label: '日期选择', value: 'date-picker', icon: getComponentIcon('date-picker') },
  { label: '开关', value: 'switch', icon: getComponentIcon('switch') },
  ...listComponentsByCategory('form').map((c) => ({ label: c.label, value: c.type, icon: c.icon || getComponentIcon(c.type) }))
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
  { key: 'layout', title: '布局', items: layoutTypes.value },
  { key: 'display', title: '展示', items: displayTypes.value },
  { key: 'form', title: '表单', items: formTypes.value },
  { key: 'data', title: '数据', items: dataTypes.value },
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
  history.init(config)
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
    history.init(config)
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

function handleApplyPageInfo() {
  flushPropertyChange()
  applyPageInfo()
}

function selectNode(id: string) {
  flushPropertyChange()
  select(id)
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

function onPropertyUpdate(_node: PageNode) {
  // 属性编辑使用防抖，避免连续输入产生大量撤销点
  recordPropertyChange()
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
  flushPropertyChange()
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
.mobile-action-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: var(--w-bg-color);
  border-top: 1px solid var(--w-border-color);
  justify-content: center;
  gap: 12px;
  z-index: 100;
}

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
  .mobile-action-bar {
    display: flex;
  }
}
</style>
