import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
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
    expect(wrapper.text()).toContain('评分')
    expect(wrapper.text()).toContain('日历')
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
      global: {
        stubs: {
          WDialog: true,
          WPageRenderer: true,
          WPagePropertyEditor: true,
          WStatistic: {
            props: ['title', 'value', 'prefix', 'suffix', 'precision', 'icon', 'color', 'valueStyle'],
            setup(props: { title?: string; value?: number | string }) {
              return () => h('div', { class: 'w-statistic-stub' }, [props.title, String(props.value)])
            }
          }
        }
      }
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

  it('应支持复制与粘贴组件', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    const canvas = wrapper.find('.canvas-body')
    await canvas.trigger('drop', { dataTransfer: { getData: () => 'text' } })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(ComponentNode).length).toBe(1)

    // 选中新拖入的节点
    await wrapper.findComponent(ComponentNode).trigger('click')
    await wrapper.vm.$nextTick()

    // 复制并粘贴
    ;(wrapper.vm as any).copySelectedNode()
    ;(wrapper.vm as any).pasteNode()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(ComponentNode).length).toBe(2)
  })

  it('应支持画布缩放', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).zoom).toBe(1)

    ;(wrapper.vm as any).zoomIn()
    expect((wrapper.vm as any).zoom).toBeGreaterThan(1)

    ;(wrapper.vm as any).zoomOut()
    ;(wrapper.vm as any).zoomOut()
    expect((wrapper.vm as any).zoom).toBeLessThan(1)

    ;(wrapper.vm as any).zoomReset()
    expect((wrapper.vm as any).zoom).toBe(1)

    const canvasBody = wrapper.find('.canvas-body')
    expect(canvasBody.attributes('style')).toContain('transform: scale(1)')
  })

  it('应支持切换画布网格', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).showGrid).toBe(false)
    ;(wrapper.vm as any).showGrid = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.canvas-body').classes()).toContain('show-grid')
  })

  it('按 Delete 键应删除选中节点', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    const canvas = wrapper.find('.canvas-body')
    await canvas.trigger('drop', { dataTransfer: { getData: () => 'text' } })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(ComponentNode).length).toBe(1)

    await wrapper.findComponent(ComponentNode).trigger('click')
    await wrapper.vm.$nextTick()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(ComponentNode).length).toBe(0)
  })

  it('应渲染左侧图标按钮组并默认显示组件库', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.left-sidebar').exists()).toBe(true)
    expect(wrapper.find('.component-library').exists()).toBe(true)
    expect(wrapper.find('.page-info').exists()).toBe(false)
    expect(wrapper.findAll('.sidebar-btn').some((el) => el.text().includes('组件库'))).toBe(true)
    expect(wrapper.findAll('.sidebar-btn').some((el) => el.text().includes('大纲'))).toBe(true)
    expect(wrapper.findAll('.sidebar-btn').some((el) => el.text().includes('页面信息'))).toBe(true)
  })

  it('点击大纲按钮应切换到大纲面板', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    const outlineBtn = wrapper.findAll('.sidebar-btn').find((el) => el.text().includes('大纲'))
    expect(outlineBtn).toBeTruthy()
    await outlineBtn!.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.outline-panel').exists()).toBe(true)
    expect(wrapper.find('.component-library').exists()).toBe(false)
  })

  it('点击页面信息按钮应切换到页面信息面板', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    const pageBtn = wrapper.findAll('.sidebar-btn').find((el) => el.text().includes('页面信息'))
    expect(pageBtn).toBeTruthy()
    await pageBtn!.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.page-info').exists()).toBe(true)
    expect(wrapper.find('.component-library').exists()).toBe(false)
  })

  it('页面信息面板应显示当前页面编码与名称', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    const pageBtn = wrapper.findAll('.sidebar-btn').find((el) => el.text().includes('页面信息'))
    await pageBtn!.trigger('click')
    await wrapper.vm.$nextTick()
    const codeInput = wrapper.find('.page-info input')
    expect(codeInput.exists()).toBe(true)
    expect((codeInput.element as HTMLInputElement).value).toBe('test')
    expect(wrapper.text()).toContain('页面信息')
  })

  it('顶部 tabs 默认显示主页面且支持添加子页面', async () => {
    const wrapper = mount(PageDesigner, {
      props: { code: 'test' },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.page-tabs-bar').exists()).toBe(true)
    expect(wrapper.text()).toContain('主页面')

    const addBtn = wrapper.findAll('.page-tabs-bar > *').find((el) => el.text().includes('子页面'))
    expect(addBtn).toBeTruthy()
    await addBtn!.trigger('click')
    await wrapper.vm.$nextTick()

    expect((wrapper.vm as any).allPages.length).toBe(2)
    expect(wrapper.text()).toContain('子页面1')
  })

  it('顶部 tabs 支持切换与删除子页面', async () => {
    const wrapper = mount(PageDesigner, {
      props: {
        code: 'test',
        config: {
          title: '测试',
          subPages: [
            { code: 'sub1', name: '子页面1', config: { components: [] } }
          ],
          components: []
        }
      },
      global: { stubs: ['WDialog', 'WPageRenderer', 'WPagePropertyEditor'] }
    })
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).allPages.length).toBe(2)

    const subTab = wrapper.findAll('.page-tab').find((el) => el.text().includes('子页面1'))
    expect(subTab).toBeTruthy()
    await subTab!.trigger('click')
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).activePageCode).toBe('sub1')

    const close = wrapper.findAll('.page-tab-close').find((el) => el.text().includes('×'))
    expect(close).toBeTruthy()
    await close!.trigger('click')
    await wrapper.vm.$nextTick()

    expect((wrapper.vm as any).allPages.length).toBe(1)
    expect((wrapper.vm as any).activePageCode).toBe('test')
  })
})
