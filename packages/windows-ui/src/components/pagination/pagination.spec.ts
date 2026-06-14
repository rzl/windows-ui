import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from './pagination.vue'

describe('Pagination', () => {
  it('默认渲染分页组件', () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 1, pageSize: 10, total: 100 },
      global: { stubs: ['WButton'] }
    })
    expect(wrapper.classes()).toContain('w-pagination')
    expect(wrapper.findAll('.w-pagination__page').length).toBe(3)
  })

  it('根据 total 和 pageSize 计算总页数并显示页码', () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 1, pageSize: 10, total: 25 },
      global: { stubs: ['WButton'] }
    })
    const pages = wrapper.findAll('.w-pagination__page').map((el) => Number(el.text()))
    expect(pages).toEqual([1, 2, 3])
  })

  it('当前页码应高亮', () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 3, pageSize: 10, total: 100 },
      global: { stubs: ['WButton'] }
    })
    const active = wrapper.findAll('.w-pagination__page').find((el) => el.classes('is-active'))
    expect(active?.text()).toBe('3')
  })

  it('点击页码应触发 update:current-page 和 change', async () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 1, pageSize: 10, total: 100 },
      global: { stubs: ['WButton'] }
    })
    await wrapper.findAll('.w-pagination__page')[2].trigger('click')
    expect(wrapper.emitted('update:current-page')![0]).toEqual([3])
    expect(wrapper.emitted('change')![0]).toEqual([3])
  })

  it('上一页按钮在首页应禁用', () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 1, pageSize: 10, total: 100 },
      global: { stubs: ['WButton'] }
    })
    const buttons = wrapper.findAllComponents({ name: 'WButton' })
    expect(buttons[0].props('disabled')).toBe(true)
    expect(buttons[1].props('disabled')).toBe(false)
  })

  it('下一页按钮在末页应禁用', () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 10, pageSize: 10, total: 100 },
      global: { stubs: ['WButton'] }
    })
    const buttons = wrapper.findAllComponents({ name: 'WButton' })
    expect(buttons[0].props('disabled')).toBe(false)
    expect(buttons[1].props('disabled')).toBe(true)
  })

  it('点击上一页/下一页应触发对应事件', async () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 5, pageSize: 10, total: 100 },
      global: { stubs: ['WButton'] }
    })
    const buttons = wrapper.findAllComponents({ name: 'WButton' })
    await buttons[0].trigger('click')
    expect(wrapper.emitted('update:current-page')![0]).toEqual([4])
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:current-page')![1]).toEqual([6])
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Pagination, {
      props: { size: 'small' },
      global: { stubs: ['WButton'] }
    })
    expect(wrapperSmall.classes()).toContain('w-pagination--small')

    const wrapperLarge = mount(Pagination, {
      props: { size: 'large' },
      global: { stubs: ['WButton'] }
    })
    expect(wrapperLarge.classes()).toContain('w-pagination--large')
  })
})
