import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Menu from './menu.vue'

const items = [
  { label: '首页', value: 'home' },
  {
    label: '系统管理',
    value: 'system',
    children: [
      { label: '用户管理', value: 'user' },
      { label: '角色管理', value: 'role' }
    ]
  }
]

describe('Menu', () => {
  it('应渲染菜单项', () => {
    const wrapper = mount(Menu, {
      props: { items },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('.w-menu').exists()).toBe(true)
    expect(wrapper.text()).toContain('首页')
    expect(wrapper.text()).toContain('系统管理')
  })

  it('点击叶子菜单项应触发 select', async () => {
    const wrapper = mount(Menu, {
      props: { items },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.findAll('.w-menu__title')[0].trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')![0]).toEqual(['home'])
  })

  it('点击父菜单项应展开/收起子菜单', async () => {
    const wrapper = mount(Menu, {
      props: { items },
      global: { stubs: ['WIcon'] }
    })
    const parentTitle = wrapper.findAll('.w-menu__title')[1]
    await parentTitle.trigger('click')
    expect(wrapper.text()).toContain('用户管理')
    await parentTitle.trigger('click')
    expect(wrapper.text()).not.toContain('用户管理')
  })

  it('collapse 模式下鼠标悬停应显示子菜单', async () => {
    const wrapper = mount(Menu, {
      props: { items, collapse: true },
      global: { stubs: ['WIcon'] }
    })
    const parentItem = wrapper.findAll('.w-menu__item')[1]
    await parentItem.trigger('mouseenter')
    expect(wrapper.text()).toContain('用户管理')
  })

  it('collapse 模式下子菜单通过鼠标悬停显示', async () => {
    const wrapper = mount(Menu, {
      props: { items, collapse: true },
      global: { stubs: ['WIcon'] }
    })
    const parentItem = wrapper.findAll('.w-menu__item')[1]
    await parentItem.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('用户管理')
  })

  it('子菜单选择应触发 select 并传递 value', async () => {
    const wrapper = mount(Menu, {
      props: { items },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.findAll('.w-menu__title')[1].trigger('click')
    await wrapper.findAll('.w-menu__sub-title')[0].trigger('click')
    expect(wrapper.emitted('select')![0]).toEqual(['user'])
  })
})
