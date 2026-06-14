import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Radio from './radio.vue'

describe('Radio', () => {
  it('选中状态应高亮', () => {
    const wrapper = mount(Radio, {
      props: { modelValue: 'a', label: 'a' }
    })
    expect(wrapper.classes()).toContain('is-checked')
    expect(wrapper.find('input').element.checked).toBe(true)
  })

  it('未选中状态不高亮', () => {
    const wrapper = mount(Radio, {
      props: { modelValue: 'a', label: 'b' }
    })
    expect(wrapper.classes()).not.toContain('is-checked')
  })

  it('点击应切换选中并触发事件', async () => {
    const wrapper = mount(Radio, {
      props: { modelValue: 'a', label: 'b' }
    })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['b'])
    expect(wrapper.emitted('change')![0]).toEqual(['b'])
  })

  it('disabled 时不响应变更', async () => {
    const wrapper = mount(Radio, {
      props: { modelValue: 'a', label: 'b', disabled: true }
    })
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('name 属性应传递给 input', () => {
    const wrapper = mount(Radio, {
      props: { modelValue: 'a', label: 'a', name: 'group' }
    })
    expect(wrapper.find('input').attributes('name')).toBe('group')
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Radio, { props: { size: 'small' } })
    expect(wrapperSmall.classes()).toContain('w-radio--small')

    const wrapperLarge = mount(Radio, { props: { size: 'large' } })
    expect(wrapperLarge.classes()).toContain('w-radio--large')
  })
})
