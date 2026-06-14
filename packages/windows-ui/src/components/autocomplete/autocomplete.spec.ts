import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Autocomplete from './autocomplete.vue'

describe('Autocomplete', () => {
  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' }
  ]

  it('应渲染输入框', () => {
    const wrapper = mount(Autocomplete, {
      props: { modelValue: '' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('聚焦时展示候选列表', async () => {
    const wrapper = mount(Autocomplete, {
      props: { modelValue: '', options },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.w-autocomplete__suggestions').exists()).toBe(true)
    expect(wrapper.findAll('.w-autocomplete__item').length).toBe(3)
  })

  it('输入时过滤候选列表', async () => {
    const wrapper = mount(Autocomplete, {
      props: { modelValue: '', options },
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.find('input')
    await input.setValue('a')
    await flushPromises()
    expect(wrapper.findAll('.w-autocomplete__item').length).toBe(2)
    expect(wrapper.text()).toContain('Apple')
    expect(wrapper.text()).toContain('Banana')
  })

  it('选择建议后更新 modelValue 并触发 select', async () => {
    const wrapper = mount(Autocomplete, {
      props: { modelValue: '', options },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('input').trigger('focus')
    await wrapper.findAll('.w-autocomplete__item')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['apple'])
    expect(wrapper.emitted('select')![0]).toEqual([{ label: 'Apple', value: 'apple' }])
  })

  it('无匹配建议时列表项为空', async () => {
    const wrapper = mount(Autocomplete, {
      props: { modelValue: '', options },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('input').setValue('xyz')
    await flushPromises()
    expect(wrapper.findAll('.w-autocomplete__item').length).toBe(0)
  })

  it('disabled 时应禁用输入', () => {
    const wrapper = mount(Autocomplete, {
      props: { modelValue: '', disabled: true },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('clear 按钮应清空值', async () => {
    const wrapper = mount(Autocomplete, {
      props: { modelValue: 'hello', clearable: true },
      global: { stubs: { WIcon: true } }
    })
    await wrapper.find('.w-input__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
