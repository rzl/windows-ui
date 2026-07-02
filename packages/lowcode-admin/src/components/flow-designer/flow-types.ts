export interface FlowNodeData {
  id: string
  type: 'start' | 'approve' | 'cc' | 'condition' | 'sign' | 'end'
  name: string
  assigneeType?: 'role' | 'user' | 'dept'
  assigneeValue?: string
  signType?: 'all' | 'any'
  assignees?: { type: 'role' | 'user' | 'dept'; value: string }[]
  condition?: string
  fieldPermissions?: Record<string, 'editable' | 'readonly' | 'hidden'>
  timeoutHours?: number
  timeoutAction?: 'none' | 'autoApprove' | 'autoReject'
}

export interface FlowTransition {
  from: string
  to: string
  condition: string
}

export interface FlowConfig {
  nodes: FlowNodeData[]
  transitions: FlowTransition[]
}

export interface VueFlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: FlowNodeData
}

export interface VueFlowEdge {
  id: string
  source: string
  target: string
  label?: string
  data?: { condition?: string }
}

const nodeTypeMap: Record<string, string> = {
  start: 'flowStart',
  approve: 'flowApprove',
  cc: 'flowCc',
  condition: 'flowCondition',
  sign: 'flowSign',
  end: 'flowEnd'
}

export function toVueFlow(config: FlowConfig): { nodes: VueFlowNode[]; edges: VueFlowEdge[] } {
  const nodes = (config.nodes || []).map((n, index) => ({
    id: n.id,
    type: nodeTypeMap[n.type] || 'flowDefault',
    position: { x: 200 + (index % 3) * 220, y: 100 + Math.floor(index / 3) * 140 },
    data: { ...n }
  }))

  const edges = (config.transitions || []).map((t, index) => ({
    id: `e-${t.from}-${t.to}-${index}`,
    source: t.from,
    target: t.to,
    label: t.condition && !['submit', 'approve', 'reject'].includes(t.condition) ? t.condition : undefined,
    data: { condition: t.condition }
  }))

  return { nodes, edges }
}

export function fromVueFlow(nodes: VueFlowNode[], edges: VueFlowEdge[]): FlowConfig {
  const flowNodes = nodes.map((n) => {
    const data = { ...n.data }
    if (!data.name) data.name = data.type === 'start' ? '开始' : data.type === 'end' ? '结束' : '节点'
    return data as FlowNodeData
  })

  const transitions = edges.map((e) => ({
    from: e.source,
    to: e.target,
    condition: e.data?.condition || 'approve'
  }))

  return { nodes: flowNodes, transitions }
}

export function createNode(type: FlowNodeData['type'], id: string): FlowNodeData {
  const nameMap: Record<string, string> = {
    start: '开始',
    approve: '审批',
    cc: '抄送',
    condition: '条件',
    sign: '会签',
    end: '结束'
  }
  return {
    id,
    type,
    name: nameMap[type],
    assignees: type === 'sign' ? [] : undefined
  }
}
