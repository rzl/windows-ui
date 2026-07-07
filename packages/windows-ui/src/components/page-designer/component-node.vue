<template>
  <div
    ref="nodeRef"
    class="component-node"
    :class="{ selected: isSelected, container: isContainer, 'drop-before': dropIndicator === 'before', 'drop-after': dropIndicator === 'after', 'drop-inside': dropIndicator === 'inside' }"
    :style="node.styles"
    @click.stop="selectNode(node.id)"
    @touchstart.passive="handleTouchStart"
    @touchend="handleTouchEnd"
    @touchmove="handleTouchMove"
    @dragenter.stop.prevent="handleDragEnter"
    @dragleave.stop.prevent="handleDragLeave"
    @dragover.stop.prevent="handleDragOver"
    @drop.stop.prevent="handleDrop"
  >
    <div class="node-toolbar">
      <span class="node-type">{{ typeLabel }}</span>
      <component :is="spaceTag">
        <component
          :is="buttonTag"
          :size="globalSize"
          icon="sort"
          title="拖动排序"
          draggable="true"
          class="drag-handle"
          @dragstart.stop="handleNodeDragStart"
          @touchstart.stop.prevent="nodeTouchReorder.handleTouchStart"
          @click.stop
        />
        <component :is="buttonTag" v-if="isContainer" :size="globalSize" icon="plus" title="添加子组件" @click.stop="addChild" />
        <component :is="buttonTag" :size="globalSize" icon="arrowUp" title="上移" @click.stop="moveUp" />
        <component :is="buttonTag" :size="globalSize" icon="arrowDown" title="下移" @click.stop="moveDown" />
        <component :is="buttonTag" :size="globalSize" type="danger" icon="delete" title="删除" @click.stop="remove" />
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
      <component
        :is="statisticTag"
        v-else-if="node.type === 'statistic'"
        :title="node.props.title"
        :value="node.dataSource?.value ?? 0"
        :prefix="node.props.prefix"
        :suffix="node.props.suffix"
        :precision="node.props.precision"
        :icon="node.props.icon"
        :color="node.props.color"
        :value-style="node.props.valueStyle"
      />

      <!-- 图表 -->
      <template v-else-if="node.type === 'chart'">
        <div class="chart-preview">[图表] {{ node.props.title || '示例图表' }}</div>
      </template>

      <!-- 公告 -->
      <template v-else-if="node.type === 'alert'">
        <component :is="alertTag" :type="node.props.type || 'info'" :title="node.props.content" :closable="false" />
      </template>

      <!-- 标签 -->
      <template v-else-if="node.type === 'tag'">
        <component :is="tagTag" :type="node.props.type || 'default'">{{ node.props.label }}</component>
      </template>

      <!-- 进度条 -->
      <template v-else-if="node.type === 'progress'">
        <component :is="progressTag" :percentage="node.props.percentage ?? 50" :status="node.props.status" :width="node.props.width ?? 200" :show-text="node.props.showText ?? true" />
      </template>

      <!-- 头像 -->
      <template v-else-if="node.type === 'avatar'">
        <component :is="avatarTag" :src="node.props.src" :alt="node.props.alt" :icon="node.props.src ? '' : (node.props.icon || 'user')" :shape="node.props.shape || 'circle'" />
      </template>

      <!-- 徽标 -->
      <template v-else-if="node.type === 'badge'">
        <component :is="badgeTag" :value="node.props.value" :is-dot="node.props.isDot" :type="node.props.type || 'danger'">{{ node.props.text || '徽标' }}</component>
      </template>

      <!-- 步骤条 -->
      <template v-else-if="node.type === 'steps'">
        <component :is="stepsTag" :items="node.props.items || []" :active="node.props.active ?? 0" />
      </template>

      <!-- 时间线 -->
      <template v-else-if="node.type === 'timeline'">
        <component :is="timelineTag" :items="node.props.items || []" />
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

      <!-- 输入框 -->
      <template v-else-if="node.type === 'input'">
        <component :is="inputTag" :model-value="node.props.modelValue" :placeholder="node.props.placeholder" :type="node.props.type || 'text'" disabled />
      </template>

      <!-- 选择器 -->
      <template v-else-if="node.type === 'select'">
        <component :is="selectTag" :model-value="node.props.modelValue" :options="node.props.options || []" :placeholder="node.props.placeholder" disabled />
      </template>

      <!-- 开关 -->
      <template v-else-if="node.type === 'switch'">
        <component :is="switchTag" :model-value="node.props.modelValue" disabled />
      </template>

      <!-- 单选框 -->
      <template v-else-if="node.type === 'radio'">
        <component :is="radioTag" :model-value="node.props.modelValue" :options="node.props.options || []" disabled />
      </template>

      <!-- 多选框 -->
      <template v-else-if="node.type === 'checkbox'">
        <component :is="checkboxTag" :model-value="node.props.modelValue" :options="node.props.options || []" disabled />
      </template>

      <!-- 日期选择 -->
      <template v-else-if="node.type === 'date-picker'">
        <component :is="datePickerTag" :model-value="node.props.modelValue" :placeholder="node.props.placeholder" disabled />
      </template>

      <!-- 容器/卡片/栅格/标签页 -->
      <template v-else-if="isContainer">
        <div v-if="node.type === 'card'" class="card-title">{{ node.props.title }}</div>
        <div v-if="node.type === 'tabs'" class="tabs-header">
          <span v-for="tab in node.props.tabs" :key="tab.name" class="tab-item">{{ tab.label || tab.title }}</span>
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
import { computed, ref } from 'vue'
import { getComponent } from './plugin-manager'
import { usePrefix, useGlobalSize } from '../../utils/prefix'
import { createChildForContainer } from './utils/createDefaultComponent'
import { useNodeTouchReorder } from './composables/useNodeTouchReorder'
import { getTypeLabel } from './property-schemas'
import type { PageNode } from './types'

defineOptions({ name: 'WPageComponentNode' })

const props = defineProps<{
  node: PageNode
  index: number
  selectedId: string
  parentList: PageNode[]
}>()

const emit = defineEmits(['select', 'delete', 'move', 'change', 'reorder', 'move-to-root'])

const nodeRef = ref<HTMLElement>()
const dragOverCount = ref(0)
const dropIndicator = ref<'before' | 'after' | 'inside' | null>(null)
const longPressTimer = ref<any>(null)
const isLongPress = ref(false)

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const alertTag = withPrefix('alert')
const statisticTag = withPrefix('statistic')
const buttonTag = withPrefix('button')
const spaceTag = withPrefix('space')
const inputTag = withPrefix('input')
const selectTag = withPrefix('select')
const switchTag = withPrefix('switch')
const radioTag = withPrefix('radio')
const checkboxTag = withPrefix('checkbox')
const datePickerTag = withPrefix('date-picker')
const tagTag = withPrefix('tag')
const progressTag = withPrefix('progress')
const avatarTag = withPrefix('avatar')
const badgeTag = withPrefix('badge')
const stepsTag = withPrefix('steps')
const timelineTag = withPrefix('timeline')

const isSelected = computed(() => props.node.id === props.selectedId)
const pluginComponent = computed(() => getComponent(props.node.type))
const isContainer = computed(() => ['container', 'card', 'row', 'col', 'tabs'].includes(props.node.type) || !!pluginComponent.value?.isContainer)

const typeLabel = computed(() => getTypeLabel(props.node.type) || pluginComponent.value?.label || props.node.type)

const nodeTouchReorder = useNodeTouchReorder({
  nodeId: props.node.id,
  nodeLabel: typeLabel.value,
  onReorder: (payload) => emit('reorder', payload),
  onMoveToRoot: () => emit('move-to-root', { sourceId: props.node.id })
})

function selectNode(id: string) {
  emit('select', id)
}

function handleTouchStart() {
  isLongPress.value = false
  longPressTimer.value = setTimeout(() => {
    isLongPress.value = true
    emit('select', props.node.id)
  }, 500)
}

function handleTouchEnd() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

function handleTouchMove() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
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
  const child = createChildForContainer('text', props.node.type)
  props.node.children.push(child)
  emit('select', child.id)
  emit('change')
}

function setChildrenAreaHighlight(active: boolean) {
  const area = nodeRef.value?.querySelector('.children-area') as HTMLElement | null
  if (!area) return
  area.classList.toggle('drop-target-active', active)
}

function hasLibraryType(transfer: DataTransfer | null) {
  return transfer?.types.includes('componentType') ?? false
}

function hasNodeType(transfer: DataTransfer | null) {
  return transfer?.types.includes('pageNodeId') ?? false
}

function handleNodeDragStart(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('pageNodeId', props.node.id)
  event.dataTransfer.effectAllowed = 'move'
}

function computeDropPosition(event: DragEvent): 'before' | 'after' | 'inside' {
  const target = event.target as HTMLElement | null
  const childrenArea = nodeRef.value?.querySelector('.children-area')
  if (childrenArea && target && childrenArea.contains(target)) return 'inside'
  const rect = nodeRef.value?.getBoundingClientRect()
  if (!rect) return 'after'
  return event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
}

function clearDropState() {
  dragOverCount.value = 0
  dropIndicator.value = null
  setChildrenAreaHighlight(false)
}

function handleDragEnter(event: DragEvent) {
  if (hasLibraryType(event.dataTransfer) && isContainer.value) {
    dragOverCount.value++
    setChildrenAreaHighlight(true)
  }
}

function handleDragLeave(event: DragEvent) {
  if (hasLibraryType(event.dataTransfer) && isContainer.value) {
    dragOverCount.value--
    if (dragOverCount.value <= 0) {
      dragOverCount.value = 0
      setChildrenAreaHighlight(false)
    }
  }
}

function handleDragOver(event: DragEvent) {
  if (hasLibraryType(event.dataTransfer) || hasNodeType(event.dataTransfer)) {
    event.preventDefault()
  }
  if (hasNodeType(event.dataTransfer)) {
    dropIndicator.value = computeDropPosition(event)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const nodeId = event.dataTransfer?.getData('pageNodeId')
  if (nodeId) {
    const position = computeDropPosition(event)
    clearDropState()
    emit('reorder', { sourceId: nodeId, targetId: props.node.id, position })
    return
  }

  if (!isContainer.value) {
    clearDropState()
    return
  }
  const type = event.dataTransfer?.getData('componentType')
  clearDropState()
  if (!type) return
  if (!props.node.children) props.node.children = []
  const child = createChildForContainer(type, props.node.type)
  props.node.children.push(child)
  emit('select', child.id)
  emit('change')
}
</script>

<style scoped>
.component-node {
  border: 1px dashed var(--w-border-color-darker);
  padding: 8px;
  margin-bottom: 8px;
  background: var(--w-bg-color);
  position: relative;
}
.component-node.selected { border: 2px solid var(--w-color-primary); }
.component-node.container { background: var(--w-fill-color-lighter); }
.node-toolbar {
  display: none;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  padding: 4px;
  background: var(--w-fill-color-light);
  border: 1px solid var(--w-border-color);
  border-radius: 3px;
}
.component-node:hover .node-toolbar,
.component-node.selected .node-toolbar {
  display: flex;
}
.node-type { font-size: 12px; color: var(--w-text-color-secondary); }
.drag-handle { cursor: grab; touch-action: none; }
.drag-handle:active { cursor: grabbing; }
.node-content { min-height: 24px; }
.children-area { min-height: 40px; padding: 8px; border: 1px dashed var(--w-border-color-light); }
.children-area.drop-target-active { background: var(--w-table-current-row-bg); border-color: var(--w-color-primary); }
.component-node.drop-before { border-top: 2px solid var(--w-color-primary); }
.component-node.drop-after { border-bottom: 2px solid var(--w-color-primary); }
.component-node.drop-inside .children-area { background: var(--w-table-current-row-bg); border-color: var(--w-color-primary); }
.layout-row { display: flex; flex-wrap: wrap; margin: -8px; }
.layout-col { flex: 1 1 auto; min-width: 0; padding: 8px; border: 1px dashed var(--w-border-color-light); background: var(--w-fill-color-lighter); }
.card-title { font-weight: bold; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid var(--w-border-color-light); }
.tabs-header { display: flex; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid var(--w-border-color); }
.tab-item { padding: 4px 12px; background: var(--w-fill-color-light); border: 1px solid var(--w-border-color); border-bottom: none; }
.empty-children { color: var(--w-text-color-placeholder); font-size: 12px; text-align: center; padding: 12px; }
.stat-preview { text-align: center; }
.stat-title { color: var(--w-text-color-secondary); font-size: 12px; }
.stat-value { font-size: 24px; font-weight: bold; }
.chart-preview,
.embed-preview,
.unknown-type {
  padding: 20px;
  background: var(--w-fill-color-lighter);
  border: 1px solid var(--w-border-color-light);
  text-align: center;
  color: var(--w-text-color-secondary);
}
.node-image { max-width: 100%; display: block; }
.divider-preview { text-align: center; color: var(--w-text-color-placeholder); padding: 8px 0; }
.list-preview { padding: 8px; }
.list-preview-item { padding: 6px; border-bottom: 1px dashed var(--w-border-color-light); }
.list-preview-item:last-child { border-bottom: none; }
.list-preview-title { font-size: 12px; color: var(--w-text-color-secondary); }
</style>
