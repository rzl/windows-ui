import { ref, onMounted, onUnmounted } from 'vue'

export function useWebSocket(userId?: number, username?: string) {
  const ws = ref<WebSocket | null>(null)
  const connected = ref(false)
  const messages = ref<any[]>([])
  let heartbeatTimer: any = null

  function connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const socket = new WebSocket(`${protocol}//${host}`)

    socket.onopen = () => {
      connected.value = true
      socket.send(JSON.stringify({ type: 'auth', userId, username }))
      heartbeatTimer = setInterval(() => {
        socket.send(JSON.stringify({ type: 'ping' }))
      }, 30000)
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        messages.value.push(data)
      } catch {
        // ignore
      }
    }

    socket.onclose = () => {
      connected.value = false
      if (heartbeatTimer) clearInterval(heartbeatTimer)
      // 5 秒后重连
      setTimeout(() => connect(), 5000)
    }

    socket.onerror = () => {
      connected.value = false
    }

    ws.value = socket
  }

  function send(data: any) {
    if (ws.value?.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(data))
    }
  }

  onMounted(() => connect())
  onUnmounted(() => {
    if (heartbeatTimer) clearInterval(heartbeatTimer)
    ws.value?.close()
  })

  return {
    ws,
    connected,
    messages,
    send
  }
}
