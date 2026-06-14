import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Drawer from './drawer.vue'

describe('Drawer', () => {
  it('modelValue 为 false 时不渲染', () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: false },
      global: { stubs: { teleport: true, WIcon: true } }
    })
    expect(wrapper.find('.w-drawer__wrapper').exists()).toBe(false)
  })

  it('modelValue 为 true 时渲染并显示标题', () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: true, title: '抽屉标题' },
      global: { stubs: { teleport: true, WIcon: true } }
    })
    expect(wrapper.find('.w-drawer__wrapper').exists()).toBe(true)
    expect(wrapper.find('.w-drawer__title').text()).toBe('抽屉标题')
  })

  it('点击关闭按钮应触发事件', async () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: true },
      global: { stubs: { teleport: true, WIcon: true } }
    })
    await wrapper.find('.w-drawer__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('点击遮罩应关闭', async () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: true, closeOnClickModal: true },
      global: { stubs: { teleport: true, WIcon: true } }
    })
    await wrapper.find('.w-drawer__wrapper').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('closeOnClickModal 为 false 时点击遮罩不关闭', async () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: true, closeOnClickModal: false },
      global: { stubs: { teleport: true, WIcon: true } }
    })
    await wrapper.find('.w-drawer__wrapper').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('不同 direction 应渲染对应类名', () => {
    const directions = ['left', 'right', 'top', 'bottom']
    for (const direction of directions) {
      const wrapper = mount(Drawer, {
        props: { modelValue: true, direction },
        global: { stubs: { teleport: true, WIcon: true } }
      })
      expect(wrapper.find('.w-drawer').classes()).toContain(`w-drawer--${direction}`)
    }
  })
})
