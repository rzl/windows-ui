import type { Server } from 'http'
import type { IncomingMessage } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { tokenBlacklist } from '../middleware/auth'

export interface WSClient {
  ws: WebSocket
  userId: string
  username: string
  isAlive: boolean
}

const HEARTBEAT_INTERVAL = 30 * 1000

class WebSocketManager {
  private wss?: WebSocketServer
  private clients: WSClient[] = []
  private heartbeatTimer?: ReturnType<typeof setInterval>

  init(server: Server) {
    this.wss = new WebSocketServer({ noServer: true })

    // 升级阶段校验 JWT，未认证连接直接拒绝（不再信任客户端自我申报身份）
    server.on('upgrade', (req: IncomingMessage, socket, head) => {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
      // 限定 WS 只服务根路径，避免与未来其他 WS 端点冲突
      if (url.pathname !== '/') {
        socket.destroy()
        return
      }
      const token = url.searchParams.get('token') || ''
      const user = this.verifyToken(token)
      if (!user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
        return
      }
      this.wss!.handleUpgrade(req, socket, head, (ws) => {
        this.wss!.emit('connection', ws, req, user)
      })
    })

    this.wss.on('connection', (ws: WebSocket, _req: IncomingMessage, user: { id: string; username: string }) => {
      const client: WSClient = { ws, userId: user.id, username: user.username, isAlive: true }
      this.clients.push(client)

      ws.on('pong', () => {
        client.isAlive = true
      })

      ws.on('close', () => {
        const idx = this.clients.indexOf(client)
        if (idx > -1) this.clients.splice(idx, 1)
      })

      // 发送连接成功通知
      ws.send(JSON.stringify({ type: 'connected', message: '已连接消息服务', userId: user.id }))
    })

    // 心跳：30 秒无 pong 视为死连接并回收
    this.heartbeatTimer = setInterval(() => {
      this.clients.forEach((client) => {
        if (!client.isAlive) {
          client.ws.terminate()
          return
        }
        client.isAlive = false
        client.ws.ping()
      })
    }, HEARTBEAT_INTERVAL)
    this.heartbeatTimer.unref?.()
  }

  private verifyToken(token: string): { id: string; username: string } | null {
    if (!token || tokenBlacklist.has(token)) return null
    try {
      const decoded = jwt.verify(token, config.jwt.secret as jwt.Secret) as {
        id?: string
        username?: string
        tokenType?: string
      }
      if (!decoded?.id) return null
      if (decoded.tokenType && decoded.tokenType !== 'access') return null
      return { id: decoded.id, username: decoded.username || '' }
    } catch {
      return null
    }
  }

  broadcast(message: any) {
    const data = JSON.stringify(message)
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data)
      }
    })
  }

  sendToUser(userId: string, message: any) {
    const data = JSON.stringify(message)
    this.clients.forEach((client) => {
      if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data)
      }
    })
  }

  getOnlineCount() {
    return this.clients.filter((c) => c.ws.readyState === WebSocket.OPEN).length
  }
}

export const wsManager = new WebSocketManager()
