import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CrudTable from './crud-table.vue'

describe('CrudTable', () => {
  const columns = [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' }
  ]
  const data = [
    { id: 1, name: '张三', age: 20 },
    { id: 2, name: '李四', age: 25 }
  ]

  it('应渲染表格和分页', () => {
    const wrapper = mount(CrudTable, {
      props: { data, columns, total: 2 },
      global: {
        stubs: ['WIcon']
      }
    })
    expect(wrapper.findComponent({ name: 'WTable' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'WPagination' }).exists()).toBe(true)
  })

  it('应渲染 toolbar 插槽内容', () => {
    const wrapper = mount(CrudTable, {
      props: { data, columns },
      global: {
        stubs: ['WIcon']
      },
      slots: {
        toolbar: '<button class="toolbar-btn">新增</button>'
      }
    })
    expect(wrapper.find('.toolbar-btn').exists()).toBe(true)
  })

  it('应渲染 action 插槽内容', async () => {
    const wrapper = mount(CrudTable, {
      props: {
        data,
        columns: [
          ...columns,
          { prop: 'action', label: '操作' }
        ]
      },
      global: {
        stubs: ['WIcon']
      },
      slots: {
        action: '<button class="action-btn">编辑</button>'
      }
    })
    await flushPromises()
    expect(wrapper.find('.action-btn').exists()).toBe(true)
  })

  it('工具栏应为左右结构，右侧提供列设置入口', () => {
    const wrapper = mount(CrudTable, {
      props: { data, columns },
      global: {
        stubs: ['WIcon']
      }
    })
    expect(wrapper.find('.w-crud-table__toolbar-left').exists()).toBe(true)
    expect(wrapper.find('.w-crud-table__toolbar-right').exists()).toBe(true)
    expect(wrapper.find('.w-crud-table__column-setting-trigger').exists()).toBe(true)
  })

  it('columnSetting 为 false 时不渲染列设置入口', () => {
    const wrapper = mount(CrudTable, {
      props: { data, columns, columnSetting: false },
      global: {
        stubs: ['WIcon']
      }
    })
    expect(wrapper.find('.w-crud-table__column-setting-trigger').exists()).toBe(false)
  })

  it('点击设置图标应打开列设置抽屉并列出全部字段', async () => {
    const wrapper = mount(CrudTable, {
      props: { data, columns },
      global: {
        stubs: ['WIcon']
      },
      attachTo: document.body
    })
    await wrapper.find('.w-crud-table__column-setting-trigger').trigger('click')
    await flushPromises()
    const drawer = document.body.querySelector('.w-drawer')
    expect(drawer).toBeTruthy()
    const items = document.body.querySelectorAll('.w-crud-table__column-setting-table tbody tr')
    expect(items.length).toBe(2)
    const headerText = document.body.querySelector('.w-crud-table__column-setting-table thead')!.textContent
    expect(headerText).toContain('显示')
    expect(headerText).toContain('字段名称')
    expect(headerText).toContain('冻结')
    expect(headerText).toContain('操作')
    expect(drawer!.textContent).toContain('姓名')
    expect(drawer!.textContent).toContain('年龄')
    wrapper.unmount()
  })

  it('取消勾选字段后表格应隐藏对应列', async () => {
    const wrapper = mount(CrudTable, {
      props: { data, columns },
      global: {
        stubs: ['WIcon']
      },
      attachTo: document.body
    })
    await wrapper.find('.w-crud-table__column-setting-trigger').trigger('click')
    await flushPromises()
    const input = document.body.querySelectorAll<HTMLInputElement>('.w-crud-table__column-setting-table tbody input[type=checkbox]')[1]
    input.checked = false
    input.dispatchEvent(new Event('change'))
    await flushPromises()
    const table = wrapper.findComponent({ name: 'WTable' })
    const rendered = (table.props('columns') as any[]).map(c => c.prop)
    expect(rendered).not.toContain('age')
    expect(rendered).toContain('name')
    wrapper.unmount()
  })

  it('点击上移/下移按钮应调整列顺序', async () => {
    const wrapper = mount(CrudTable, {
      props: { data, columns },
      global: {
        stubs: ['WIcon']
      },
      attachTo: document.body
    })
    await wrapper.find('.w-crud-table__column-setting-trigger').trigger('click')
    await flushPromises()
    const downBtn = document.body.querySelectorAll<HTMLButtonElement>('.w-crud-table__column-setting-move-btn')[1]
    downBtn.click()
    await flushPromises()
    const table = wrapper.findComponent({ name: 'WTable' })
    const rendered = (table.props('columns') as any[]).map(c => c.prop)
    expect(rendered.indexOf('age')).toBeLessThan(rendered.indexOf('name'))
    wrapper.unmount()
  })

  it('选择冻结方向后表格对应列应应用 fixed', async () => {
    const wrapper = mount(CrudTable, {
      props: { data, columns },
      global: {
        stubs: ['WIcon']
      },
      attachTo: document.body
    })
    await wrapper.find('.w-crud-table__column-setting-trigger').trigger('click')
    await flushPromises()
    const selects = document.body.querySelectorAll<HTMLSelectElement>('.w-crud-table__column-setting-fixed')
    expect(selects.length).toBe(2)
    selects[0].value = 'left'
    selects[0].dispatchEvent(new Event('change'))
    await flushPromises()
    const table = wrapper.findComponent({ name: 'WTable' })
    const rendered = table.props('columns') as any[]
    expect(rendered.find(c => c.prop === 'name').fixed).toBe('left')
    expect(rendered.find(c => c.prop === 'age').fixed).toBeUndefined()
    wrapper.unmount()
  })

  it('列设置抽屉不显示勾选列、展开列、固定列等不可配置列', async () => {
    const wrapper = mount(CrudTable, {
      props: {
        data,
        columns: [
          { type: 'selection' as const, width: 48, label: '' },
          ...columns,
          { type: 'expand' as const, width: 48, label: '' },
          { prop: 'action', label: '操作', fixed: 'right' as const }
        ]
      },
      global: {
        stubs: ['WIcon']
      },
      attachTo: document.body
    })
    await wrapper.find('.w-crud-table__column-setting-trigger').trigger('click')
    await flushPromises()
    const items = document.body.querySelectorAll('.w-crud-table__column-setting-table tbody tr')
    expect(items.length).toBe(2)
    const bodyText = document.body.querySelector('.w-crud-table__column-setting-table tbody')!.textContent!
    expect(bodyText).toContain('姓名')
    expect(bodyText).toContain('年龄')
    expect(bodyText).not.toContain('操作')
    wrapper.unmount()
  })

  it('columnSetting 为 false 时表头拖拽的 column-order-change 事件应正常透传', async () => {
    const wrapper = mount(CrudTable, {
      props: { data, columns, columnSetting: false },
      global: {
        stubs: ['WIcon']
      }
    })
    const table = wrapper.findComponent({ name: 'WTable' })
    await table.vm.$emit('column-order-change', ['age', 'name'])
    expect(wrapper.emitted('column-order-change')).toBeTruthy()
  })

  it('分页变化应触发 page-change 事件', async () => {
    const wrapper = mount(CrudTable, {
      props: { data, columns, total: 20, currentPage: 1, pageSize: 10 },
      global: {
        stubs: ['WIcon']
      }
    })
    const pagination = wrapper.findComponent({ name: 'WPagination' })
    await pagination.vm.$emit('update:current-page', 2)
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')![0]).toEqual([2])
  })
})
