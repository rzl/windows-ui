import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Switch from './switch.vue'

describe('Switch', () => {
  it('默认未选中，点击后切换为选中', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false }
    })
    expect(wrapper.classes()).not.toContain('is-checked')
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(wrapper.emitted('change')![0]).toEqual([true])
  })

  it('checked 状态点击后切换为未选中', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true }
    })
    expect(wrapper.classes()).toContain('is-checked')
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('disabled 时不响应点击', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false, disabled: true }
    })
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Switch, { props: { size: 'small' } })
    expect(wrapperSmall.classes()).toContain('w-switch--small')

    const wrapperLarge = mount(Switch, { props: { size: 'large' } })
    expect(wrapperLarge.classes()).toContain('w-switch--large')
  })

  it('activeText / inactiveText 应正确显示', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true, activeText: '开', inactiveText: '关' }
    })
    expect(wrapper.text()).toBe('开')
  })
})
