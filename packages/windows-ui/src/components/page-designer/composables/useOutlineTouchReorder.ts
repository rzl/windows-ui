import { reactive } from 'vue'

export interface UseOutlineTouchReorderOptions {
  nodeId: string
  nodeLabel: string
  isContainer: boolean
  onReorder: (payload: { sourceId: string; targetId: string; position: 'before' | 'after' | 'inside' }) => void
}

export function useOutlineTouchReorder(options: UseOutlineTouchReorderOptions) {
  const { nodeId, nodeLabel, isContainer, onReorder } = options

  const state = reactive({
    dragging: false,
    ghost: null as HTMLElement | null
  })

  function createGhost(text: string) {
    const el = document.createElement('div')
    el.className = 'outline-drag-ghost'
    el.textContent = text
    el.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      padding: 6px 10px;
      background: var(--w-color-primary, #316ac5);
      color: #fff;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      white-space: nowrap;
      opacity: 0.9;
      transform: translate(-50%, -50%);
    `
    document.body.appendChild(el)
    return el
  }

  function cleanupListeners() {
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
    document.removeEventListener('touchcancel', handleTouchCancel)
  }

  function resetState() {
    state.dragging = false
    state.ghost = null
  }

  function clearDropIndicator() {
    document.querySelectorAll('.outline-node.drop-before, .outline-node.drop-after, .outline-node.drop-inside').forEach((el) => {
      el.classList.remove('drop-before', 'drop-after', 'drop-inside')
    })
  }

  function updateDropIndicator(target: { targetId: string; position: 'before' | 'after' | 'inside' } | null) {
    clearDropIndicator()
    if (!target) return
    const el = document.querySelector(`[data-node-id="${target.targetId}"].outline-node`) as HTMLElement | null
    if (!el) return
    el.classList.add(`drop-${target.position}`)
  }

  function findOutlineNodeElement(x: number, y: number): HTMLElement | null {
    let element = document.elementFromPoint(x, y) as HTMLElement | null
    while (element && element !== document.body) {
      if (element.classList?.contains('outline-node')) return element
      element = element.parentElement
    }
    return null
  }

  function computeDropPosition(rect: DOMRect, y: number): 'before' | 'after' | 'inside' {
    const third = rect.height / 3
    const relativeY = y - rect.top
    if (relativeY < third) return 'before'
    if (isContainer && relativeY > third * 2) return 'inside'
    return 'after'
  }

  function findDropTarget(x: number, y: number): { targetId: string; position: 'before' | 'after' | 'inside' } | null {
    const nodeEl = findOutlineNodeElement(x, y)
    if (!nodeEl) return null
    const targetId = nodeEl.dataset.nodeId
    if (!targetId || targetId === nodeId) return null
    const rect = nodeEl.getBoundingClientRect()
    const position = computeDropPosition(rect, y)
    return { targetId, position }
  }

  function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0]
    if (!touch) return
    state.dragging = false
    state.ghost = null
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: false })
    document.addEventListener('touchcancel', handleTouchCancel)
  }

  function handleTouchMove(event: TouchEvent) {
    const touch = event.touches[0]
    if (!touch) return
    if (!state.dragging) {
      state.dragging = true
      state.ghost = createGhost(nodeLabel)
    }
    event.preventDefault()
    if (state.ghost) {
      state.ghost.style.left = `${touch.clientX}px`
      state.ghost.style.top = `${touch.clientY}px`
    }
    const target = findDropTarget(touch.clientX, touch.clientY)
    updateDropIndicator(target)
  }

  function handleTouchEnd(event: TouchEvent) {
    event.preventDefault()
    cleanupListeners()
    if (state.dragging) {
      const touch = event.changedTouches[0]
      if (touch) {
        const target = findDropTarget(touch.clientX, touch.clientY)
        if (target) {
          onReorder({ sourceId: nodeId, targetId: target.targetId, position: target.position })
        }
      }
      if (state.ghost) state.ghost.remove()
    }
    clearDropIndicator()
    resetState()
  }

  function handleTouchCancel() {
    cleanupListeners()
    if (state.ghost) state.ghost.remove()
    clearDropIndicator()
    resetState()
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    isDragging: () => state.dragging
  }
}
