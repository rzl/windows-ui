import http from 'http'
import app from './app'
import { config } from './config'
import { logger } from './utils/logger'
import { wsManager } from './utils/websocket'
import type { AuthRequest } from './middleware/auth'
import { startScheduler } from './modules/schedule/scheduler'
import { checkAlerts } from './modules/monitor/alert.service'
import { runCleanup, cleanupCustomApiLogs } from './modules/monitor/data-governance.service'
import { checkTimeoutTasks } from './modules/flow/flow.service'

const PORT = config.port
const server = http.createServer(app)

// 初始化 WebSocket
wsManager.init(server)

// 系统级后台任务使用的 req（超级管理员身份，跨租户）
const systemReq = { user: { id: 0, username: 'system', roleId: 1, tenantId: 0 } } as AuthRequest

server.listen(PORT, '127.0.0.1', () => {
  logger.info(`Server running on http://127.0.0.1:${PORT}`)
  console.log(`Server running on http://127.0.0.1:${PORT}`)
  startScheduler().catch((err) => logger.error('启动定时任务失败', err))

  // 每 60 秒执行一次告警规则检查
  setInterval(() => {
    checkAlerts(systemReq).catch((err) => logger.error('告警检查失败', err))
  }, 60 * 1000)

  // 每 6 小时执行一次数据治理清理
  setInterval(() => {
    runCleanup(systemReq).catch((err) => logger.error('数据治理清理失败', err))
    cleanupCustomApiLogs(systemReq).catch((err) => logger.error('自定义接口日志清理失败', err))
  }, 6 * 60 * 60 * 1000)

  // 每 10 分钟扫描一次超时任务
  setInterval(() => {
    checkTimeoutTasks(systemReq).catch((err) => logger.error('流程超时扫描失败', err))
  }, 10 * 60 * 1000)
})
