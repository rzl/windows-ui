import path from 'path'
import fs from 'fs'
import { Worker } from 'worker_threads'
import { db } from '../db'
import { AppError } from './response'
import { config as appConfig } from '../config'

export interface ScriptContext {
  ctx?: any
  data?: any
}

/** SQL 默认超时（同步执行兜底），整体执行超时由 worker.terminate 保证 */
const DEFAULT_SCRIPT_TIMEOUT = 5000

/** 敏感系统表：脚本 SQL 一律禁止直接读取（密码哈希、权限配置等） */
const FORBIDDEN_TABLES = [
  'users',
  'roles',
  'menus',
  'depts',
  'tenants',
  'role_permissions',
  'role_apps',
  'role_data_permissions',
  'data_permission_rules',
  'field_permission_rules',
  'operation_logs',
  'api_metrics',
  'sql_metrics'
]

export function checkSafeSql(sql: string) {
  const upper = sql.trim().toUpperCase()
  if (!upper.startsWith('SELECT')) {
    throw new AppError('只允许执行 SELECT 查询', 400)
  }
  const forbidden = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE']
  if (forbidden.some((k) => upper.includes(k))) {
    throw new AppError('SQL 包含非法关键字', 400)
  }
  checkForbiddenTables(sql)
}

/** 提取 SQL 中 FROM / JOIN 的表名，命中敏感表则拒绝 */
function checkForbiddenTables(sql: string) {
  const pattern = /\b(?:from|join)\s+[`"[]?([a-za-z_][\w]*)[`"\]]?/gi
  let match: RegExpExecArray | null
  while ((match = pattern.exec(sql)) !== null) {
    const table = match[1].toLowerCase()
    if (FORBIDDEN_TABLES.includes(table)) {
      throw new AppError(`SQL 不允许访问系统表：${table}`, 400)
    }
  }
}

/** 在主线程执行脚本发起的 SQL（白名单校验也在主线程，沙箱无法绕过） */
async function executeScriptSql(sql: string) {
  checkSafeSql(sql)
  const result = await db.raw(sql)
  return Array.isArray(result) ? result : []
}

function resolveWorkerPath(): string {
  const base = path.join(__dirname, 'script-worker')
  for (const ext of ['.js', '.ts']) {
    if (fs.existsSync(base + ext)) return base + ext
  }
  throw new AppError('未找到脚本执行工作线程', 500)
}

/** 工作线程执行：硬超时（terminate）+ 内存上限 */
function runScriptInWorker(script: string, context: ScriptContext, timeout: number): Promise<any> {
  return new Promise((resolve, reject) => {
    let worker: Worker
    try {
      worker = new Worker(resolveWorkerPath(), {
        workerData: {
          script,
          ctx: context.ctx,
          data: context.data,
          timeout,
          internalSecret: appConfig.internalSecret,
          port: appConfig.port
        },
        resourceLimits: {
          maxOldGenerationSizeMb: 128,
          maxYoungGenerationSizeMb: 32
        }
      })
    } catch {
      // 工作线程不可用（如开发环境下 TS 加载器限制）时降级为主线程执行
      runScriptInProcess(script, context, timeout).then(resolve, reject)
      return
    }

    const timer = setTimeout(() => {
      worker.terminate()
      reject(new AppError(`脚本执行超时（${timeout}ms），已强制终止`, 400))
    }, timeout)

    worker.on('message', async (msg: any) => {
      if (msg?.type === 'sql') {
        try {
          const result = await executeScriptSql(msg.sql)
          worker.postMessage({ type: 'sql-result', requestId: msg.requestId, ok: true, result })
        } catch (err: any) {
          worker.postMessage({ type: 'sql-result', requestId: msg.requestId, ok: false, message: err?.message })
        }
        return
      }
      if (msg?.type === 'done') {
        clearTimeout(timer)
        worker.terminate()
        if (msg.ok) resolve(msg.result)
        else reject(new AppError(`脚本执行失败: ${msg.message}`, 400))
      }
    })

    worker.on('error', (err) => {
      clearTimeout(timer)
      // 线程崩溃（如内存超限）时降级为主线程执行，保证功能可用
      runScriptInProcess(script, context, timeout).then(resolve, reject)
    })
  })
}

/** 主线程执行（降级路径）：vm2 的 timeout 仅对同步代码生效，异步死循环无法中断 */
async function runScriptInProcess(script: string, context: ScriptContext, timeout: number): Promise<any> {
  const { VM } = await import('vm2')
  const axios = (await import('axios')).default

  const http = async (cfg: any) => {
    const res = await axios({
      ...cfg,
      url: cfg.url?.startsWith('http') ? cfg.url : `http://127.0.0.1:${appConfig.port}${cfg.url}`,
      headers: {
        ...(cfg.headers || {}),
        'x-internal-token': appConfig.internalSecret
      }
    })
    return res.data?.data
  }

  const axiosProxy = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    request: axios.request
  }

  const vm = new VM({
    timeout,
    sandbox: {
      ctx: context.ctx,
      data: context.data,
      db: {
        raw: async (sql: string) => executeScriptSql(sql)
      },
      http,
      axios: axiosProxy,
      console
    }
  })

  const wrappedScript = `
    return (async () => {
      "use strict";
      ${script}
    })()
  `

  try {
    return await vm.run(wrappedScript)
  } catch (error: any) {
    throw new AppError(`脚本执行失败: ${error.message}`, 400)
  }
}

export async function runScript(script: string, context: ScriptContext = {}, timeout = DEFAULT_SCRIPT_TIMEOUT) {
  if (!script) throw new AppError('脚本不能为空', 400)
  return runScriptInWorker(script, context, timeout)
}
