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

// 三级菜单与 default-active 路径解析
const nestedItems = [
  {
    label: '系统管理',
    value: '/system',
    children: [
      {
        label: '组织管理',
        value: '/system/org',
        children: [
          { label: '用户管理', value: '/system/user' },
          { label: '部门管理', value: '/system/dept' }
        ]
      },
      {
        label: '权限管理',
        value: '/system/auth',
        children: [{ label: '角色管理', value: '/system/role' }]
      }
    ]
  }
]

describe('Menu 三级嵌套与 default-active 路径解析', () => {
  it('三级菜单应支持逐级点击展开', async () => {
    const wrapper = mount(Menu, {
      props: { items: nestedItems },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.text()).not.toContain('组织管理')
    await wrapper.findAll('.w-menu__title')[0].trigger('click')
    expect(wrapper.text()).toContain('组织管理')
    expect(wrapper.text()).not.toContain('用户管理')
    await wrapper.find('.w-menu__sub-title').trigger('click')
    expect(wrapper.text()).toContain('用户管理')
  })

  it('default-active 传路径时应自动逐级展开并高亮叶子', () => {
    const wrapper = mount(Menu, {
      props: { items: nestedItems, defaultActive: '/system/user' },
      global: { stubs: ['WIcon'] }
    })
    // 未点击任何分组，三级内容应已展开
    expect(wrapper.text()).toContain('组织管理')
    expect(wrapper.text()).toContain('用户管理')
    const activeTitles = wrapper.findAll('.is-active .w-menu__sub-title')
    expect(activeTitles.some((t) => t.text() === '用户管理')).toBe(true)
  })

  it('default-active 命中时应高亮叶子而非整条分组链', () => {
    const wrapper = mount(Menu, {
      props: { items: nestedItems, defaultActive: '/system/user' },
      global: { stubs: ['WIcon'] }
    })
    const activeTexts = wrapper.findAll('.is-active').map((node) => node.text())
    expect(activeTexts).toContain('用户管理')
    // 中间分组「组织管理」不应高亮（仅自动展开）
    expect(activeTexts).not.toContain('组织管理')
  })

  it('items 异步加载后应能解析 default-active 路径', async () => {
    const wrapper = mount(Menu, {
      props: { items: [], defaultActive: '/system/user' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.text()).not.toContain('用户管理')
    await wrapper.setProps({ items: nestedItems })
    expect(wrapper.text()).toContain('用户管理')
  })

  it('default-active 为顶层叶子路径时应高亮顶层项', () => {
    const wrapper = mount(Menu, {
      props: {
        items: [{ label: '首页', value: '/home' }, ...nestedItems],
        defaultActive: '/home'
      },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.findAll('.w-menu__item')[0].classes()).toContain('is-active')
  })

  it('default-active 未命中任何菜单项时保持无高亮', () => {
    const wrapper = mount(Menu, {
      props: { items: nestedItems, defaultActive: '/not-exists' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.findAll('.is-active').length).toBe(0)
    expect(wrapper.text()).not.toContain('用户管理')
  })
})
