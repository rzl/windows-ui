import { watch, onScopeDispose, type Ref } from 'vue'

/**
 * 弹层打开时锁定 body 滚动（引用计数）：
 * 多个弹层同时打开时只在第一个弹层打开时锁定、最后一个关闭时恢复，
 * 避免叠加弹层关闭时提前解锁。
 */
let lockCount = 0
let savedOverflow = ''

function acquireLock() {
  if (typeof document === 'undefined') return
  lockCount++
  if (lockCount === 1) {
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
}

function releaseLock() {
  if (lockCount === 0 || typeof document === 'undefined') return
  lockCount--
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow
  }
}

export function useScrollLock(visible: Ref<boolean>): void {
  let locked = false

  // immediate：组件挂载时 visible 已为 true 的场景（如 message-box 常驻实例）也要上锁
  watch(visible, (val) => {
    if (val && !locked) {
      locked = true
      acquireLock()
    } else if (!val && locked) {
      locked = false
      releaseLock()
    }
  }, { immediate: true })

  onScopeDispose(() => {
    if (locked) {
      locked = false
      releaseLock()
    }
  })
}
