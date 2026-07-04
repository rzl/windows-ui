import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PageDesigner from './page-designer.vue'
import ComponentNode from './component-node.vue'

describe('WPageDesigner', () => {
  it('应渲染三栏布局与组件库项', () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer'] }
    })
    expect(wrapper.find('.component-library').exists()).toBe(true)
    expect(wrapper.find('.canvas-panel').exists()).toBe(true)
    expect(wrapper.find('.property-panel').exists()).toBe(true)
    expect(wrapper.text()).toContain('文本')
    expect(wrapper.text()).toContain('按钮')
  })

  it('拖拽添加组件到根画布后应渲染节点', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    const canvas = wrapper.find('.canvas-body')
    await canvas.trigger('drop', { dataTransfer: { getData: () => 'text' } })
    expect(wrapper.findAllComponents(ComponentNode).length).toBe(1)
  })

  it('选中节点后属性面板应展示', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer'] }
    })
    const canvas = wrapper.find('.canvas-body')
    await canvas.trigger('drop', { dataTransfer: { getData: () => 'text' } })
    await wrapper.findComponent(ComponentNode).trigger('click')
    expect(wrapper.findComponent({ name: 'WPagePropertyEditor' }).exists()).toBe(true)
  })

  it('点击保存应触发 save 事件并调用 savePage', async () => {
    const savePage = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(PageDesigner, {
      props: { code: 'test', savePage },
      global: { stubs: ['WDialog', 'WPageRenderer'] }
    })
    const saveBtn = wrapper.findAll('button').find((el) => el.text().includes('保存'))
    if (saveBtn) {
      await saveBtn.trigger('click')
      expect(savePage).toHaveBeenCalled()
      expect(wrapper.emitted('save')).toHaveLength(1)
    }
  })

  it('传入 loadPage 时应加载页面配置', async () => {
    const loadPage = vi.fn().mockResolvedValue({
      code: 'test',
      name: '测试',
      config: {
        components: [{ id: 't1', type: 'text', props: { content: '已加载', tag: 'p' }, styles: {} }]
      }
    })
    const wrapper = mount(PageDesigner, {
      props: { code: 'test', loadPage },
      global: { stubs: ['WDialog', 'WPageRenderer'] }
    })
    await new Promise((r) => setTimeout(r, 0))
    await wrapper.vm.$nextTick()
    expect(loadPage).toHaveBeenCalledWith('test')
    expect(wrapper.findComponent(ComponentNode).props('node').props.content).toBe('已加载')
  })

  it('应渲染 statistic 类型节点而不显示未知组件', async () => {
    const wrapper = mount(PageDesigner, {
      props: {
        code: 'test',
        config: {
          title: '测试',
          components: [
            { id: 's1', type: 'statistic', props: { title: '访问量', icon: 'eye', color: 'primary' }, styles: {}, dataSource: { type: 'static', value: 1024 } }
          ]
        }
      },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.unknown-type').exists()).toBe(false)
    expect(wrapper.text()).toContain('访问量')
  })

  it('应支持撤销与重做', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    const canvas = wrapper.find('.canvas-body')
    await canvas.trigger('drop', { dataTransfer: { getData: () => 'text' } })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(ComponentNode).length).toBe(1)
    await canvas.trigger('drop', { dataTransfer: { getData: () => 'button' } })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(ComponentNode).length).toBe(2)

    // 撤销一次
    ;(wrapper.vm as any).undo()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(ComponentNode).length).toBe(1)

    // 重做
    ;(wrapper.vm as any).redo()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(ComponentNode).length).toBe(2)
  })

  it('初始状态下撤销按钮应禁用，操作后可用', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).canUndo).toBe(false)
    expect((wrapper.vm as any).canRedo).toBe(false)

    const canvas = wrapper.find('.canvas-body')
    await canvas.trigger('drop', { dataTransfer: { getData: () => 'text' } })
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).canUndo).toBe(true)
  })
})
