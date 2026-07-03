import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RenderComponent from './render-component.vue'

describe('WPageRenderComponent', () => {
  it('应渲染文本节点', () => {
    const wrapper = mount(RenderComponent, {
      props: {
        node: {
          id: 't1',
          type: 'text',
          props: { content: '你好', tag: 'p', align: 'left' },
          styles: {}
        }
      }
    })
    expect(wrapper.text()).toContain('你好')
  })

  it('应渲染未知组件兜底', () => {
    const wrapper = mount(RenderComponent, {
      props: {
        node: { id: 'u1', type: 'unknown', props: {}, styles: {} }
      }
    })
    expect(wrapper.text()).toContain('未知组件')
  })
})
