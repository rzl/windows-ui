import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
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

  it('应渲染统计卡片节点', () => {
    const wrapper = mount(RenderComponent, {
      props: {
        node: {
          id: 's1',
          type: 'statistic',
          props: { title: '访问量', icon: 'eye', color: 'primary' },
          styles: {},
          dataSource: { type: 'static', value: 1024 }
        }
      }
    })
    expect(wrapper.text()).toContain('访问量')
    expect(wrapper.text()).toContain('1024')
    expect(wrapper.text()).not.toContain('未知组件')
  })

  it('应渲染公告节点', () => {
    const wrapper = mount(RenderComponent, {
      props: {
        node: {
          id: 'a1',
          type: 'alert',
          props: { content: '公告内容', type: 'info' },
          styles: {}
        }
      },
      global: {
        stubs: {
          WAlert: {
            props: ['title', 'description', 'type', 'closable'],
            setup(props: { title?: string; description?: string }) {
              return () => h('div', { class: 'w-alert-stub' }, [props.title, props.description])
            }
          }
        }
      }
    })
    expect(wrapper.text()).toContain('公告内容')
    expect(wrapper.text()).not.toContain('未知组件')
  })

  it('应渲染输入框节点', () => {
    const wrapper = mount(RenderComponent, {
      props: {
        node: { id: 'i1', type: 'input', props: { label: '用户名', placeholder: '请输入用户名', type: 'text', modelValue: '' }, styles: {} }
      }
    })
    expect(wrapper.text()).not.toContain('未知组件')
  })

  it('应渲染选择器节点', () => {
    const wrapper = mount(RenderComponent, {
      props: {
        node: { id: 's1', type: 'select', props: { label: '状态', placeholder: '请选择', options: [{ label: '启用', value: '1' }], modelValue: '' }, styles: {} }
      }
    })
    expect(wrapper.text()).not.toContain('未知组件')
  })

  it('应渲染开关节点', () => {
    const wrapper = mount(RenderComponent, {
      props: {
        node: { id: 'sw1', type: 'switch', props: { label: '是否启用', modelValue: true }, styles: {} }
      }
    })
    expect(wrapper.text()).not.toContain('未知组件')
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
