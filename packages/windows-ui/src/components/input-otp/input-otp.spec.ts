import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import InputOtp from './input-otp.vue'

describe('InputOtp', () => {
  it('应渲染指定数量的输入框', () => {
    const wrapper = mount(InputOtp, {
      props: { length: 4 },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.findAll('.w-input-otp__digit').length).toBe(4)
  })

  it('输入值应同步 modelValue', async () => {
    const wrapper = mount(InputOtp, {
      props: { length: 4 },
      global: { stubs: ['WIcon'] }
    })
    const inputs = wrapper.findAll('.w-input-otp__digit')
    await inputs[0].setValue('1')
    await inputs[1].setValue('2')
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['1'])
  })

  it('输入完整后触发 complete', async () => {
    const wrapper = mount(InputOtp, {
      props: { length: 3 },
      global: { stubs: ['WIcon'] }
    })
    const inputs = wrapper.findAll('.w-input-otp__digit')
    await inputs[0].setValue('1')
    await inputs[1].setValue('2')
    await inputs[2].setValue('3')
    await flushPromises()
    expect(wrapper.emitted('complete')![0]).toEqual(['123'])
  })

  it('modelValue 变化应回填到输入框', async () => {
    const wrapper = mount(InputOtp, {
      props: { modelValue: '654321', length: 6 },
      global: { stubs: ['WIcon'] }
    })
    await flushPromises()
    const inputs = wrapper.findAll('.w-input-otp__digit')
    expect((inputs[0].element as HTMLInputElement).value).toBe('6')
    expect((inputs[5].element as HTMLInputElement).value).toBe('1')
  })

  it('清空按钮应清空所有输入', async () => {
    const wrapper = mount(InputOtp, {
      props: { modelValue: '123456' },
      global: { stubs: { WIcon: true } }
    })
    await wrapper.find('.w-input-otp__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
