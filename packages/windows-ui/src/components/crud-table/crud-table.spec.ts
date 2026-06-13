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
