import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PageRenderer from './page-renderer.vue'
import RenderComponent from './render-component.vue'

describe('WPageRenderer', () => {
  it('应渲染传入的静态页面配置', async () => {
    const wrapper = mount(PageRenderer, {
      props: {
        config: {
          title: '测试页面',
          components: [
            { id: 't1', type: 'text', props: { content: '你好', tag: 'p', align: 'left' }, styles: {} }
          ]
        },
        preview: true
      },
      global: { stubs: ['WDialog', 'WResult'] }
    })
    await wrapper.vm.$nextTick()
    const renderComponents = wrapper.findAllComponents(RenderComponent)
    expect(renderComponents.length).toBe(1)
    expect(renderComponents[0]?.props('node').props.content).toBe('你好')
  })

  it('非预览模式无权限时不应渲染内容组件', async () => {
    const wrapper = mount(PageRenderer, {
      props: {
        code: 'forbidden-page',
        preview: false,
        loadPage: () => Promise.resolve({
          code: 'forbidden-page',
          name: '受限页面',
          permission: 'page:test',
          config: {
            components: [{ id: 't1', type: 'text', props: { content: '你好', tag: 'p' }, styles: {} }]
          }
        }),
        hasPermission: () => false
      },
      global: { stubs: ['WDialog', 'WResult'] }
    })
    await new Promise((r) => setTimeout(r, 0))
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(RenderComponent).length).toBe(0)
  })

  it('应向下传递页面编码', async () => {
    const wrapper = mount(PageRenderer, {
      props: {
        code: 'my-page',
        config: {
          components: [{ id: 't1', type: 'text', props: { content: '你好', tag: 'p' }, styles: {} }]
        },
        preview: true
      },
      global: { stubs: ['WDialog', 'WResult'] }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(RenderComponent).props('pageCode')).toBe('my-page')
  })

  it('传入 loadPage 时应异步加载页面配置', async () => {
    const loadPage = vi.fn().mockResolvedValue({
      code: 'test',
      name: '测试',
      config: {
        components: [{ id: 't1', type: 'text', props: { content: '异步加载', tag: 'p' }, styles: {} }]
      }
    })
    const wrapper = mount(PageRenderer, {
      props: { code: 'test', loadPage, preview: true },
      global: { stubs: ['WDialog', 'WResult'] }
    })
    await new Promise((r) => setTimeout(r, 0))
    await wrapper.vm.$nextTick()
    expect(loadPage).toHaveBeenCalledWith('test')
    expect(wrapper.findComponent(RenderComponent).props('node').props.content).toBe('异步加载')
  })

  it('executeEvent 执行 navigate 动作时应 emit navigate', () => {
    const wrapper = mount(PageRenderer, {
      props: {
        config: { components: [] },
        preview: true
      },
      global: { stubs: ['WDialog', 'WResult'] }
    })
    ;(wrapper.vm as any).executeEvent({ action: 'navigate', target: '/home' })
    expect(wrapper.emitted('navigate')).toHaveLength(1)
    expect(wrapper.emitted('navigate')![0]).toEqual(['/home'])
  })

  it('executeEvent 条件不满足时不应执行动作', () => {
    const wrapper = mount(PageRenderer, {
      props: {
        config: { components: [] },
        preview: true
      },
      global: { stubs: ['WDialog', 'WResult'] }
    })
    ;(wrapper.vm as any).executeEvent({ action: 'navigate', target: '/home', condition: 'false' })
    expect(wrapper.emitted('navigate')).toBeUndefined()
  })

  it('executeEvent 应按顺序执行链式动作', async () => {
    const wrapper = mount(PageRenderer, {
      props: {
        config: { components: [] },
        preview: true
      },
      global: { stubs: ['WDialog', 'WResult'] }
    })
    await (wrapper.vm as any).executeEvent({
      actions: [
        { action: 'setVariable', variable: 'name', value: 'test' },
        { action: 'navigate', target: '/home' }
      ]
    })
    expect(wrapper.emitted('navigate')).toHaveLength(1)
  })

  it('openDialog 应优先使用当前页面的子页面配置', async () => {
    const wrapper = mount(PageRenderer, {
      props: {
        config: {
          components: [],
          subPages: [
            { code: 'sub1', name: '子页面1', config: { components: [{ id: 't1', type: 'text', props: { content: '子页面内容', tag: 'p' }, styles: {} }] } }
          ]
        },
        preview: true
      },
      global: { stubs: ['WDialog', 'WResult'] }
    })
    await wrapper.vm.$nextTick()
    ;(wrapper.vm as any).executeEvent({ action: 'openDialog', target: 'sub1' })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('openDialog')).toHaveLength(1)
    expect(wrapper.emitted('openDialog')![0]).toEqual([{ target: 'sub1', title: '子页面1' }])
  })
})
