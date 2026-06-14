import { db } from '../../db'
import { AppError } from '../../utils/response'
import * as dashboardService from '../dashboard/dashboard.service'

export async function getScheduledTasks() {
  return db('scheduled_tasks').orderBy('id', 'desc')
}

export async function getScheduledTaskById(id: number) {
  const task = await db('scheduled_tasks').where({ id }).first()
  if (!task) throw new AppError('任务不存在', 404)
  return task
}

export async function saveScheduledTask(data: any) {
  const code = data.code.replace(/[^a-z0-9_]/gi, '_').toLowerCase()
  const handlerConfig = typeof data.handlerConfig === 'string'
    ? data.handlerConfig
    : JSON.stringify(data.handlerConfig || {})
  const exists = await db('scheduled_tasks').where({ code }).first()

  if (exists) {
    await db('scheduled_tasks').where({ code }).update({
      name: data.name,
      cron: data.cron,
      handler_type: data.handlerType,
      handler_config: handlerConfig,
      status: data.status ?? 1,
      update_time: db.fn.now()
    })
    return db('scheduled_tasks').where({ code }).first()
  }

  const [id] = await db('scheduled_tasks').insert({
    code,
    name: data.name,
    cron: data.cron,
    handler_type: data.handlerType,
    handler_config: handlerConfig,
    status: data.status ?? 1
  })
  return db('scheduled_tasks').where({ id }).first()
}

export async function deleteScheduledTask(id: number) {
  await db('scheduled_tasks').where({ id }).del()
  await db('scheduled_task_logs').where({ task_id: id }).del()
  return true
}

export async function getTaskLogs(taskId: number) {
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
