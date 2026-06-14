import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tree from './tree.vue'

const treeData = [
  {
    label: '父节点1',
    value: '1',
    children: [
      { label: '子节点1-1', value: '1-1' },
      { label: '子节点1-2', value: '1-2' }
    ]
  },
  { label: '叶子节点2', value: '2' }
]

describe('Tree', () => {
  it('应渲染树节点', () => {
    const wrapper = mount(Tree, {
      props: { data: treeData },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.classes()).toContain('w-tree')
    expect(wrapper.text()).toContain('父节点1')
    expect(wrapper.text()).toContain('叶子节点2')
  })

  it('expandAll 为 true 时应展开所有子节点', () => {
    const wrapper = mount(Tree, {
      props: { data: treeData, expandAll: true },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.text()).toContain('子节点1-1')
    expect(wrapper.text()).toContain('子节点1-2')
  })

  it('点击父节点应展开/收起子节点', async () => {
    const wrapper = mount(Tree, {
      props: { data: treeData },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.text()).not.toContain('子节点1-1')
    await wrapper.findAll('.w-tree-node__content')[0].trigger('click')
    expect(wrapper.text()).toContain('子节点1-1')
    await wrapper.findAll('.w-tree-node__content')[0].trigger('click')
    expect(wrapper.text()).not.toContain('子节点1-1')
  })

  it('点击节点应触发 node-click 事件', async () => {
    const wrapper = mount(Tree, {
      props: { data: treeData },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.findAll('.w-tree-node__content')[1].trigger('click')
    expect(wrapper.emitted('node-click')).toHaveLength(1)
    expect(wrapper.emitted('node-click')![0][0]).toMatchObject({ label: '叶子节点2', value: '2' })
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Tree, {
      props: { data: treeData, size: 'small' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapperSmall.classes()).toContain('w-tree--small')

    const wrapperLarge = mount(Tree, {
      props: { data: treeData, size: 'large' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapperLarge.classes()).toContain('w-tree--large')
  })
})
