/**
 * 全局消息提示：由 LowcodeLayout 挂载 <w-message> 并注册实例，
 * 请求层（api/request.ts）等非组件上下文通过 toastError / toastSuccess 弹出提示
 */
type MessageApi = {
  info: (msg: string, duration?: number) => void
  success: (msg: string, duration?: number) => void
  warning: (msg: string, duration?: number) => void
  error: (msg: string, duration?: number) => void
}

let messageApi: MessageApi | null = null

export function setMessageApi(api: MessageApi | null) {
  messageApi = api
}

function fallbackLog(message: string) {
  // 组件未挂载（如登录页）时降级到 console
  console.warn(`[toast] ${message}`)
}

export function toastError(message: string) {
  if (messageApi) messageApi.error(message)
  else fallbackLog(message)
}

export function toastSuccess(message: string) {
  if (messageApi) messageApi.success(message)
  else fallbackLog(message)
}

export function toastInfo(message: string) {
  if (messageApi) messageApi.info(message)
  else fallbackLog(message)
}

export function toastWarning(message: string) {
  if (messageApi) messageApi.warning(message)
  else fallbackLog(message)
}
