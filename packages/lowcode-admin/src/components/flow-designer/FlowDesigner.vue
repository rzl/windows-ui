<template>
  <div class="flow-designer">
    <div class="flow-designer__sidebar">
      <div class="flow-designer__title">节点</div>
      <div
        v-for="type in nodeTypes"
        :key="type.value"
        class="flow-designer__node-item"
        draggable="true"
        @dragstart="(e) => onDragStart(e, type.value)"
      >
        <span class="flow-designer__node-icon">{{ type.icon }}</span>
        {{ type.label }}
      </div>
    </div>

    <div class="flow-designer__canvas" @drop="onDrop" @dragover="(e) => e.preventDefault()">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypesMap"
        :default-edge-options="defaultEdgeOptions"
        fit-view-on-init
        @node-click="(evt: any) => onNodeClick(evt.node)"
        @edge-click="(evt: any) => onEdgeClick(evt.edge)"
        @connect="onConnect"
      >
        <Background pattern-color="#aaa" :gap="16" />
        <Controls />
        <MiniMap />
      </VueFlow>
    </div>

    <div class="flow-designer__panel">
      <div class="flow-designer__title">属性</div>
      <div v-if="selectedNode">
        <w-form :model="selectedNode.data" label-width="80px">
          <w-form-item label="节点名称">
            <w-input v-model="selectedNode.data.name" />
          </w-form-item>
          <w-form-item v-if="selectedNode.data.type === 'approve'" label="审批方式">
            <w-select v-model="selectedNode.data.assigneeType" :options="assigneeTypeOptions" />
          </w-form-item>
          <w-form-item v-if="selectedNode.data.type === 'approve' && selectedNode.data.assigneeType" label="审批对象">
            <w-input v-model="selectedNode.data.assigneeValue" placeholder="角色编码/用户名" />
          </w-form-item>
          <w-form-item v-if="selectedNode.data.type === 'sign'" label="会签规则">
            <w-radio-group v-model="selectedNode.data.signType" :options="signTypeOptions" />
          </w-form-item>
          <w-form-item v-if="selectedNode.data.type === 'condition'" label="条件表达式">
            <w-input v-model="selectedNode.data.condition" placeholder="例如 form.amount > 1000" />
          </w-form-item>
        </w-form>
        <w-button type="danger" size="small" @click="removeSelectedNode">删除节点</w-button>
      </div>
      <div v-else-if="selectedEdge">
        <w-form :model="selectedEdgeData" label-width="80px">
          <w-form-item label="流转条件">
            <w-select v-model="selectedEdgeData.condition" :options="conditionOptions" />
          </w-form-item>
        </w-form>
        <w-button type="danger" size="small" @click="removeSelectedEdge">删除连线</w-button>
      </div>
      <div v-else class="flow-designer__placeholder">
        选择节点或连线编辑属性
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, watchEffect } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import FlowNode from './FlowNode.vue'
import { toVueFlow, fromVueFlow, createNode, type FlowConfig, type VueFlowNode, type VueFlowEdge } from './flow-types'

defineOptions({ name: 'FlowDesigner' })

const props = defineProps<{
  modelValue: FlowConfig
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FlowConfig): void
}>()

const nodeTypes = [
  { label: '开始', value: 'start', icon: '▶' },
  { label: '审批', value: 'approve', icon: '✓' },
  { label: '抄送', value: 'cc', icon: '✉' },
  { label: '条件', value: 'condition', icon: '◆' },
  { label: '会签', value: 'sign', icon: '✍' },
  { label: '结束', value: 'end', icon: '■' }
]

const assigneeTypeOptions = [
  { label: '角色', value: 'role' },
  { label: '用户', value: 'user' },
  { label: '部门', value: 'dept' }
]

const signTypeOptions = [
  { label: '全部通过', value: 'all' },
  { label: '一人通过', value: 'any' }
]

const conditionOptions = [
  { label: '通过', value: 'approve' },
  { label: '驳回', value: 'reject' },
  { label: '提交', value: 'submit' }
]

const nodeTypesMap: Record<string, any> = {
  flowStart: markRaw(FlowNode),
  flowApprove: markRaw(FlowNode),
  flowCc: markRaw(FlowNode),
  flowCondition: markRaw(FlowNode),
  flowSign: markRaw(FlowNode),
  flowEnd: markRaw(FlowNode)
}

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true
}

const init = toVueFlow(props.modelValue || { nodes: [], transitions: [] })
const nodes = ref<VueFlowNode[]>(init.nodes)
const edges = ref<VueFlowEdge[]>(init.edges)
const selectedNode = ref<VueFlowNode | null>(null)
const selectedEdge = ref<VueFlowEdge | null>(null)
const selectedEdgeData = ref<{ condition: string }>({ condition: 'approve' })

const { addNodes, addEdges, removeNodes, removeEdges, project } = useVueFlow()

let idCounter = 0

function genId() {
  return `node_${Date.now()}_${++idCounter}`
}

function onDragStart(e: DragEvent, type: string) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('application/vueflow-node-type', type)
    e.dataTransfer.effectAllowed = 'move'
  }
}

function onDrop(e: DragEvent) {
  const type = e.dataTransfer?.getData('application/vueflow-node-type') as any
  if (!type) return

  const position = project({ x: e.offsetX, y: e.offsetY })
  const id = genId()
  const newNode: VueFlowNode = {
    id,
    type: `flow${type.charAt(0).toUpperCase() + type.slice(1)}`,
    position,
    data: createNode(type, id)
  }
  addNodes([newNode])
}

function onConnect(params: any) {
  const id = `e-${params.source}-${params.target}-${Date.now()}`
  addEdges([{
    id,
    source: params.source,
    target: params.target,
    data: { condition: 'approve' }
  }])
}

function onNodeClick(node: VueFlowNode) {
  selectedEdge.value = null
  selectedNode.value = node
}

function onEdgeClick(edge: VueFlowEdge) {
  selectedNode.value = null
  selectedEdge.value = edge
  selectedEdgeData.value = { condition: edge.data?.condition || 'approve' }
}

function removeSelectedNode() {
  if (!selectedNode.value) return
  removeNodes([selectedNode.value.id])
  selectedNode.value = null
}

function removeSelectedEdge() {
  if (!selectedEdge.value) return
  removeEdges([selectedEdge.value.id])
  selectedEdge.value = null
}

function getConfig(): FlowConfig {
  if (selectedEdge.value) {
    selectedEdge.value.data = { ...selectedEdgeData.value }
  }
  return fromVueFlow(nodes.value, edges.value)
}

watchEffect(() => {
  emit('update:modelValue', getConfig())
})

defineExpose({ getConfig })
</script>

<style scoped>
.flow-designer {
  display: flex;
  height: 520px;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
}
.flow-designer__sidebar {
  width: 120px;
  padding: 12px;
  background: var(--w-bg-color);
  border-right: 2px solid #808080;
}
.flow-designer__title {
  font-weight: bold;
  margin-bottom: 12px;
}
.flow-designer__node-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-bottom: 8px;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  background: var(--w-bg-color);
  cursor: move;
}
.flow-designer__node-icon {
  font-size: 16px;
}
.flow-designer__canvas {
  flex: 1;
  position: relative;
}
.flow-designer__panel {
  width: 240px;
  padding: 12px;
  background: var(--w-bg-color);
  border-left: 2px solid #808080;
  overflow-y: auto;
}
.flow-designer__placeholder {
  color: #999;
  text-align: center;
  padding: 40px 0;
}
</style>
