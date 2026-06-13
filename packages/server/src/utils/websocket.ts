import type { Server } from 'http'
import { WebSocketServer, WebSocket } from 'ws'

export interface WSClient {
  ws: WebSocket
  userId?: number
  username?: string
}

class WebSocketManager {
  private wss?: WebSocketServer
  private clients: WSClient[] = []

  init(server: Server) {
    this.wss = new WebSocketServer({ server })

    this.wss.on('connection', (ws: WebSocket) => {
      const client: WSClient = { ws }
      this.clients.push(client)

      ws.on('message', (data: Buffer) => {
        try {
          const msg = JSON.parse(data.toString())
          if (msg.type === 'auth' && msg.userId) {
            client.userId = msg.userId
            client.username = msg.username
          }
        } catch {
          // ignore invalid message
        }
      })

      ws.on('close', () => {
        const idx = this.clients.indexOf(client)
        if (idx > -1) this.clients.splice(idx, 1)
      })

      // 发送连接成功通知
      ws.send(JSON.stringify({ type: 'connected', message: '已连接消息服务' }))
    })
  }

  broadcast(message: any) {
    const data = JSON.stringify(message)
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data)
      }
    })
  }

  sendToUser(userId: number, message: any) {
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
