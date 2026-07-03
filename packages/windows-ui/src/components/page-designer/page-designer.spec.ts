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
})
