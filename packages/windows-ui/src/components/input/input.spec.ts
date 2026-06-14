import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './input.vue'

describe('Input', () => {
  it('默认渲染文本输入框并显示绑定值', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'hello' },
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.element.value).toBe('hello')
    expect(input.attributes('type')).toBe('text')
  })

  it('根据 type 属性渲染对应输入类型', () => {
    const wrapper = mount(Input, {
      props: { type: 'password' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('placeholder 应传递给 input', () => {
    const wrapper = mount(Input, {
      props: { placeholder: '请输入' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入')
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Input, {
      props: { size: 'small' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapperSmall.classes()).toContain('w-input--small')

    const wrapperLarge = mount(Input, {
      props: { size: 'large' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapperLarge.classes()).toContain('w-input--large')
  })

  it('disabled 时应禁用输入并添加禁用类名', () => {
    const wrapper = mount(Input, {
      props: { disabled: true },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('readonly 时应设置 input readonly', () => {
    const wrapper = mount(Input, {
      props: { readonly: true },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('prefixIcon / suffixIcon 应渲染图标', () => {
    const wrapper = mount(Input, {
      props: { prefixIcon: 'search', suffixIcon: 'calendar' },
      global: { stubs: ['WIcon'] }
    })
    const icons = wrapper.findAllComponents({ name: 'WIcon' })
    const names = icons.map((icon) => icon.props('name'))
    expect(names).toContain('search')
    expect(names).toContain('calendar')
  })

  it('输入时应同步更新 modelValue 并触发 input 事件', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' },
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.find('input')
    await input.setValue('world')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['world'])
    expect(wrapper.emitted('input')![0]).toEqual(['world'])
  })

  it('聚焦和失焦应触发 focus / blur 事件', async () => {
    const wrapper = mount(Input, {
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('blur')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('有值且可清空时应显示清除按钮，点击后清空内容', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'abc', clearable: true },
      global: { stubs: { WIcon: true } }
    })
    expect(wrapper.find('.w-input__clear').exists()).toBe(true)
    await wrapper.find('.w-input__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
