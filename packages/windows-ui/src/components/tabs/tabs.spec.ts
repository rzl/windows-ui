import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tabs from './tabs.vue'

describe('Tabs', () => {
  it('应渲染标签项和插槽内容', () => {
    const wrapper = mount(Tabs, {
      props: { tabs: [{ label: 'Tab1' }, { label: 'Tab2', icon: 'user' }] },
      slots: { default: '<div>内容</div>' },
      global: { stubs: ['WIcon'] }
    })
    const items = wrapper.findAll('.w-tabs__item')
    expect(items.length).toBe(2)
    expect(items[0].text()).toContain('Tab1')
    expect(items[1].text()).toContain('Tab2')
    expect(wrapper.find('.w-tabs__content').text()).toBe('内容')
  })

  it('默认激活第一项', () => {
    const wrapper = mount(Tabs, {
      props: { tabs: [{ label: 'A' }, { label: 'B' }] },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.findAll('.w-tabs__item')[0].classes('is-active')).toBe(true)
  })

  it('点击标签切换并触发事件', async () => {
    const wrapper = mount(Tabs, {
      props: { tabs: [{ label: 'A' }, { label: 'B' }], modelValue: 0 },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.findAll('.w-tabs__item')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([1])
    expect(wrapper.emitted('change')![0]).toEqual([1])
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Tabs, {
      props: { size: 'small', tabs: [{ label: 'A' }] },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapperSmall.classes()).toContain('w-tabs--small')

    const wrapperLarge = mount(Tabs, {
      props: { size: 'large', tabs: [{ label: 'A' }] },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapperLarge.classes()).toContain('w-tabs--large')
  })
})
