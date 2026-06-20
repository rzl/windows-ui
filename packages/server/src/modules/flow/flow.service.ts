import { db } from '../../db'
import { AppError } from '../../utils/response'
import * as monitorService from '../monitor/monitor.service'

export interface FlowAssignee {
  type: 'role' | 'user' | 'dept'
  value: string
}

export interface FlowNode {
  id: string
  type: 'start' | 'approve' | 'cc' | 'condition' | 'sign' | 'end'
  name: string
  assigneeType?: 'role' | 'user' | 'dept'
  assigneeValue?: string
  signType?: 'all' | 'any'
  assignees?: FlowAssignee[]
  condition?: string
}

export interface FlowTransition {
  from: string
  to: string
  condition: string
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

function parseBusinessData(instance: any): any {
  if (!instance?.business_data) return {}
  try {
    return typeof instance.business_data === 'string'
      ? JSON.parse(instance.business_data)
      : instance.business_data
  } catch {
    return {}
  }
}

function evaluateCondition(condition: string, form: any): boolean {
  if (!condition || ['submit', 'approve', 'reject'].includes(condition)) return false
  try {
    const fn = new Function('form', `return (${condition})`)
    return !!fn(form || {})
  } catch {
    return false
  }
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

export async function startFlowInstance(flowCode: string, businessKey: number, businessData: any = {}, starter?: any) {
  const def = await getFlowDefinitionByCode(flowCode)
  const config = def.config as FlowConfig

  const startNode = config.nodes.find((n) => n.type === 'start')
  if (!startNode) throw new AppError('流程缺少开始节点', 400)

  const transition = findMatchedTransition(config, startNode.id, 'submit', businessData)
  if (!transition) throw new AppError('开始节点未配置提交流转', 400)

  const nextNode = config.nodes.find((n) => n.id === transition.to)
  if (!nextNode) throw new AppError('流转目标节点不存在', 400)

  const [instanceId] = await db('flow_instances').insert({
    flow_code: flowCode,
    business_key: businessKey,
    business_data: JSON.stringify(businessData),
    status: 'running',
    current_node_id: nextNode.id,
    starter_id: starter?.id || null,
    starter_name: starter?.nickname || starter?.username || null
  })

  await enterNode(instanceId, nextNode)

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

export async function getFlowTrace(businessKey: number) {
  const instance = await db('flow_instances').where({ business_key: businessKey }).orderBy('id', 'desc').first()
  if (!instance) return null
  const tasks = await db('flow_tasks')
    .where({ instance_id: instance.id })
    .orderBy('id', 'asc')
  return {
    instanceId: instance.id,
    flowCode: instance.flow_code,
    status: instance.status,
    starterId: instance.starter_id,
    starterName: instance.starter_name,
    businessData: parseBusinessData(instance),
    createTime: instance.create_time,
    tasks: tasks.map((t) => ({
      id: t.id,
      nodeId: t.node_id,
      nodeName: t.node_name,
      status: t.status,
      assigneeType: t.assignee_type,
      assigneeValue: t.assignee_value,
      operatorId: t.operator_id,
      operatorName: t.operator_name,
      comment: t.comment,
      createTime: t.create_time,
      updateTime: t.update_time
    }))
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
    const deptIds = user.deptId ? [String(user.deptId)] : []
    query.where((qb) => {
      qb.where((q) => {
        q.where('flow_tasks.assignee_type', 'role').andWhere('flow_tasks.assignee_value', String(user.roleId))
      }).orWhere((q) => {
        q.where('flow_tasks.assignee_type', 'user').andWhere('flow_tasks.assignee_value', String(user.id))
      })
      if (deptIds.length) {
        qb.orWhere((q) => {
          q.where('flow_tasks.assignee_type', 'dept').andWhere('flow_tasks.assignee_value', deptIds[0])
        })
      }
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

async function handleTask(taskId: number, action: 'approve' | 'reject', comment: string, operator?: any) {
  const task = await db('flow_tasks').where({ id: taskId }).first()
  if (!task) throw new AppError('任务不存在', 404)
  if (task.status !== 'pending') throw new AppError('任务已处理', 400)

  const instance = await db('flow_instances').where({ id: task.instance_id }).first()
  if (!instance) throw new AppError('流程实例不存在', 404)

  const def = await getFlowDefinitionByCode(instance.flow_code)
  const config = def.config as FlowConfig
  const businessData = parseBusinessData(instance)

  await db('flow_tasks').where({ id: taskId }).update({
    status: action === 'approve' ? 'approved' : 'rejected',
    comment,
    operator_id: operator?.id || null,
    operator_name: operator?.nickname || operator?.username || null,
    update_time: db.fn.now()
  })

  const currentNode = config.nodes.find((n) => n.id === task.node_id)
  if (currentNode?.type === 'sign') {
    const shouldMove = await checkSignComplete(instance.id, currentNode)
    if (!shouldMove) return true
  }

  const transition = findMatchedTransition(config, task.node_id, action, businessData)
  if (!transition) throw new AppError(`当前节点未配置${action === 'approve' ? '通过' : '驳回'}流转`, 400)

  const nextNode = config.nodes.find((n) => n.id === transition.to)
  if (!nextNode) throw new AppError('流转目标节点不存在', 400)

  if (nextNode.type === 'end') {
    const finalStatus = action === 'approve' ? 'completed' : 'rejected'
    await db('flow_instances').where({ id: instance.id }).update({
      status: finalStatus,
      current_node_id: null,
      update_time: db.fn.now()
    })
    await sendFlowResultMessage(instance, finalStatus, operator?.nickname || operator?.username)
  } else {
    await db('flow_instances').where({ id: instance.id }).update({
      current_node_id: nextNode.id,
      update_time: db.fn.now()
    })

    await enterNode(instance.id, nextNode)
  }

  return true
}

function findMatchedTransition(config: FlowConfig, nodeId: string, action: string, businessData: any): FlowTransition | undefined {
  const transitions = config.transitions.filter((t) => t.from === nodeId)
  // 优先匹配 action 字面量
  const exact = transitions.find((t) => t.condition === action)
  if (exact) return exact
  // 再匹配表达式
  return transitions.find((t) => evaluateCondition(t.condition, businessData))
}

async function getReceiverUserIds(assigneeType?: string, assigneeValue?: string): Promise<number[]> {
  if (!assigneeType || !assigneeValue) return []
  if (assigneeType === 'user') {
    const user = await db('users').where({ id: Number(assigneeValue), status: 1 }).first()
    return user ? [user.id] : []
  }
  if (assigneeType === 'role') {
    const users = await db('users').where({ role_id: Number(assigneeValue), status: 1 }).select('id')
    return users.map((u) => u.id)
  }
  if (assigneeType === 'dept') {
    const users = await db('users').where({ dept_id: Number(assigneeValue), status: 1 }).select('id')
    return users.map((u) => u.id)
  }
  return []
}

async function sendFlowTaskMessage(instanceId: number, taskId: number, nodeName: string, receiverId: number, flowName?: string) {
  try {
    await monitorService.createMessage({
      receiverId,
      type: 'todo',
      businessType: 'flow',
      businessKey: String(taskId),
      title: `您有一条新的审批待办${flowName ? `：${flowName}` : ''}`,
      content: `节点「${nodeName}」需要您审批，请及时处理。`,
      link: '/flow/pending'
    })
  } catch (err) {
    // 消息发送失败不应影响流程主流程
    console.error('发送流程待办消息失败', err)
  }
}

async function sendFlowResultMessage(instance: any, status: 'completed' | 'rejected', operatorName?: string) {
  if (!instance?.starter_id) return
  try {
    const flow = await db('flow_definitions').where({ code: instance.flow_code }).first()
    const title = status === 'completed' ? `流程「${flow?.name || instance.flow_code}」已审批通过` : `流程「${flow?.name || instance.flow_code}」已被驳回`
    await monitorService.createMessage({
      receiverId: instance.starter_id,
      type: 'notice',
      businessType: 'flow',
      businessKey: String(instance.id),
      title,
      content: operatorName ? `处理人：${operatorName}` : '',
      link: '/flow/pending'
    })
  } catch (err) {
    console.error('发送流程结果消息失败', err)
  }
}

async function enterNode(instanceId: number, node: FlowNode) {
  const instance = await db('flow_instances').where({ id: instanceId }).first()
  const flow = instance ? await db('flow_definitions').where({ code: instance.flow_code }).first() : null
  const flowName = flow?.name || instance?.flow_code || ''

  if (node.type === 'approve') {
    const [taskId] = await db('flow_tasks').insert({
      instance_id: instanceId,
      node_id: node.id,
      node_name: node.name,
      assignee_type: node.assigneeType,
      assignee_value: node.assigneeValue,
      status: 'pending'
    })
    const receiverIds = await getReceiverUserIds(node.assigneeType, node.assigneeValue)
    await Promise.all(receiverIds.map((rid) => sendFlowTaskMessage(instanceId, taskId, node.name, rid, flowName)))
  } else if (node.type === 'sign') {
    const assignees = node.assignees?.length
      ? node.assignees
      : node.assigneeType && node.assigneeValue
        ? [{ type: node.assigneeType, value: node.assigneeValue }]
        : []
    if (!assignees.length) throw new AppError('会签节点未配置审批人', 400)
    await db('flow_tasks').insert(
      assignees.map((a) => ({
        instance_id: instanceId,
        node_id: node.id,
        node_name: node.name,
        assignee_type: a.type,
        assignee_value: a.value,
        status: 'pending'
      }))
    )
    const tasks = await db('flow_tasks')
      .where({ instance_id: instanceId, node_id: node.id, status: 'pending' })
      .select('id', 'assignee_type', 'assignee_value')
    await Promise.all(
      tasks.map(async (t) => {
        const receiverIds = await getReceiverUserIds(t.assignee_type, t.assignee_value)
        await Promise.all(receiverIds.map((rid) => sendFlowTaskMessage(instanceId, t.id, node.name, rid, flowName)))
      })
    )
  } else if (node.type === 'cc') {
    // 抄送节点：记录抄送任务并自动通过
    const [taskId] = await db('flow_tasks').insert({
      instance_id: instanceId,
      node_id: node.id,
      node_name: node.name,
      assignee_type: node.assigneeType,
      assignee_value: node.assigneeValue,
      status: 'cc'
    })
    const receiverIds = await getReceiverUserIds(node.assigneeType, node.assigneeValue)
    await Promise.all(receiverIds.map((rid) => sendFlowTaskMessage(instanceId, taskId, node.name, rid, flowName)))
    await autoMoveToNextNode(instanceId, node, 'approve')
  } else if (node.type === 'condition') {
    // 条件节点：自动根据表达式流转
    const instance = await db('flow_instances').where({ id: instanceId }).first()
    if (!instance) return
    const def = await getFlowDefinitionByCode(instance.flow_code)
    const config = def.config as FlowConfig
    const businessData = parseBusinessData(instance)
    const transition = findMatchedTransition(config, node.id, '', businessData)
    if (transition) {
      const nextNode = config.nodes.find((n) => n.id === transition.to)
      if (nextNode) {
        await db('flow_instances').where({ id: instanceId }).update({ current_node_id: nextNode.id, update_time: db.fn.now() })
        await enterNode(instanceId, nextNode)
      }
    }
  }
}

async function autoMoveToNextNode(instanceId: number, node: FlowNode, action: string) {
  const instance = await db('flow_instances').where({ id: instanceId }).first()
  if (!instance) return
  const def = await getFlowDefinitionByCode(instance.flow_code)
  const config = def.config as FlowConfig
  const businessData = parseBusinessData(instance)
  const transition = findMatchedTransition(config, node.id, action, businessData)
  if (!transition) return
  const nextNode = config.nodes.find((n) => n.id === transition.to)
  if (!nextNode) return

  if (nextNode.type === 'end') {
    await db('flow_instances').where({ id: instanceId }).update({
      status: action === 'approve' ? 'completed' : 'rejected',
      current_node_id: null,
      update_time: db.fn.now()
    })
  } else {
    await db('flow_instances').where({ id: instanceId }).update({ current_node_id: nextNode.id, update_time: db.fn.now() })
    await enterNode(instanceId, nextNode)
  }
}

async function checkSignComplete(instanceId: number, node: FlowNode): Promise<boolean> {
  const tasks = await db('flow_tasks').where({ instance_id: instanceId, node_id: node.id })
  const pendingCount = tasks.filter((t) => t.status === 'pending').length
  const approvedCount = tasks.filter((t) => t.status === 'approved').length

  if (node.signType === 'any') {
    return approvedCount > 0
  }
  // 默认 all
  return pendingCount === 0
}
