import type { Ref } from 'vue'
import type { PageNode } from '../types'

export interface UseNodeTreeOptions {
  getComponents: () => PageNode[]
  selectedNode: { value: PageNode | null }
  selectedId?: Ref<string>
  isContainerNode: (node: PageNode | null) => boolean
  createDefaultComponent: (type: string) => PageNode
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

export function useNodeTree(options: UseNodeTreeOptions) {
  const { getComponents, selectedNode, selectedId, isContainerNode, createDefaultComponent, onSelect, onChange } = options

  function addComponent(type: string) {
    const components = getComponents()
    const targetContainer = selectedNode.value && isContainerNode(selectedNode.value) ? selectedNode.value : null
    if (targetContainer) {
      if (!targetContainer.children) targetContainer.children = []
      const node = createDefaultComponent(type)
      targetContainer.children.push(node)
      onSelect(node.id)
    } else {
      const node = createDefaultComponent(type)
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

  return {
    addComponent,
    deleteNode,
    moveNode
  }
}
