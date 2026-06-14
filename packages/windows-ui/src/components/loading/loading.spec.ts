import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Loading from './loading.vue'

describe('Loading', () => {
  it('visible 为 false 时不渲染', () => {
    const wrapper = mount(Loading, {
      props: { visible: false }
    })
    expect(wrapper.find('.w-loading').exists()).toBe(false)
  })

  it('visible 为 true 时渲染加载动画', () => {
    const wrapper = mount(Loading, {
      props: { visible: true }
    })
    expect(wrapper.find('.w-loading').exists()).toBe(true)
    expect(wrapper.findAll('.w-loading__dot').length).toBe(8)
  })

  it('应显示加载文本', () => {
    const wrapper = mount(Loading, {
      props: { visible: true, text: '加载中...' }
    })
    expect(wrapper.find('.w-loading__text').text()).toBe('加载中...')
  })
})
