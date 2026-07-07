import { onUnmounted, reactive } from 'vue'

export interface UseNodeTouchReorderOptions {
  nodeId: string
  nodeLabel: string
  onReorder: (payload: { sourceId: string; targetId: string; position: 'before' | 'after' | 'inside' }) => void
}

export function useNodeTouchReorder(options: UseNodeTouchReorderOptions) {
  const { nodeId, nodeLabel, onReorder } = options

  const state = reactive({
    dragging: false,
    ghost: null as HTMLElement | null,
    dropTargetId: '',
    dropPosition: null as 'before' | 'after' | 'inside' | null
  })

  function createGhost(text: string) {
    const el = document.createElement('div')
    el.className = 'node-drag-ghost'
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
    state.dropTargetId = ''
    state.dropPosition = null
  }

  function clearDropIndicator() {
    document.querySelectorAll('.component-node.drop-before, .component-node.drop-after, .component-node.drop-inside').forEach((el) => {
      el.classList.remove('drop-before', 'drop-after', 'drop-inside')
      const area = el.querySelector('.children-area')
      if (area) area.classList.remove('drop-target-active')
    })
  }

  function updateDropIndicator(target: { targetId: string; position: 'before' | 'after' | 'inside' } | null) {
    clearDropIndicator()
    if (!target) return
    const el = document.querySelector(`[data-node-id="${target.targetId}"].component-node`) as HTMLElement | null
    if (!el) return
    if (target.position === 'inside') {
      el.classList.add('drop-inside')
      const area = el.querySelector('.children-area') as HTMLElement | null
      if (area) area.classList.add('drop-target-active')
    } else {
      el.classList.add(`drop-${target.position}`)
    }
  }

  function findComponentNodeElement(x: number, y: number): HTMLElement | null {
    let element = document.elementFromPoint(x, y) as HTMLElement | null
    while (element && element !== document.body) {
      if (element.classList?.contains('component-node')) return element
      element = element.parentElement
    }
    return null
  }

  function findDropTarget(x: number, y: number): { targetId: string; position: 'before' | 'after' | 'inside' } | null {
    let element = document.elementFromPoint(x, y) as HTMLElement | null
    while (element && element !== document.body) {
      // 优先判断容器子区域：拖入子节点
      if (element.classList?.contains('children-area') && element.dataset.nodeId) {
        return { targetId: element.dataset.nodeId, position: 'inside' }
      }
      element = element.parentElement
    }

    const nodeEl = findComponentNodeElement(x, y)
    if (!nodeEl) return null
    const targetId = nodeEl.dataset.nodeId
    if (!targetId || targetId === nodeId) return null

    const rect = nodeEl.getBoundingClientRect()
    const position: 'before' | 'after' = y < rect.top + rect.height / 2 ? 'before' : 'after'
    return { targetId, position }
  }

  function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0]
    if (!touch) return
    state.dragging = false
    state.ghost = null
    state.dropTargetId = ''
    state.dropPosition = null
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
    state.dropTargetId = target?.targetId || ''
    state.dropPosition = target?.position || null
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

  onUnmounted(() => {
    cleanupListeners()
    if (state.ghost) state.ghost.remove()
    clearDropIndicator()
  })

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    isDragging: () => state.dragging
  }
}
