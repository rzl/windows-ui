import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from './checkbox.vue'

describe('Checkbox', () => {
  it('布尔值模式：勾选与取消勾选', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false, label: '同意' }
    })
    expect(wrapper.classes()).not.toContain('is-checked')
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(wrapper.emitted('change')![0]).toEqual([true])
  })

  it('数组模式：勾选后添加 label，取消后移除', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: ['a'], label: 'b' }
    })
    expect(wrapper.classes()).not.toContain('is-checked')
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['a', 'b']])
    await wrapper.find('input').setValue(false)
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([['a']])
  })

  it('数组模式下已选中应高亮', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: ['x'], label: 'x' }
    })
    expect(wrapper.classes()).toContain('is-checked')
  })

  it('indeterminate 状态应渲染半选样式', () => {
    const wrapper = mount(Checkbox, {
      props: { indeterminate: true }
    })
    expect(wrapper.classes()).toContain('is-indeterminate')
  })

  it('disabled 时不响应变更', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false, disabled: true }
    })
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Checkbox, { props: { size: 'small' } })
    expect(wrapperSmall.classes()).toContain('w-checkbox--small')

    const wrapperLarge = mount(Checkbox, { props: { size: 'large' } })
    expect(wrapperLarge.classes()).toContain('w-checkbox--large')
  })
})
