import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputNumber from './input-number.vue'

describe('InputNumber', () => {
  it('应渲染输入框和增减按钮', () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 5 },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('input').element.value).toBe('5')
    expect(wrapper.find('.w-input-number__decrease').exists()).toBe(true)
    expect(wrapper.find('.w-input-number__increase').exists()).toBe(true)
  })

  it('点击增加按钮应增加步进值', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 5 },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('.w-input-number__increase').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([6])
    expect(wrapper.emitted('change')![0]).toEqual([6])
  })

  it('点击减少按钮应减少步进值', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 5 },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('.w-input-number__decrease').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([4])
  })

  it('输入值应受 min / max 限制', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 5, min: 0, max: 10 },
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.find('input')
    await input.setValue('15')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([10])
    await input.setValue('-3')
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([0])
  })

  it('disabled 时不应触发变化', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 5, disabled: true },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('.w-input-number__increase').trigger('click')
    await wrapper.find('input').setValue('10')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('清空按钮应清空值并触发 clear 事件', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 5, clearable: true },
      global: { stubs: { WIcon: true } }
    })
    await wrapper.find('.w-input-number__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([undefined])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
