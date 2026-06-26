import knex from 'knex'
import path from 'path'
import { config } from '../config'

const dbPath = path.isAbsolute(config.db.filename)
  ? config.db.filename
  : path.resolve(__dirname, '../..', config.db.filename)

export const db = knex({
  client: config.db.client,
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, '../../migrations'),
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: path.resolve(__dirname, '../../seeds')
  }
})

// SQL 性能采集：记录执行耗时超过阈值的 SQL
const SQL_SLOW_THRESHOLD = 100
const queryTimes = new Map<string, number>()
const IGNORE_TABLES = ['sql_metrics', 'api_metrics', 'alert_rules', 'alert_records', 'knex_migrations']

db.on('query', (querySpec: any) => {
  queryTimes.set(querySpec.__knexQueryUid, Date.now())
})

db.on('query-response', (_response: any, querySpec: any) => {
  const start = queryTimes.get(querySpec.__knexQueryUid)
  queryTimes.delete(querySpec.__knexQueryUid)
  if (!start) return
  const duration = Date.now() - start
  if (duration < SQL_SLOW_THRESHOLD) return
  const sql = querySpec.sql || ''
  if (IGNORE_TABLES.some((t) => sql.includes(t))) return
  db('sql_metrics')
    .insert({
      sql,
      bindings: querySpec.bindings ? JSON.stringify(querySpec.bindings) : null,
      duration,
      created_at: new Date().toISOString()
    })
    .catch(() => {
      // 采集失败不阻塞业务
    })
})

export default db
