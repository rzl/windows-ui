import { db } from '../../db'
import type { AuthRequest } from '../../middleware/auth'
import { AppError } from '../../utils/response'
import { tenantWhere, setTenantId } from '../../utils/tenant'
import * as dashboardService from '../dashboard/dashboard.service'

export async function getScheduledTasks(req: AuthRequest) {
  return db('scheduled_tasks').where(tenantWhere(req)).orderBy('id', 'desc')
}

export async function getScheduledTaskById(req: AuthRequest, id: number) {
  const task = await db('scheduled_tasks').where({ id }).andWhere(tenantWhere(req)).first()
  if (!task) throw new AppError('任务不存在', 404)
  return task
}

export async function saveScheduledTask(req: AuthRequest, data: any) {
  const code = data.code.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
  const handlerConfig = typeof data.handlerConfig === 'string'
    ? data.handlerConfig
    : JSON.stringify(data.handlerConfig || {})
  const exists = await db('scheduled_tasks').where({ code }).andWhere(tenantWhere(req)).first()

  if (exists) {
    await db('scheduled_tasks')
      .where({ code })
      .andWhere(tenantWhere(req))
      .update(setTenantId({
        name: data.name,
        cron: data.cron,
        handler_type: data.handlerType,
        handler_config: handlerConfig,
        status: data.status ?? 1,
        update_time: db.fn.now()
      }, req))
    return db('scheduled_tasks').where({ code }).andWhere(tenantWhere(req)).first()
  }

  const [id] = await db('scheduled_tasks').insert(setTenantId({
    code,
    name: data.name,
    cron: data.cron,
    handler_type: data.handlerType,
    handler_config: handlerConfig,
    status: data.status ?? 1
  }, req))
  return db('scheduled_tasks').where({ id }).andWhere(tenantWhere(req)).first()
}

export async function deleteScheduledTask(req: AuthRequest, id: number) {
  const task = await getScheduledTaskById(req, id)
  await db('scheduled_tasks').where({ id: task.id }).andWhere(tenantWhere(req)).del()
  await db('scheduled_task_logs').where({ task_id: task.id }).del()
  return true
}

export async function getTaskLogs(req: AuthRequest, taskId: number) {
  // 校验任务归属本租户
  await getScheduledTaskById(req, taskId)
  return db('scheduled_task_logs')
    .where({ task_id: taskId })
    .orderBy('id', 'desc')
    .limit(50)
}

export async function executeTask(task: any) {
  let status = 'success'
  let result: any
  try {
    const config = typeof task.handler_config === 'string'
      ? JSON.parse(task.handler_config)
      : task.handler_config
    const dataSource: dashboardService.DataSourceConfig = {
      type: task.handler_type,
      sql: config.sql,
      script: config.script,
      api: config.api,
      option: config.option
    }
    result = await dashboardService.executeDataSource(dataSource)
  } catch (error: any) {
    status = 'error'
    result = error?.message || String(error)
  }

  await db('scheduled_task_logs').insert({
    task_id: task.id,
    status,
    result: typeof result === 'string' ? result : JSON.stringify(result)
  })

  await db('scheduled_tasks').where({ id: task.id }).update({
    last_run_time: db.fn.now(),
    last_run_result: status === 'success' ? '执行成功' : '执行失败'
  })

  return { status, result }
}
