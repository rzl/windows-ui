import cron, { type ScheduledTask } from 'node-cron'
import { db } from '../../db'
import { logger } from '../../utils/logger'
import * as scheduleService from './schedule.service'

const jobs = new Map<number, ScheduledTask>()

export async function startScheduler() {
  stopAllJobs()
  const tasks = await db('scheduled_tasks').where('status', 1)
  for (const task of tasks) {
    if (!cron.validate(task.cron)) {
      logger.warn(`定时任务 ${task.code} 的 cron 表达式无效: ${task.cron}`)
      continue
    }
    const job = cron.schedule(task.cron, async () => {
      logger.info(`定时任务执行: ${task.code}`)
      try {
        await scheduleService.executeTask(task)
      } catch (error) {
        logger.error(`定时任务 ${task.code} 执行失败`, error)
      }
    })
    jobs.set(task.id, job)
  }
  logger.info(`已加载 ${jobs.size} 个定时任务`)
}

export function stopAllJobs() {
  for (const job of jobs.values()) {
    job.stop()
  }
  jobs.clear()
}

export async function reloadTask(taskId: number) {
  const existing = jobs.get(taskId)
  if (existing) {
    existing.stop()
    jobs.delete(taskId)
  }
  const task = await db('scheduled_tasks').where({ id: taskId }).first()
  if (!task || task.status !== 1) return
  if (!cron.validate(task.cron)) return
  const job = cron.schedule(task.cron, async () => {
    try {
      await scheduleService.executeTask(task)
    } catch (error) {
      logger.error(`定时任务 ${task.code} 执行失败`, error)
    }
  })
  jobs.set(task.id, job)
}
