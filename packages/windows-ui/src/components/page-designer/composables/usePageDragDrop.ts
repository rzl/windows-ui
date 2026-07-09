import { reactive, ref } from 'vue'
import type { PageNode } from '../types'

export function computeInsertIndex(clientY: number, rects: Array<{ top: number; height: number }>): number {
  if (!rects.length) return 0
  for (let i = 0; i < rects.length; i++) {
    if (clientY < rects[i].top + rects[i].height / 2) return i
  }
  return rects.length
}

export interface PageDragDropOptions {
  getComponents: () => PageNode[]
  findNode: (list: PageNode[], id: string) => PageNode | null
  isContainerNode: (node: PageNode | null) => boolean
  createDefaultComponent: (type: string) => PageNode
  wrapForContainer?: (node: PageNode, containerType: string) => PageNode
  onSelect: (id: string) => void
  onChange: () => void
}

export function usePageDragDrop(options: PageDragDropOptions) {
  const { getComponents, findNode, isContainerNode, createDefaultComponent, wrapForContainer, onSelect, onChange } = options

  const touchState = reactive({
    type: '',
    label: '',
    startX: 0,
    startY: 0,
    dragging: false,
    ghost: null as HTMLElement | null
  })

  const isTouchDragging = ref(false)

  function handleDragStart(event: DragEvent, type: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('componentType', type)
      // 部分浏览器在 dragenter/dragover 中对自定义类型支持不稳定，
      // 额外写入 text/plain 作为兜底，方便目标区域识别拖拽来源。
      event.dataTransfer.setData('text/plain', `w-page-designer-component:${type}`)
    }
  }

  function computeRootInsertIndex(clientY: number): number {
    const canvasBody = document.querySelector('.canvas-body') as HTMLElement | null
    if (!canvasBody) return -1
    const nodeElements = Array.from(canvasBody.children).filter((el) => el.classList.contains('component-node')) as HTMLElement[]
    const rects = nodeElements.map((el) => el.getBoundingClientRect())
    return computeInsertIndex(clientY, rects)
  }

  function addComponentToRoot(type: string, clientY?: number) {
    const components = getComponents()
    const node = createDefaultComponent(type)
    const insertIndex = clientY !== undefined ? computeRootInsertIndex(clientY) : -1
    if (insertIndex >= 0) {
      components.splice(insertIndex, 0, node)
    } else {
      components.push(node)
    }
    onSelect(node.id)
    onChange()
  }

  function handleDropToRoot(event: DragEvent) {
    event.preventDefault()
    const type = event.dataTransfer?.getData('componentType')
      || event.dataTransfer?.getData('text/plain')?.replace(/^w-page-designer-component:/, '')
    if (!type) return
    addComponentToRoot(type, event.clientY)
  }

  function createGhost(text: string) {
    const el = document.createElement('div')
    el.className = 'drag-ghost'
    el.textContent = text
    el.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      padding: 8px 12px;
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

  function findDropTarget(x: number, y: number) {
    let element = document.elementFromPoint(x, y)
    while (element && element !== document.body) {
      const droppable = element.getAttribute('data-droppable')
      if (droppable === 'root') return { type: 'root' as const }
      if (droppable === 'container') {
        const nodeId = element.getAttribute('data-node-id')
        if (nodeId) return { type: 'container' as const, nodeId }
      }
      element = element.parentElement
    }
    return null
  }

  function highlightDropTarget(x: number, y: number) {
    clearDropHighlight()
    const target = findDropTarget(x, y)
    if (!target) return
    if (target.type === 'root') {
      document.querySelector('.canvas-body')?.classList.add('drop-target-active')
    } else {
      document.querySelector(`[data-node-id="${target.nodeId}"][data-node-container]`)?.classList.add('drop-inside')
    }
  }

  function clearDropHighlight() {
    document.querySelectorAll('.drop-target-active').forEach((el) => el.classList.remove('drop-target-active'))
    document.querySelectorAll('.drop-inside').forEach((el) => el.classList.remove('drop-inside'))
  }

  function doDrop(x: number, y: number) {
    const target = findDropTarget(x, y)
    if (!target) return
    const components = getComponents()
    let node = createDefaultComponent(touchState.type)
    if (target.type === 'root') {
      const insertIndex = computeRootInsertIndex(y)
      if (insertIndex >= 0) components.splice(insertIndex, 0, node)
      else components.push(node)
    } else {
      const container = findNode(components, target.nodeId)
      if (container && isContainerNode(container)) {
        if (!container.children) container.children = []
        if (wrapForContainer) node = wrapForContainer(node, container.type)
        container.children.push(node)
      } else {
        const insertIndex = computeRootInsertIndex(y)
        if (insertIndex >= 0) components.splice(insertIndex, 0, node)
        else components.push(node)
      }
    }
    onSelect(node.id)
    onChange()
  }

  function resetTouchState() {
    touchState.type = ''
    touchState.label = ''
    touchState.dragging = false
    isTouchDragging.value = false
    touchState.ghost = null
  }

  function cleanupTouchListeners() {
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
    document.removeEventListener('touchcancel', handleTouchCancel)
  }

  function handleTouchStart(event: TouchEvent, label: string, type: string) {
    const touch = event.touches[0]
    if (!touch) return
    touchState.type = type
    touchState.label = label
    touchState.startX = touch.clientX
    touchState.startY = touch.clientY
    touchState.dragging = false
    isTouchDragging.value = false
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: false })
    document.addEventListener('touchcancel', handleTouchCancel)
  }

  function handleTouchMove(event: TouchEvent) {
    if (!touchState.type) return
    const touch = event.touches[0]
    if (!touch) return
    const dx = touch.clientX - touchState.startX
    const dy = touch.clientY - touchState.startY
    if (!touchState.dragging && Math.sqrt(dx * dx + dy * dy) > 10) {
      touchState.dragging = true
      isTouchDragging.value = true
      touchState.ghost = createGhost(touchState.label)
    }
    if (touchState.dragging) {
      event.preventDefault()
      if (touchState.ghost) {
        touchState.ghost.style.left = `${touch.clientX}px`
        touchState.ghost.style.top = `${touch.clientY}px`
      }
      highlightDropTarget(touch.clientX, touch.clientY)
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    event.preventDefault()
    cleanupTouchListeners()
    if (touchState.dragging && touchState.ghost) {
      const touch = event.changedTouches[0]
      if (touch) doDrop(touch.clientX, touch.clientY)
      touchState.ghost.remove()
    } else {
      addComponentToRoot(touchState.type)
    }
    clearDropHighlight()
    resetTouchState()
  }

  function handleTouchCancel() {
    cleanupTouchListeners()
    if (touchState.ghost) touchState.ghost.remove()
    clearDropHighlight()
    resetTouchState()
  }

  return {
    isTouchDragging,
    handleDragStart,
    handleDropToRoot,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    addComponentToRoot
  }
}
