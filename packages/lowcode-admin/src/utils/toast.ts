/**
 * 全局消息提示：优先使用 LowcodeLayout 挂载并注册的 <w-message> 实例，
 * 请求层（api/request.ts）等非组件上下文通过 toastError / toastSuccess 弹出提示；
 * 未注册实例时（如登录页）动态挂载独立 <w-message> 兜底，保证任何场景都能弹出提示
 */
import { createApp } from 'vue'
import { WMessage } from '@windows-ui/core'

type MessageApi = {
  info: (msg: string, duration?: number) => void
  success: (msg: string, duration?: number) => void
  warning: (msg: string, duration?: number) => void
  error: (msg: string, duration?: number) => void
}

let messageApi: MessageApi | null = null
let fallbackApi: MessageApi | null = null

export function setMessageApi(api: MessageApi | null) {
  messageApi = api
}

function resolveApi(): MessageApi {
  if (messageApi) return messageApi
  if (!fallbackApi) {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const exposed = createApp(WMessage).mount(container) as any
    fallbackApi = {
      info: (msg, duration) => exposed.info(msg, duration),
      success: (msg, duration) => exposed.success(msg, duration),
      warning: (msg, duration) => exposed.warning(msg, duration),
      error: (msg, duration) => exposed.error(msg, duration)
    }
  }
  return fallbackApi
}

export function toastError(message: string) {
  resolveApi().error(message)
}

export function toastSuccess(message: string) {
  resolveApi().success(message)
}

export function toastInfo(message: string) {
  resolveApi().info(message)
}

export function toastWarning(message: string) {
  resolveApi().warning(message)
}
