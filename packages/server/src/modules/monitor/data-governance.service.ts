import { db } from '../../db'
import { logger } from '../../utils/logger'

export interface RetentionPolicy {
  id?: number
  tableName: string
  retentionDays: number
  enabled?: number
  lastCleanupTime?: string | null
}

const TIME_COLUMNS: Record<string, string> = {
  api_metrics: 'created_at',
  sql_metrics: 'created_at',
  alert_records: 'create_time',
  custom_api_logs: 'create_time',
  operation_logs: 'created_at',
  data_logs: 'created_at'
}

export async function getRetentionPolicies() {
  const list = await db('data_retention_policies').orderBy('id', 'desc')
  return list.map((item) => parsePolicy(item))
}

export async function getRetentionPolicy(id: number) {
  const item = await db('data_retention_policies').where({ id }).first()
  return item ? parsePolicy(item) : null
}

export async function updateRetentionPolicy(id: number, data: Partial<RetentionPolicy>) {
  await db('data_retention_policies').where({ id }).update({
    retention_days: data.retentionDays,
    enabled: data.enabled,
    update_time: new Date().toISOString()
  })
  return getRetentionPolicy(id)
}

export async function cleanupByPolicy(policy: RetentionPolicy) {
  if (!policy.enabled || policy.retentionDays <= 0) return 0

  const timeColumn = TIME_COLUMNS[policy.tableName]
  if (!timeColumn) {
    logger.warn(`未知的数据治理表：${policy.tableName}`)
    return 0
  }

  const deadline = new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000).toISOString()
  const deleted = await db(policy.tableName).where(timeColumn, '<', deadline).del()

  await db('data_retention_policies')
    .where({ id: policy.id })
    .update({ last_cleanup_time: new Date().toISOString() })

  logger.info(`数据治理清理完成：${policy.tableName}，保留 ${policy.retentionDays} 天，删除 ${deleted} 条记录`)
  return deleted
}

export async function runCleanup() {
  const policies = await getRetentionPolicies()
  let total = 0
  for (const policy of policies) {
    total += await cleanupByPolicy(policy)
  }
  return total
}

export async function cleanupCustomApiLogs() {
  const apis = await db('lowcode_custom_apis')
    .where('log_retention_days', '>', 0)
    .select('id', 'code', 'log_retention_days')

  let total = 0
  for (const api of apis) {
    const deadline = new Date(Date.now() - api.log_retention_days * 24 * 60 * 60 * 1000).toISOString()
    const deleted = await db('custom_api_logs')
      .where('api_id', api.id)
      .where('create_time', '<', deadline)
      .del()
    total += deleted
    if (deleted > 0) {
      logger.info(`自定义接口日志清理完成：${api.code}，保留 ${api.log_retention_days} 天，删除 ${deleted} 条`)
    }
  }
  return total
}

function parsePolicy(item: any): RetentionPolicy {
  return {
    id: item.id,
    tableName: item.table_name,
    retentionDays: item.retention_days,
    enabled: item.enabled,
    lastCleanupTime: item.last_cleanup_time
  }
}
