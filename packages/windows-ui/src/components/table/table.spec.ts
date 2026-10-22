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

describe('Table 列宽拖拽', () => {
  const flush = () => new Promise(resolve => setTimeout(resolve, 0))

  const dragHandle = async (wrapper: ReturnType<typeof mount>, thIndex: number, handleClass: string, deltaX: number) => {
    const th = wrapper.findAll('thead th')[thIndex]
    const handle = th.find(`.w-table__resize-handle${handleClass}`)
    expect(handle.exists(), `第 ${thIndex} 列应存在拖拽手柄 ${handleClass}`).toBe(true)
    await handle.trigger('mousedown', { clientX: 200 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200 + deltaX }))
    document.dispatchEvent(new MouseEvent('mouseup'))
    await flush()
  }

  const colStyleOf = (wrapper: ReturnType<typeof mount>, index: number) =>
    (wrapper.findAll('col')[index].element as HTMLElement).style

  it('普通列拖拽右缘手柄应更新列宽', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          { prop: 'name', label: '姓名', width: 100 },
          { prop: 'age', label: '年龄', width: 100 },
          { prop: 'op', label: '操作', width: 120, fixed: 'right' }
        ]
      },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    await dragHandle(wrapper, 0, '', 40)
    expect(colStyleOf(wrapper, 0).width).toBe('140px')
    wrapper.unmount()
  })

  it('无 width 的弹性列拖拽后应固定为真实列宽', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          { prop: 'name', label: '姓名', width: 100 },
          { prop: 'age', label: '年龄' },
          { prop: 'op', label: '操作', width: 120, fixed: 'right' }
        ]
      },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    // 拖拽前弹性列只有 min-width，没有固定 width
    expect(colStyleOf(wrapper, 1).width).toBe('')
    expect(colStyleOf(wrapper, 1).minWidth).toBe('80px')
    await dragHandle(wrapper, 1, '', -30)
    // 拖拽后弹性列被固定成真实列宽（jsdom 下以 min-width 兜底值为基准）
    expect(colStyleOf(wrapper, 1).width).toBe('50px')
    expect(colStyleOf(wrapper, 1).minWidth).toBe('50px')
    expect(colStyleOf(wrapper, 1).maxWidth).toBe('50px')
    wrapper.unmount()
  })

  it('弹性列固定后，弹性角色应转移给其他无 width 列', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          { prop: 'name', label: '姓名', width: 100 },
          { prop: 'age', label: '年龄' },
          { prop: 'email', label: '邮箱' },
          { prop: 'op', label: '操作', width: 120, fixed: 'right' }
        ]
      },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    await dragHandle(wrapper, 1, '', 20)
    // age 被固定，email 成为新的弹性列（仍只有 min-width）
    expect(colStyleOf(wrapper, 1).width).toBe('100px')
    expect(colStyleOf(wrapper, 2).width).toBe('')
    expect(colStyleOf(wrapper, 2).minWidth).toBe('80px')
    wrapper.unmount()
  })

  it('首个右侧冻结列应提供左缘手柄且拖拽方向相反', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          { prop: 'name', label: '姓名', width: 100 },
          { prop: 'age', label: '年龄', width: 100 },
          { prop: 'op', label: '操作', width: 120, fixed: 'right' }
        ]
      },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    const opTh = wrapper.findAll('thead th')[2]
    expect(opTh.find('.w-table__resize-handle:not(.is-left-edge)').exists()).toBe(true)
    // 鼠标向左移 40px，列应变宽（左缘手柄方向反转）
    await dragHandle(wrapper, 2, '.is-left-edge', -40)
    expect(colStyleOf(wrapper, 2).width).toBe('160px')
    wrapper.unmount()
  })

  it('弹性列拖拽结果应随 storageKey 持久化', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
        storageKey: 'spec-flex-persist',
        columns: [
          { prop: 'name', label: '姓名', width: 100 },
          { prop: 'age', label: '年龄' },
          { prop: 'op', label: '操作', width: 120, fixed: 'right' }
        ]
      },
      global: { stubs: ['WCheckbox', 'WIcon', 'WButton', 'WEmpty'] }
    })
    await dragHandle(wrapper, 1, '', 10)
    const saved = JSON.parse(localStorage.getItem('w-table-spec-flex-persist') || '{}')
    expect(saved.pinned).toContain('age')
    expect(saved.widths.age).toBe(90)
    localStorage.removeItem('w-table-spec-flex-persist')
    wrapper.unmount()
  })
})
