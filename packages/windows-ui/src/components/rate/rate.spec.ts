import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Rate from './rate.vue'

describe('Rate', () => {
  it('默认渲染 5 个星星', () => {
    const wrapper = mount(Rate, {
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.findAll('.w-rate__item').length).toBe(5)
  })

  it('根据 modelValue 高亮对应星星', () => {
    const wrapper = mount(Rate, {
      props: { modelValue: 3 },
      global: { stubs: ['WIcon'] }
    })
    const items = wrapper.findAll('.w-rate__item')
    expect(items[0].classes('is-active')).toBe(true)
    expect(items[2].classes('is-active')).toBe(true)
    expect(items[3].classes('is-active')).toBe(false)
  })

  it('点击星星应更新 modelValue 并触发事件', async () => {
    const wrapper = mount(Rate, {
      global: { stubs: ['WIcon'] }
    })
    const items = wrapper.findAll('.w-rate__item')
    await items[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
    expect(wrapper.emitted('change')![0]).toEqual([3])
  })

  it('showScore 应显示当前分值', () => {
    const wrapper = mount(Rate, {
      props: { modelValue: 4, showScore: true },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('.w-rate__score').text()).toBe('4')
  })

  it('disabled 时点击不更新值', async () => {
    const wrapper = mount(Rate, {
      props: { modelValue: 2, disabled: true },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.classes()).toContain('is-disabled')
    await wrapper.findAll('.w-rate__item')[4].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Rate, { props: { size: 'small' }, global: { stubs: ['WIcon'] } })
    expect(wrapperSmall.classes()).toContain('w-rate--small')

    const wrapperLarge = mount(Rate, { props: { size: 'large' }, global: { stubs: ['WIcon'] } })
    expect(wrapperLarge.classes()).toContain('w-rate--large')
  })
})
