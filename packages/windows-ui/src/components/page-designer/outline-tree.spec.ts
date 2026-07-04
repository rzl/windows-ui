import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OutlineTree from './outline-tree.vue'

describe('WPageOutlineTree', () => {
  const components = [
    { id: 't1', type: 'text', props: { content: '标题' }, styles: {} },
    {
      id: 'c1',
      type: 'container',
      props: { padding: '12px' },
      styles: {},
      children: [
        { id: 'b1', type: 'button', props: { label: '按钮' }, styles: {} }
      ]
    }
  ]

  it('应渲染组件列表', () => {
    const wrapper = mount(OutlineTree, {
      props: { components, selectedId: '' }
    })
    expect(wrapper.text()).toContain('text · 标题')
    expect(wrapper.text()).toContain('container')
  })

  it('点击节点应触发 select 事件', async () => {
    const wrapper = mount(OutlineTree, {
      props: { components, selectedId: '' }
    })
    const nodes = wrapper.findAll('.outline-node')
    await nodes[0].trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')![0]).toEqual(['t1'])
  })

  it('容器默认折叠，点击展开后显示子节点', async () => {
    const wrapper = mount(OutlineTree, {
      props: { components, selectedId: '' }
    })
    expect(wrapper.text()).not.toContain('button · 按钮')
    const toggle = wrapper.find('.outline-toggle')
    await toggle.trigger('click')
    expect(wrapper.text()).toContain('button · 按钮')
  })
})
