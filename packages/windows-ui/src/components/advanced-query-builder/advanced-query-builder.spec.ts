import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick, defineComponent } from 'vue'
import AdvancedQueryBuilder from './advanced-query-builder.vue'

function findButton(wrapper: any, text: string) {
  return wrapper.findAll('button').find((b: any) => b.text().includes(text))
}

describe('AdvancedQueryBuilder', () => {
  const fields = [
    { prop: 'name', label: '姓名', type: 'string' },
    { prop: 'age', label: '年龄', type: 'number' }
  ]

  it('添加条件后应渲染条件行', async () => {
    const wrapper = mount(AdvancedQueryBuilder, {
      props: { fields },
      global: {
        stubs: ['WIcon']
      }
    })
    const addBtn = findButton(wrapper, '添加条件')
    await addBtn!.trigger('click')
    const rows = wrapper.findAll('.w-advanced-query-group__condition')
    expect(rows.length).toBe(1)
  })

  it('点击添加分组应增加一个条件组', async () => {
    const wrapper = mount(AdvancedQueryBuilder, {
      props: { fields },
      global: {
        stubs: ['WIcon']
      }
    })
    const addGroupBtn = findButton(wrapper, '添加分组')
    await addGroupBtn!.trigger('click')
    const groups = wrapper.findAll('.w-advanced-query-group')
    expect(groups.length).toBeGreaterThan(1)
  })

  it('点击查询应触发 search 事件并返回复杂条件对象', async () => {
    const wrapper = mount(AdvancedQueryBuilder, {
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
    const condition = wrapper.emitted('search')![0][0] as any
    expect(condition).toMatchObject({
      logic: 'and',
      conditions: [
        { field: 'name', op: 'like', value: '' }
      ]
    })
  })

  it('点击重置应触发 reset 事件并清空条件', async () => {
    const wrapper = mount(AdvancedQueryBuilder, {
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
    const groups = wrapper.findAll('.w-advanced-query-group__condition')
    expect(groups.length).toBe(0)
  })

  it('v-model 绑定不应触发递归更新警告', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const Wrapper = defineComponent({
      setup() {
        const query = ref({ logic: 'and', conditions: [] })
        return { query, fields }
      },
      template: '<AdvancedQueryBuilder v-model="query" :fields="fields" />',
      components: { AdvancedQueryBuilder }
    })

    const wrapper = mount(Wrapper, {
      global: {
        stubs: ['WIcon']
      }
    })

    await nextTick()
    await nextTick()

    const addBtn = findButton(wrapper, '添加条件')
    await addBtn!.trigger('click')
    await nextTick()
    await nextTick()

    const recursiveWarning = warnSpy.mock.calls.find((call) =>
      typeof call[0] === 'string' && call[0].includes('Maximum recursive updates exceeded')
    )
    expect(recursiveWarning).toBeUndefined()

    warnSpy.mockRestore()
  })
})
