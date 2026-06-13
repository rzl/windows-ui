import { db } from '../../db'
import { AppError } from '../../utils/response'

export interface FlowNode {
  id: string
  type: 'start' | 'approve' | 'end'
  name: string
  assigneeType?: 'role' | 'user'
  assigneeValue?: string
}

export interface FlowTransition {
  from: string
  to: string
  condition: 'submit' | 'approve' | 'reject'
}

export interface FlowConfig {
  nodes: FlowNode[]
  transitions: FlowTransition[]
}

function safeCode(name: string) {
  return name.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
}

function parseConfig(config: any): FlowConfig {
  if (typeof config === 'string') {
    return JSON.parse(config)
  }
  return config || { nodes: [], transitions: [] }
}

// ---------- 流程定义 ----------

export async function getFlowDefinitions() {
  return db('flow_definitions').orderBy('id', 'desc')
}

export async function getFlowDefinitionByCode(code: string) {
  const def = await db('flow_definitions').where({ code }).first()
  if (!def) throw new AppError('流程定义不存在', 404)
  return {
    ...def,
    config: parseConfig(def.config)
  }
}

export async function getFlowDefinitionByModelCode(modelCode: string) {
  const def = await db('flow_definitions').where({ model_code: modelCode, status: 1 }).first()
  if (!def) return null
  return {
    ...def,
    config: parseConfig(def.config)
  }
}

export async function saveFlowDefinition(data: any) {
  const code = safeCode(data.code || data.name)
  const config = typeof data.config === 'string' ? data.config : JSON.stringify(data.config || {})
  const exists = await db('flow_definitions').where({ code }).first()

  if (exists) {
    await db('flow_definitions').where({ code }).update({
      name: data.name,
      model_code: data.modelCode,
      config,
      status: data.status ?? 1,
      update_time: db.fn.now()
    })
    return db('flow_definitions').where({ code }).first()
  }

  const [id] = await db('flow_definitions').insert({
    code,
    name: data.name,
    model_code: data.modelCode,
    config,
    status: data.status ?? 1
  })
  return db('flow_definitions').where({ id }).first()
}

export async function deleteFlowDefinition(id: number) {
  await db('flow_definitions').where({ id }).del()
  return true
}

// ---------- 流程实例 ----------

export async function startFlowInstance(flowCode: string, businessKey: number, _starter?: any) {
  const def = await getFlowDefinitionByCode(flowCode)
  const config = def.config as FlowConfig

  const startNode = config.nodes.find((n) => n.type === 'start')
  if (!startNode) throw new AppError('流程缺少开始节点', 400)

  const transition = config.transitions.find((t) => t.from === startNode.id && t.condition === 'submit')
  if (!transition) throw new AppError('开始节点未配置提交流转', 400)

  const nextNode = config.nodes.find((n) => n.id === transition.to)
  if (!nextNode) throw new AppError('流转目标节点不存在', 400)

  const [instanceId] = await db('flow_instances').insert({
    flow_code: flowCode,
    business_key: businessKey,
    status: 'running',
    current_node_id: nextNode.id
  })

  if (nextNode.type === 'approve') {
    await db('flow_tasks').insert({
      instance_id: instanceId,
      node_id: nextNode.id,
      node_name: nextNode.name,
      assignee_type: nextNode.assigneeType,
      assignee_value: nextNode.assigneeValue,
      status: 'pending'
    })
  }

  return { instanceId, currentNodeId: nextNode.id }
}

export async function getInstanceStatus(businessKey: number) {
  const instance = await db('flow_instances').where({ business_key: businessKey }).orderBy('id', 'desc').first()
  if (!instance) return null
  const task = await db('flow_tasks')
    .where({ instance_id: instance.id, status: 'pending' })
    .first()
  return {
    instanceId: instance.id,
    status: instance.status,
    currentNodeId: instance.current_node_id,
    taskId: task?.id || null
  }
}

// ---------- 任务处理 ----------

export async function getPendingTasks(user: any) {
  const query = db('flow_tasks')
    .join('flow_instances', 'flow_tasks.instance_id', 'flow_instances.id')
    .join('flow_definitions', 'flow_instances.flow_code', 'flow_definitions.code')
    .where('flow_tasks.status', 'pending')
    .where('flow_instances.status', 'running')
    .select(
      'flow_tasks.*',
      'flow_instances.flow_code as flow_code',
      'flow_instances.business_key as business_key',
      'flow_definitions.model_code as model_code',
      'flow_definitions.name as flow_name'
    )

  if (user?.roleId && user?.id) {
    query.where((qb) => {
      qb.where((q) => {
        q.where('flow_tasks.assignee_type', 'role').andWhere('flow_tasks.assignee_value', String(user.roleId))
      }).orWhere((q) => {
        q.where('flow_tasks.assignee_type', 'user').andWhere('flow_tasks.assignee_value', String(user.id))
      })
    })
  }

  return query.orderBy('flow_tasks.id', 'desc')
}

export async function approveTask(taskId: number, comment: string, _operator?: any) {
  return handleTask(taskId, 'approve', comment, _operator)
}

export async function rejectTask(taskId: number, comment: string, _operator?: any) {
  return handleTask(taskId, 'reject', comment, _operator)
}

async function handleTask(taskId: number, action: 'approve' | 'reject', comment: string, _operator?: any) {
  const task = await db('flow_tasks').where({ id: taskId }).first()
  if (!task) throw new AppError('任务不存在', 404)
  if (task.status !== 'pending') throw new AppError('任务已处理', 400)

  const instance = await db('flow_instances').where({ id: task.instance_id }).first()
  if (!instance) throw new AppError('流程实例不存在', 404)

  const def = await getFlowDefinitionByCode(instance.flow_code)
  const config = def.config as FlowConfig

  const transition = config.transitions.find(
    (t) => t.from === task.node_id && t.condition === action
  )
  if (!transition) throw new AppError(`当前节点未配置${action === 'approve' ? '通过' : '驳回'}流转`, 400)

  const nextNode = config.nodes.find((n) => n.id === transition.to)
  if (!nextNode) throw new AppError('流转目标节点不存在', 400)

  await db('flow_tasks').where({ id: taskId }).update({
    status: action === 'approve' ? 'approved' : 'rejected',
    comment,
    update_time: db.fn.now()
  })

  if (nextNode.type === 'end') {
    await db('flow_instances').where({ id: instance.id }).update({
      status: action === 'approve' ? 'completed' : 'rejected',
      current_node_id: null,
      update_time: db.fn.now()
    })
  } else {
    await db('flow_instances').where({ id: instance.id }).update({
      current_node_id: nextNode.id,
      update_time: db.fn.now()
    })

    await db('flow_tasks').insert({
      instance_id: instance.id,
      node_id: nextNode.id,
      node_name: nextNode.name,
      assignee_type: nextNode.assigneeType,
      assignee_value: nextNode.assigneeValue,
      status: 'pending'
    })
  }

  return true
}
