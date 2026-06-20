let ws: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let retryCount = 0
const MAX_RETRY = 10

export interface WebSocketCallbacks {
  onNewMessage?: (message: any) => void
  onConnected?: () => void
  onDisconnected?: () => void
}

let callbacks: WebSocketCallbacks = {}

function getWebSocketUrl(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}`
}

export function connectWebSocket(userId: number, username: string, cbs?: WebSocketCallbacks) {
  if (ws) {
    disconnectWebSocket()
  }
  if (cbs) {
    callbacks = cbs
  }

  try {
    ws = new WebSocket(getWebSocketUrl())

    ws.onopen = () => {
      retryCount = 0
      ws?.send(JSON.stringify({ type: 'auth', userId, username }))
      callbacks.onConnected?.()
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'new_message') {
          callbacks.onNewMessage?.(msg.data)
        }
      } catch {
        // ignore invalid message
      }
    }

    ws.onclose = () => {
      callbacks.onDisconnected?.()
      scheduleReconnect(userId, username)
    }

    ws.onerror = () => {
      // 错误后 onclose 会触发重连
    }
  } catch (err) {
    console.error('WebSocket 连接失败', err)
    scheduleReconnect(userId, username)
  }
}

function scheduleReconnect(userId: number, username: string) {
  if (reconnectTimer) return
  if (retryCount >= MAX_RETRY) {
    console.warn('WebSocket 重连次数已达上限')
    return
  }
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    retryCount++
    connectWebSocket(userId, username)
  }, 5000)
}

export function disconnectWebSocket() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (ws) {
    ws.onclose = null
    ws.onmessage = null
    ws.onerror = null
    ws.close()
    ws = null
  }
  retryCount = 0
}

export function isWebSocketConnected(): boolean {
  return ws?.readyState === WebSocket.OPEN
}

// 页面可见性变化时，若已断开则主动重连
export function watchVisibilityForReconnect(userId: number, username: string) {
  const handler = () => {
    if (document.visibilityState === 'visible' && !isWebSocketConnected() && userId) {
      retryCount = 0
      connectWebSocket(userId, username)
    }
  }
  document.addEventListener('visibilitychange', handler)
  return () => document.removeEventListener('visibilitychange', handler)
}
