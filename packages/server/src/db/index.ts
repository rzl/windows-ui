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
  pool: {
    min: 2,
    max: 10,
    // 每个连接建立时设置 SQLite pragma：
    // WAL 允许读写并发、busy_timeout 等待锁而不是立即报 SQLITE_BUSY、
    // NORMAL 同步模式在 WAL 下兼顾性能与安全
    afterCreate: (conn: any, done: (err: Error | null) => void) => {
      conn.serialize(() => {
        conn.run('PRAGMA journal_mode = WAL')
        conn.run('PRAGMA busy_timeout = 5000')
        conn.run('PRAGMA synchronous = NORMAL')
        conn.run('PRAGMA foreign_keys = ON', (err: any) => (done as any)(err || null, conn))
      })
    }
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
import { newId } from '../utils/id'

const SQL_SLOW_THRESHOLD = 100
const queryTimes = new Map<string, number>()
const IGNORE_TABLES = ['sql_metrics', 'api_metrics', 'alert_rules', 'alert_records', 'knex_migrations']

db.on('query', (querySpec: any) => {
  queryTimes.set(querySpec.__knexQueryUid, Date.now())
})

// 查询失败时清理计时条目，否则 Map 会随失败查询无限增长（内存泄漏）
db.on('query-error', (_err: any, querySpec: any) => {
  queryTimes.delete(querySpec.__knexQueryUid)
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
      id: newId(),
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
