import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from './alert.vue'

describe('Alert', () => {
  it('应渲染标题和描述', () => {
    const wrapper = mount(Alert, {
      props: { title: '提示', description: '这是一条提示' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('.w-alert__title').text()).toBe('提示')
    expect(wrapper.find('.w-alert__description').text()).toBe('这是一条提示')
  })

  it('不同 type 应渲染对应类名', () => {
    const types = ['info', 'success', 'warning', 'error']
    for (const type of types) {
      const wrapper = mount(Alert, {
        props: { type },
        global: { stubs: ['WIcon'] }
      })
      expect(wrapper.classes()).toContain(`w-alert--${type}`)
    }
  })

  it('closable 时应显示关闭按钮并触发 close', async () => {
    const wrapper = mount(Alert, {
      props: { closable: true },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('.w-alert__close').exists()).toBe(true)
    await wrapper.find('.w-alert__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('center 时应添加居中类名', () => {
    const wrapper = mount(Alert, {
      props: { center: true },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.classes()).toContain('is-center')
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Alert, { props: { size: 'small' }, global: { stubs: ['WIcon'] } })
    expect(wrapperSmall.classes()).toContain('w-alert--small')

    const wrapperLarge = mount(Alert, { props: { size: 'large' }, global: { stubs: ['WIcon'] } })
    expect(wrapperLarge.classes()).toContain('w-alert--large')
  })

  it('title 插槽应覆盖默认 title', () => {
    const wrapper = mount(Alert, {
      props: { title: '默认' },
      slots: { title: '<span class="custom-title">自定义标题</span>' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.w-alert__title').text()).toBe('自定义标题')
  })
})
