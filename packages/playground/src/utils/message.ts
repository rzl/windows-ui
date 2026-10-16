/**
 * 站点级消息提示：动态挂载组件库 <w-message> 实例，提供全局 message() 调用，
 * 供 playground 演示页与 admin 子应用替代原生 alert 弹窗使用
 */
import { createApp } from 'vue'
import { WMessage } from '@windows-ui/core'

type MessageApi = {
  (msg: string, duration?: number): void
  info: (msg: string, duration?: number) => void
  success: (msg: string, duration?: number) => void
  warning: (msg: string, duration?: number) => void
  error: (msg: string, duration?: number) => void
}

let messageApi: MessageApi | null = null

function resolveApi(): MessageApi {
  if (!messageApi) {
    // 首次调用时挂载独立实例到 body，登录页等无布局场景也能弹出提示
    const container = document.createElement('div')
    document.body.appendChild(container)
    const exposed = createApp(WMessage).mount(container) as any
    const api = ((msg: string, duration?: number) => exposed.show(msg, 'info', duration)) as MessageApi
    api.info = (msg, duration) => exposed.show(msg, 'info', duration)
    api.success = (msg, duration) => exposed.show(msg, 'success', duration)
    api.warning = (msg, duration) => exposed.show(msg, 'warning', duration)
    api.error = (msg, duration) => exposed.show(msg, 'error', duration)
    messageApi = api
  }
  return messageApi
}

export const message: MessageApi = ((msg: string, duration?: number) => resolveApi()(msg, duration)) as MessageApi
message.info = (msg, duration) => resolveApi().info(msg, duration)
message.success = (msg, duration) => resolveApi().success(msg, duration)
message.warning = (msg, duration) => resolveApi().warning(msg, duration)
message.error = (msg, duration) => resolveApi().error(msg, duration)
