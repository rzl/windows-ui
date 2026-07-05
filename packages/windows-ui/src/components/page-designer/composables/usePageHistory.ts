import { computed, shallowRef } from 'vue'

export interface UsePageHistoryOptions<T> {
  maxLength?: number
  onRestore?: (snapshot: T) => void
  snapshot?: (data: T) => T
}

function defaultSnapshot<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export function usePageHistory<T>(options: UsePageHistoryOptions<T> = {}) {
  const { maxLength = 50, onRestore, snapshot = defaultSnapshot } = options

  const stack = shallowRef<T[]>([])
  const index = shallowRef(-1)
  const isRestoring = shallowRef(false)

  const canUndo = computed(() => index.value > 0)
  const canRedo = computed(() => index.value < stack.value.length - 1)

  function takeSnapshot(data: T): T {
    return snapshot(data)
  }

  function record(data: T) {
    if (isRestoring.value) return
    const snap = takeSnapshot(data)
    if (index.value < stack.value.length - 1) {
      stack.value = stack.value.slice(0, index.value + 1)
    }
    stack.value.push(snap)
    if (stack.value.length > maxLength) {
      stack.value.shift()
    } else {
      index.value++
    }
  }

  function restore(targetIndex: number): T | null {
    const snap = stack.value[targetIndex]
    if (!snap) return null
    index.value = targetIndex
    isRestoring.value = true
    const cloned = takeSnapshot(snap)
    onRestore?.(cloned)
    isRestoring.value = false
    return cloned
  }

  function undo(): T | null {
    if (!canUndo.value) return null
    return restore(index.value - 1)
  }

  function redo(): T | null {
    if (!canRedo.value) return null
    return restore(index.value + 1)
  }

  function init(data: T) {
    stack.value = [takeSnapshot(data)]
    index.value = 0
  }

  return {
    stack,
    index,
    isRestoring,
    canUndo,
    canRedo,
    record,
    undo,
    redo,
    restore,
    init,
    takeSnapshot
  }
}
