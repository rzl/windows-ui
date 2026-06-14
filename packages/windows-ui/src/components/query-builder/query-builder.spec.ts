import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QueryBuilder from './query-builder.vue'

function findButton(wrapper: any, text: string) {
  return wrapper.findAll('button').find((b: any) => b.text().includes(text))
}

describe('QueryBuilder', () => {
  const fields = [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' }
  ]

  it('添加条件后应渲染字段选择下拉', async () => {
    const wrapper = mount(QueryBuilder, {
      props: { fields },
      global: {
        stubs: ['WIcon']
      }
    })
    const addBtn = findButton(wrapper, '添加条件')
    await addBtn!.trigger('click')
    const selects = wrapper.findAllComponents({ name: 'WSelect' })
    expect(selects.length).toBeGreaterThan(0)
  })

  it('点击添加条件应增加一行', async () => {
    const wrapper = mount(QueryBuilder, {
      props: { fields },
      global: {
        stubs: ['WIcon']
      }
    })
    const addBtn = findButton(wrapper, '添加条件')
    expect(addBtn).toBeDefined()
    await addBtn!.trigger('click')
    const rows = wrapper.findAll('.w-query-builder__row')
    expect(rows.length).toBe(1)
  })

  it('点击查询应触发 search 事件并返回条件', async () => {
    const wrapper = mount(QueryBuilder, {
      props: { fields },
      global: {
        stubs: ['WIcon']
      }
    })
    const addBtn = findButton(wrapper, '添加条件')
    await addBtn!.trigger('click')

    const searchBtn = findButton(wrapper, '查询')
    await searchBtn!.trigger('click')

    expect(wrapper.emitted('search')).toBeTruthy()
    const conditions = wrapper.emitted('search')![0][0] as any[]
    expect(conditions.length).toBe(1)
    expect(conditions[0]).toMatchObject({
      field: 'name',
      operator: 'eq',
      value: ''
    })
  })

  it('点击重置应触发 reset 事件', async () => {
    const wrapper = mount(QueryBuilder, {
      props: { fields },
      global: {
        stubs: ['WIcon']
      }
    })
    const addBtn = findButton(wrapper, '添加条件')
    await addBtn!.trigger('click')

    const resetBtn = findButton(wrapper, '重置')
    await resetBtn!.trigger('click')

    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('字段配置 searchMode 后默认 operator 应同步', async () => {
    const wrapper = mount(QueryBuilder, {
      props: { fields: [{ prop: 'age', label: '年龄', searchMode: 'between' }] },
      global: {
        stubs: ['WIcon']
      }
    })
    const addBtn = findButton(wrapper, '添加条件')
    await addBtn!.trigger('click')

    const searchBtn = findButton(wrapper, '查询')
    await searchBtn!.trigger('click')

    const conditions = wrapper.emitted('search')![0][0] as any[]
    expect(conditions[0].operator).toBe('between')
    expect(Array.isArray(conditions[0].value)).toBe(true)
  })
})
