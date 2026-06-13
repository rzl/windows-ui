import http from 'http'
import app from './app'
import { config } from './config'
import { logger } from './utils/logger'
import { wsManager } from './utils/websocket'

const PORT = config.port
const server = http.createServer(app)

// 初始化 WebSocket
wsManager.init(server)

server.listen(PORT, '127.0.0.1', () => {
  logger.info(`Server running on http://127.0.0.1:${PORT}`)
  console.log(`Server running on http://127.0.0.1:${PORT}`)
})
