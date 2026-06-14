import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './button.vue'

describe('Button', () => {
  it('默认渲染默认类型按钮', () => {
    const wrapper = mount(Button, {
      slots: { default: '按钮' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.classes()).toContain('w-button')
    expect(wrapper.classes()).toContain('w-button--default')
    expect(wrapper.text()).toBe('按钮')
  })

  it('根据 type 渲染对应类型类名', () => {
    const types = ['primary', 'success', 'warning', 'danger', 'info']
    for (const type of types) {
      const wrapper = mount(Button, {
        props: { type },
        global: { stubs: ['WIcon'] }
      })
      expect(wrapper.classes()).toContain(`w-button--${type}`)
    }
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Button, {
      props: { size: 'small' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapperSmall.classes()).toContain('w-button--small')

    const wrapperLarge = mount(Button, {
      props: { size: 'large' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapperLarge.classes()).toContain('w-button--large')
  })

  it('plain / round / disabled / loading 应渲染对应状态类名', () => {
    const wrapper = mount(Button, {
      props: { plain: true, round: true, disabled: true, loading: true },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.classes()).toContain('is-plain')
    expect(wrapper.classes()).toContain('is-round')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.classes()).toContain('is-loading')
  })

  it('点击按钮应触发 click 事件', async () => {
    const wrapper = mount(Button, {
      slots: { default: '点击' },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('disabled 时按钮禁用且点击不触发事件', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: '禁用' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('loading 时按钮禁用、显示 loading 图标且点击不触发事件', async () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: '加载中' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.find('.w-button__loading').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('设置 icon 时应渲染图标组件', () => {
    const wrapper = mount(Button, {
      props: { icon: 'search' },
      slots: { default: '搜索' },
      global: { stubs: ['WIcon'] }
    })
    const icon = wrapper.findComponent({ name: 'WIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('search')
  })
})
