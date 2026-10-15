import { watch, isRef, onScopeDispose, type Ref } from 'vue'

type ListenerTarget = Window | Document | HTMLElement | Ref<HTMLElement | undefined> | Ref<Document | undefined>

/**
 * 注册事件监听并在当前作用域（组件/EffectScope）销毁时自动移除。
 * 返回一个手动 stop 函数，可提前解除监听。
 */
export function useEventListener(
  target: ListenerTarget,
  event: string,
  handler: (e: Event) => void,
  options?: AddEventListenerOptions
): () => void {
  if (typeof window === 'undefined') return () => {}

  let stopped = false
  let current: Window | Document | HTMLElement | null = null

  const register = (el: Window | Document | HTMLElement | null | undefined) => {
    if (!el || typeof el.addEventListener !== 'function') return
    el.addEventListener(event, handler as EventListener, options)
    current = el
    stopped = false
  }

  const stop = () => {
    if (stopped || !current) return
    current.removeEventListener(event, handler as EventListener, options)
    current = null
    stopped = true
  }

  if (isRef(target)) {
    watch(target as Ref<HTMLElement | Document | undefined>, (el) => {
      stop()
      register(el)
    }, { immediate: true, flush: 'post' })
  } else {
    register(target as Window | Document | HTMLElement)
  }

  onScopeDispose(stop)
  return stop
}
