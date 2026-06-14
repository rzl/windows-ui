import { describe, it, expect } from 'vitest'
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
})
