/**
 * 脚本执行工作线程：
 * - 用户脚本在线程内执行，超时/内存超限时主线程可直接 terminate，避免挂死主进程事件循环
 * - 数据库仍由主线程统一管理：工作线程通过消息通道请求执行 SQL，
 *   白名单校验全部在主线程完成，沙箱内代码无法绕过
 */
import { parentPort, workerData } from 'worker_threads'
import { VM } from 'vm2'
import axios from 'axios'

interface SqlRequest {
  type: 'sql'
  requestId: number
  sql: string
}

interface JobPayload {
  script: string
  ctx?: any
  data?: any
  timeout: number
  internalSecret: string
  port: number
}

const job = workerData as JobPayload

if (!parentPort) {
  throw new Error('script-worker 只能在线程中运行')
}

const parent = parentPort

/** 发起 SQL 请求并等待主线程回执 */
function requestSql(sql: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const requestId = Date.now() + Math.random()
    const onMessage = (msg: any) => {
      if (msg?.type === 'sql-result' && msg.requestId === requestId) {
        parent.off('message', onMessage)
        if (msg.ok) resolve(msg.result)
        else reject(new Error(msg.message || 'SQL 执行失败'))
      }
    }
    parent.on('message', onMessage)
    parent.postMessage({ type: 'sql', requestId, sql } satisfies SqlRequest)
  })
}

async function run() {
  const http = async (cfg: any) => {
    const res = await axios({
      ...cfg,
      url: cfg.url?.startsWith('http') ? cfg.url : `http://127.0.0.1:${job.port}${cfg.url}`,
      headers: {
        ...(cfg.headers || {}),
        'x-internal-token': job.internalSecret
      }
    })
    return res.data?.data
  }

  const dbProxy = {
    raw: (sql: string) => requestSql(sql)
  }

  const axiosProxy = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    request: axios.request
  }

  const vm = new VM({
    timeout: job.timeout,
    sandbox: {
      ctx: job.ctx,
      data: job.data,
      db: dbProxy,
      http,
      axios: axiosProxy,
      console
    }
  })

  const wrappedScript = `
    return (async () => {
      "use strict";
      ${job.script}
    })()
  `

  const result = await vm.run(wrappedScript)
  return result
}

run()
  .then((result) => {
    parent.postMessage({ type: 'done', ok: true, result })
  })
  .catch((error: Error) => {
    parent.postMessage({ type: 'done', ok: false, message: error?.message || '脚本执行失败' })
  })
