import { describe, it, expect, vi, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import PageRenderer from './page-renderer.vue'
import RenderComponent from './render-component.vue'
import GenericRender from './generic-render.vue'
import { registerComponent, unregisterComponent } from './plugin-manager'
import WInput from '../input/input.vue'
import WStatistic from '../statistic/statistic.vue'

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

describe('页面渲染器字段绑定', () => {
  afterAll(() => {
    unregisterComponent('spec-input')
  })

  it('统计卡片绑定 formData 字段后应显示记录值', async () => {
    const wrapper = mount(PageRenderer, {
      props: {
        config: {
          formData: { count: 8 },
          components: [
            { id: 's1', type: 'statistic', props: { title: '数量', field: 'count' }, styles: {}, dataSource: { type: 'static', value: 0 } }
          ]
        },
        preview: true
      },
      global: { components: { WStatistic }, stubs: ['WDialog', 'WResult'] }
    })
    await nextTick()
    expect(wrapper.text()).toContain('数量')
    expect(wrapper.text()).toContain('8')
  })

  it('文本绑定 formData 字段后应以数据为准', async () => {
    const wrapper = mount(PageRenderer, {
      props: {
        config: {
          formData: { name: '张三' },
          components: [
            { id: 't1', type: 'text', props: { content: '默认内容', field: 'name', tag: 'p' }, styles: {} }
          ]
        },
        preview: true
      },
      global: { stubs: ['WDialog', 'WResult'] }
    })
    await nextTick()
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).not.toContain('默认内容')
  })

  it('插件表单组件经 props.field 应与 formData 双向绑定', async () => {
    registerComponent({
      type: 'spec-input',
      label: '测试输入',
      category: 'form',
      defaultNode: () => ({ type: 'spec-input', props: {}, styles: {} }),
      render: ({ node }) => h(GenericRender, { node })
    })
    const wrapper = mount(PageRenderer, {
      props: {
        config: {
          formData: { name: '张三' },
          components: [
            { id: 'i1', type: 'spec-input', props: { field: 'name' }, styles: {} },
            { id: 'i2', type: 'spec-input', props: { field: 'name' }, styles: {} }
          ]
        },
        preview: true
      },
      global: { components: { WSpecInput: WInput }, stubs: ['WDialog', 'WResult'] }
    })
    await nextTick()
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBe(2)
    expect((inputs[0].element as HTMLInputElement).value).toBe('张三')
    expect((inputs[1].element as HTMLInputElement).value).toBe('张三')
    // 写路径：第一个输入框更新后，绑定同一字段的第二个输入框同步变化（证明写入了 formData）
    await inputs[0].setValue('李四')
    expect((wrapper.findAll('input')[1].element as HTMLInputElement).value).toBe('李四')
  })
})
})
