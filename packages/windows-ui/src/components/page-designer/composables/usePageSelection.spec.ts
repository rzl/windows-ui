import { describe, it, expect } from 'vitest'
import { reactive } from 'vue'
import { usePageSelection } from './usePageSelection'
import type { PageNode } from '../types'

describe('usePageSelection', () => {
  const nodes: PageNode[] = [
    {
      id: '1',
      type: 'container',
      props: {},
      styles: {},
      children: [
        { id: '2', type: 'text', props: {}, styles: {} }
      ]
    },
    { id: '3', type: 'button', props: {}, styles: {} }
  ]

  it('初始未选中', () => {
    const selection = usePageSelection(() => nodes)
    expect(selection.selectedId.value).toBe('')
    expect(selection.selectedNode.value).toBeNull()
  })

  it('select 后应选中对应节点', () => {
    const selection = usePageSelection(() => nodes)
    selection.select('3')
    expect(selection.selectedId.value).toBe('3')
    expect(selection.selectedNode.value?.type).toBe('button')
  })

  it('findNode 应支持嵌套查找', () => {
    const selection = usePageSelection(() => nodes)
    const found = selection.findNode(nodes, '2')
    expect(found?.type).toBe('text')
  })

  it('clear 后应清空选中', () => {
    const selection = usePageSelection(() => nodes)
    selection.select('3')
    selection.clear()
    expect(selection.selectedId.value).toBe('')
    expect(selection.selectedNode.value).toBeNull()
  })

  it('组件变化后应能重新查找', () => {
    const state = reactive<PageNode[]>([
      { id: 'a', type: 'text', props: {}, styles: {} }
    ])
    const selection = usePageSelection(() => state)
    selection.select('a')
    expect(selection.selectedNode.value?.type).toBe('text')

    state[0] = { id: 'a', type: 'button', props: {}, styles: {} }
    expect(selection.selectedNode.value?.type).toBe('button')
  })
})
