import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputTag from './input-tag.vue'

describe('InputTag', () => {
  it('应渲染已有标签', () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['a', 'b'] },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.text()).toContain('a')
    expect(wrapper.text()).toContain('b')
  })

  it('输入并回车应添加标签', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: [] },
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.find('input')
    await input.setValue('new')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['new']])
  })

  it('重复标签不应添加', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['a'] },
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.find('input')
    await input.setValue('a')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('max 限制标签数量', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['a'], max: 1 },
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.find('input')
    await input.setValue('b')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('回退键删除最后一个标签', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['a', 'b'] },
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.find('input')
    await input.setValue('')
    await input.trigger('keydown.backspace')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['a']])
  })

  it('清空按钮应清空所有标签', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['a', 'b'] },
      global: { stubs: { WIcon: true } }
    })
    await wrapper.find('.w-input-tag__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
