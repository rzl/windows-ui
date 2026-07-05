import { describe, it, expect, vi } from 'vitest'
import { reactive, ref } from 'vue'
import { useNodeTree } from './useNodeTree'
import type { PageNode } from '../types'

describe('useNodeTree', () => {
  function createNode(type: string, id: string): PageNode {
    return { id, type, props: {}, styles: {} }
  }

  it('addComponent 应添加到根画布', () => {
    const components = reactive<PageNode[]>([])
    const onSelect = vi.fn()
    const onChange = vi.fn()
    const tree = useNodeTree({
      getComponents: () => components,
      selectedNode: ref(null),
      isContainerNode: () => false,
      createDefaultComponent: (type) => createNode(type, 'new'),
      onSelect,
      onChange
    })

    tree.addComponent('text')
    expect(components.length).toBe(1)
    expect(components[0].type).toBe('text')
    expect(onSelect).toHaveBeenCalledWith('new')
    expect(onChange).toHaveBeenCalled()
  })

  it('addComponent 应添加到选中的容器', () => {
    const container = createNode('container', 'c1')
    container.children = []
    const components = reactive<PageNode[]>([container])
    const tree = useNodeTree({
      getComponents: () => components,
      selectedNode: ref(container),
      isContainerNode: (node) => node?.type === 'container',
      createDefaultComponent: (type) => createNode(type, 'child'),
      onSelect: vi.fn(),
      onChange: vi.fn()
    })

    tree.addComponent('text')
    expect(container.children?.length).toBe(1)
    expect(container.children?.[0].id).toBe('child')
  })

  it('deleteNode 应删除节点并清空选中', () => {
    const components = reactive<PageNode[]>([
      createNode('text', 't1'),
      createNode('button', 'b1')
    ])
    const selectedId = ref('t1')
    const tree = useNodeTree({
      getComponents: () => components,
      selectedNode: ref(null),
      selectedId,
      isContainerNode: () => false,
      createDefaultComponent: (type) => createNode(type, 'new'),
      onSelect: vi.fn(),
      onChange: vi.fn()
    })

    tree.deleteNode({ id: 't1' })
    expect(components.length).toBe(1)
    expect(components[0].id).toBe('b1')
    expect(selectedId.value).toBe('')
  })

  it('moveNode 应支持上移下移', () => {
    const components = reactive<PageNode[]>([
      createNode('text', 'a'),
      createNode('button', 'b'),
      createNode('image', 'c')
    ])
    const tree = useNodeTree({
      getComponents: () => components,
      selectedNode: ref(null),
      isContainerNode: () => false,
      createDefaultComponent: (type) => createNode(type, 'new'),
      onSelect: vi.fn(),
      onChange: vi.fn()
    })

    tree.moveNode({ id: 'b', direction: 'up' })
    expect(components.map((n) => n.id)).toEqual(['b', 'a', 'c'])

    tree.moveNode({ id: 'b', direction: 'down' })
    expect(components.map((n) => n.id)).toEqual(['a', 'b', 'c'])
  })

  it('moveNodeTo 应支持 before/after 重排', () => {
    const components = reactive<PageNode[]>([
      createNode('text', 'a'),
      createNode('button', 'b'),
      createNode('image', 'c')
    ])
    const tree = useNodeTree({
      getComponents: () => components,
      selectedNode: ref(null),
      isContainerNode: () => false,
      createDefaultComponent: (type) => createNode(type, 'new'),
      onSelect: vi.fn(),
      onChange: vi.fn()
    })

    tree.moveNodeTo({ sourceId: 'c', targetId: 'a', position: 'before' })
    expect(components.map((n) => n.id)).toEqual(['c', 'a', 'b'])

    tree.moveNodeTo({ sourceId: 'a', targetId: 'b', position: 'after' })
    expect(components.map((n) => n.id)).toEqual(['c', 'b', 'a'])
  })

  it('moveNodeTo 应支持拖入容器', () => {
    const container = createNode('container', 'c1')
    container.children = [createNode('text', 'child')]
    const components = reactive<PageNode[]>([container, createNode('button', 'btn')])
    const tree = useNodeTree({
      getComponents: () => components,
      selectedNode: ref(null),
      isContainerNode: (node) => node?.type === 'container',
      createDefaultComponent: (type) => createNode(type, 'new'),
      onSelect: vi.fn(),
      onChange: vi.fn()
    })

    tree.moveNodeTo({ sourceId: 'btn', targetId: 'c1', position: 'inside' })
    expect(components.length).toBe(1)
    expect(container.children?.length).toBe(2)
    expect(container.children?.map((n) => n.id)).toContain('btn')
  })

  it('moveNodeTo 应禁止把祖先拖入后代', () => {
    const container = createNode('container', 'c1')
    const child = createNode('text', 'child')
    container.children = [child]
    const components = reactive<PageNode[]>([container])
    const tree = useNodeTree({
      getComponents: () => components,
      selectedNode: ref(null),
      isContainerNode: (node) => node?.type === 'container',
      createDefaultComponent: (type) => createNode(type, 'new'),
      onSelect: vi.fn(),
      onChange: vi.fn()
    })

    tree.moveNodeTo({ sourceId: 'c1', targetId: 'child', position: 'inside' })
    expect(container.children?.length).toBe(1)
    expect(container.children?.[0].id).toBe('child')
  })
})
