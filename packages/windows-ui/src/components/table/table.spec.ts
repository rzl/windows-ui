import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Table from './table.vue'

const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' }
]

const data = [
  { id: 1, name: 'Tom', age: 20 },
  { id: 2, name: 'Jerry', age: 22 }
]

describe('Table', () => {
  it('应渲染表格、表头和数据行', () => {
    const wrapper = mount(Table, {
      props: { data, columns },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    expect(wrapper.find('.w-table').exists()).toBe(true)
    const ths = wrapper.findAll('th')
    expect(ths.length).toBe(2)
    expect(ths[0].text()).toContain('姓名')
    expect(ths[1].text()).toContain('年龄')
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBeGreaterThanOrEqual(2)
    expect(wrapper.text()).toContain('Tom')
    expect(wrapper.text()).toContain('Jerry')
  })

  it('空数据时应显示空状态', () => {
    const wrapper = mount(Table, {
      props: { data: [], columns },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    expect(wrapper.find('.w-table__empty').exists()).toBe(true)
  })

  it('stripe 和 border 应添加对应类名', () => {
    const wrapper = mount(Table, {
      props: { data, columns, stripe: true, border: true },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    expect(wrapper.find('.w-table').classes()).toContain('is-stripe')
    expect(wrapper.find('.w-table').classes()).toContain('is-border')
  })

  it('点击行应触发 row-click 事件', async () => {
    const wrapper = mount(Table, {
      props: { data, columns },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    const row = wrapper.findAll('tbody tr').find((tr) => tr.text().includes('Tom'))
    expect(row).toBeDefined()
    await row!.trigger('click')
    expect(wrapper.emitted('row-click')).toHaveLength(1)
    expect(wrapper.emitted('row-click')![0][0]).toEqual(data[0])
  })

  it('selection 列应渲染全选复选框', () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ type: 'selection', label: '' }, ...columns]
      },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    const headerCheckbox = wrapper.findAll('th').find((th) => th.findComponent({ name: 'WCheckbox' }).exists())
    expect(headerCheckbox).toBeDefined()
  })

  it('sortable 列点击排序应触发 sort-change', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ prop: 'age', label: '年龄', sortable: true }]
      },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    const sort = wrapper.find('.w-table__sort')
    expect(sort.exists()).toBe(true)
    await sort.trigger('click')
    expect(wrapper.emitted('sort-change')).toBeTruthy()
  })

  it('expand 列应渲染展开图标并触发 expand-change', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ type: 'expand', label: '' }, ...columns]
      },
      slots: { expand: '<div class="expanded">展开内容</div>' },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    const expandIcon = wrapper.find('.w-table__expand-icon')
    expect(expandIcon.exists()).toBe(true)
    await expandIcon.trigger('click')
    expect(wrapper.emitted('expand-change')).toBeTruthy()
    expect(wrapper.find('.expanded').exists()).toBe(true)
  })

  it('showOverflowTooltip 应为单元格内容添加省略结构', () => {
    const wrapper = mount(Table, {
      props: { data, columns, showOverflowTooltip: true },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    expect(wrapper.find('.w-table__cell-content.is-ellipsis').exists()).toBe(true)
    expect(wrapper.find('.w-table__cell-text').exists()).toBe(true)
    expect(wrapper.find('.w-table__cell-text').text()).toContain('Tom')
  })

  it('列级 showOverflowTooltip: false 应覆盖表格级配置', () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          { prop: 'name', label: '姓名', showOverflowTooltip: false },
          { prop: 'age', label: '年龄' }
        ],
        showOverflowTooltip: true
      },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    const contents = wrapper.findAll('tbody tr:first-child .w-table__cell-content')
    expect(contents[0].classes()).not.toContain('is-ellipsis')
    expect(contents[1].classes()).toContain('is-ellipsis')
  })

  it('内容截断的单元格悬浮时应显示提示与复制按钮', async () => {
    const wrapper = mount(Table, {
      props: {
        data: [{ id: 1, name: '一段非常非常长的文本内容', age: 20 }],
        columns,
        showOverflowTooltip: true
      },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] },
      attachTo: document.body
    })
    const textEl = wrapper.find('.w-table__cell-text').element as HTMLElement
    Object.defineProperty(textEl, 'scrollWidth', { value: 200, configurable: true })
    Object.defineProperty(textEl, 'clientWidth', { value: 50, configurable: true })
    await wrapper.find('tbody td').trigger('mouseenter')
    const tooltip = document.body.querySelector('.w-table__cell-tooltip')
    expect(tooltip).toBeTruthy()
    expect(tooltip!.textContent).toContain('一段非常非常长的文本内容')
    expect(tooltip!.querySelector('.w-table__cell-tooltip-copy')).toBeTruthy()
    wrapper.unmount()
  })

  it('内容未截断的单元格悬浮时不应显示提示', async () => {
    const wrapper = mount(Table, {
      props: { data, columns, showOverflowTooltip: true },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] },
      attachTo: document.body
    })
    await wrapper.find('tbody td').trigger('mouseenter')
    expect(document.body.querySelector('.w-table__cell-tooltip')).toBeNull()
    wrapper.unmount()
  })

  it('点击复制按钮应写入剪贴板', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = mount(Table, {
      props: {
        data: [{ id: 1, name: '一段非常非常长的文本内容', age: 20 }],
        columns,
        showOverflowTooltip: true
      },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] },
      attachTo: document.body
    })
    const textEl = wrapper.find('.w-table__cell-text').element as HTMLElement
    Object.defineProperty(textEl, 'scrollWidth', { value: 200, configurable: true })
    Object.defineProperty(textEl, 'clientWidth', { value: 50, configurable: true })
    await wrapper.find('tbody td').trigger('mouseenter')
    const copyBtn = document.body.querySelector('.w-table__cell-tooltip-copy') as HTMLButtonElement
    expect(copyBtn).toBeTruthy()
    copyBtn.click()
    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('一段非常非常长的文本内容')
    })
    wrapper.unmount()
  })
})
