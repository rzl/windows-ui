import http from 'http'
import app from './app'
import { config } from './config'
import { logger } from './utils/logger'
import { wsManager } from './utils/websocket'
import { startScheduler } from './modules/schedule/scheduler'
import { checkAlerts } from './modules/monitor/alert.service'

const PORT = config.port
const server = http.createServer(app)

// 初始化 WebSocket
wsManager.init(server)

server.listen(PORT, '127.0.0.1', () => {
  logger.info(`Server running on http://127.0.0.1:${PORT}`)
  console.log(`Server running on http://127.0.0.1:${PORT}`)
  startScheduler().catch((err) => logger.error('启动定时任务失败', err))

  // 每 60 秒执行一次告警规则检查
  setInterval(() => {
    checkAlerts().catch((err) => logger.error('告警检查失败', err))
  }, 60 * 1000)
})
