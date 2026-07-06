import { reactive, ref } from 'vue'
import type { PageNode } from '../types'

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
    }
  }

  function addComponentToRoot(type: string) {
    const components = getComponents()
    const node = createDefaultComponent(type)
    components.push(node)
    onSelect(node.id)
    onChange()
  }

  function handleDropToRoot(event: DragEvent) {
    event.preventDefault()
    const type = event.dataTransfer?.getData('componentType')
    if (!type) return
    addComponentToRoot(type)
  }

  function createGhost(text: string) {
    const el = document.createElement('div')
    el.className = 'drag-ghost'
    el.textContent = text
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
      document.querySelector(`[data-node-id="${target.nodeId}"][data-droppable="container"]`)?.classList.add('drop-target-active')
    }
  }

  function clearDropHighlight() {
    document.querySelectorAll('.drop-target-active').forEach((el) => el.classList.remove('drop-target-active'))
  }

  function doDrop(x: number, y: number) {
    const target = findDropTarget(x, y)
    if (!target) return
    const components = getComponents()
    let node = createDefaultComponent(touchState.type)
    if (target.type === 'root') {
      components.push(node)
    } else {
      const container = findNode(components, target.nodeId)
      if (container && isContainerNode(container)) {
        if (!container.children) container.children = []
        if (wrapForContainer) node = wrapForContainer(node, container.type)
        container.children.push(node)
      } else {
        components.push(node)
      }
    }
    onSelect(node.id)
    onChange()
  }

  function handleTouchStart(event: TouchEvent, label: string, type: string) {
    const touch = event.touches[0]
    touchState.type = type
    touchState.label = label
    touchState.startX = touch.clientX
    touchState.startY = touch.clientY
    touchState.dragging = false
    isTouchDragging.value = false
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }

  function handleTouchMove(event: TouchEvent) {
    if (!touchState.type) return
    const touch = event.touches[0]
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
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
    if (touchState.dragging && touchState.ghost) {
      const touch = event.changedTouches[0]
      doDrop(touch.clientX, touch.clientY)
      touchState.ghost.remove()
    } else {
      addComponentToRoot(touchState.type)
    }
    clearDropHighlight()
    touchState.type = ''
    touchState.label = ''
    touchState.dragging = false
    isTouchDragging.value = false
    touchState.ghost = null
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
