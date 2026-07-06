import type { Ref } from 'vue'
import type { PageNode } from '../types'

export interface UseNodeTreeOptions {
  getComponents: () => PageNode[]
  selectedNode: { value: PageNode | null }
  selectedId?: Ref<string>
  isContainerNode: (node: PageNode | null) => boolean
  createDefaultComponent: (type: string) => PageNode
  wrapForContainer?: (node: PageNode, containerType: string) => PageNode
  onSelect: (id: string) => void
  onChange: () => void
}

function removeNodeInList(list: PageNode[], id: string): boolean {
  const index = list.findIndex((n) => n.id === id)
  if (index >= 0) {
    list.splice(index, 1)
    return true
  }
  for (const node of list) {
    if (node.children?.length && removeNodeInList(node.children, id)) return true
  }
  return false
}

function moveNodeInList(list: PageNode[], id: string, direction: 'up' | 'down'): boolean {
  const index = list.findIndex((n) => n.id === id)
  if (index >= 0) {
    if (direction === 'up' && index > 0) {
      const temp = list[index - 1]
      list[index - 1] = list[index]
      list[index] = temp
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index + 1]
      list[index + 1] = list[index]
      list[index] = temp
    }
    return true
  }
  for (const node of list) {
    if (node.children?.length && moveNodeInList(node.children, id, direction)) return true
  }
  return false
}

function findNodeLocation(list: PageNode[], id: string): { parent: PageNode[]; index: number; node: PageNode } | null {
  const index = list.findIndex((n) => n.id === id)
  if (index >= 0) return { parent: list, index, node: list[index] }
  for (const node of list) {
    if (node.children?.length) {
      const found = findNodeLocation(node.children, id)
      if (found) return found
    }
  }
  return null
}

function isDescendant(parent: PageNode, childId: string): boolean {
  if (!parent.children?.length) return false
  for (const child of parent.children) {
    if (child.id === childId) return true
    if (isDescendant(child, childId)) return true
  }
  return false
}

export function useNodeTree(options: UseNodeTreeOptions) {
  const { getComponents, selectedNode, selectedId, isContainerNode, createDefaultComponent, wrapForContainer, onSelect, onChange } = options

  function addComponent(type: string) {
    const components = getComponents()
    const targetContainer = selectedNode.value && isContainerNode(selectedNode.value) ? selectedNode.value : null
    let node = createDefaultComponent(type)
    if (targetContainer) {
      if (!targetContainer.children) targetContainer.children = []
      if (wrapForContainer) node = wrapForContainer(node, targetContainer.type)
      targetContainer.children.push(node)
      onSelect(node.id)
    } else {
      components.push(node)
      onSelect(node.id)
    }
    onChange()
  }

  function deleteNode({ id }: { id: string }) {
    const components = getComponents()
    removeNodeInList(components, id)
    if (selectedId?.value === id) selectedId.value = ''
    onChange()
  }

  function moveNode({ id, direction }: { id: string; direction: 'up' | 'down' }) {
    const components = getComponents()
    const moved = moveNodeInList(components, id, direction)
    if (moved) onChange()
  }

  function moveNodeTo(payload: { sourceId: string; targetId: string; position: 'before' | 'after' | 'inside' }) {
    const { sourceId, targetId, position } = payload
    if (sourceId === targetId) return

    const components = getComponents()
    const sourceLoc = findNodeLocation(components, sourceId)
    const targetLoc = findNodeLocation(components, targetId)
    if (!sourceLoc || !targetLoc) return

    // 禁止把祖先节点拖入自己的后代
    if (isDescendant(sourceLoc.node, targetId)) return

    // 从原位置移除
    sourceLoc.parent.splice(sourceLoc.index, 1)

    let finalPosition: 'before' | 'after' = position === 'inside' ? 'after' : position
    let targetParent = targetLoc.parent
    let targetIndex = targetLoc.index

    // 如果目标是容器且要求放入内部，则追加到子节点末尾
    if (position === 'inside' && isContainerNode(targetLoc.node)) {
      if (!targetLoc.node.children) targetLoc.node.children = []
      let node = sourceLoc.node
      if (wrapForContainer) node = wrapForContainer(node, targetLoc.node.type)
      targetLoc.node.children.push(node)
      onSelect(sourceId)
      onChange()
      return
    }

    // 拖拽到同一父级时，移除后目标索引可能变化，需要修正
    if (targetParent === sourceLoc.parent && targetIndex > sourceLoc.index) {
      targetIndex--
    }

    const insertIndex = finalPosition === 'before' ? targetIndex : targetIndex + 1
    targetParent.splice(insertIndex, 0, sourceLoc.node)
    onSelect(sourceId)
    onChange()
  }

  return {
    addComponent,
    deleteNode,
    moveNode,
    moveNodeTo
  }
}
