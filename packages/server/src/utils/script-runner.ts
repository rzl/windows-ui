import { VM } from 'vm2'
import axios from 'axios'
import { db } from '../db'
import { AppError } from './response'
import { config as appConfig } from '../config'

export interface ScriptContext {
  ctx?: any
  data?: any
}

export async function runScript(script: string, context: ScriptContext = {}) {
  if (!script) throw new AppError('脚本不能为空', 400)

  const http = async (cfg: any) => {
    const res = await axios({
      ...cfg,
      url: cfg.url?.startsWith('http') ? cfg.url : `http://127.0.0.1:${appConfig.port}${cfg.url}`,
      headers: {
        ...(cfg.headers || {}),
        'x-script-service': '1'
      }
    })
    return res.data?.data
  }

  const dbProxy = {
    raw: async (sql: string) => {
      checkSafeSql(sql)
      const result = await db.raw(sql)
      return Array.isArray(result) ? result : []
    }
  }

  const axiosProxy = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    request: axios.request
  }

  const vm = new VM({
    timeout: 5000,
    sandbox: {
      ctx: context.ctx,
      data: context.data,
      db: dbProxy,
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

export function checkSafeSql(sql: string) {
  const upper = sql.trim().toUpperCase()
  if (!upper.startsWith('SELECT')) {
    throw new AppError('只允许执行 SELECT 查询', 400)
  }
  const forbidden = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE']
  if (forbidden.some((k) => upper.includes(k))) {
    throw new AppError('SQL 包含非法关键字', 400)
  }
}
