import { computed, ref } from 'vue'
import type { PageNode } from '../types'

export function usePageSelection(getComponents: () => PageNode[]) {
  const selectedId = ref('')

  function findNode(list: PageNode[], id: string): PageNode | null {
    if (!list) return null
    for (const node of list) {
      if (node.id === id) return node
      if (node.children?.length) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  const selectedNode = computed(() => findNode(getComponents(), selectedId.value))

  function select(id: string) {
    selectedId.value = id
  }

  function clear() {
    selectedId.value = ''
  }

  return {
    selectedId,
    selectedNode,
    findNode,
    select,
    clear
  }
}
