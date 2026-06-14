import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Dialog from './dialog.vue'

describe('Dialog', () => {
  it('modelValue 为 false 时不渲染弹窗', () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: false },
      global: { stubs: { teleport: true, WIcon: true, WButton: true } }
    })
    expect(wrapper.find('.w-dialog__wrapper').exists()).toBe(false)
  })

  it('modelValue 为 true 时渲染弹窗并显示标题', () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, title: '测试标题' },
      global: { stubs: { teleport: true, WIcon: true, WButton: true } }
    })
    expect(wrapper.find('.w-dialog__wrapper').exists()).toBe(true)
    expect(wrapper.find('.w-dialog__title').text()).toBe('测试标题')
  })

  it('点击关闭按钮应触发 update:modelValue 和 close', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true },
      global: { stubs: { teleport: true, WIcon: true, WButton: true } }
    })
    await wrapper.find('.w-dialog__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('点击遮罩应关闭弹窗', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, closeOnClickModal: true },
      global: { stubs: { teleport: true, WIcon: true, WButton: true } }
    })
    await wrapper.find('.w-dialog__wrapper').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('closeOnClickModal 为 false 时点击遮罩不关闭', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, closeOnClickModal: false },
      global: { stubs: { teleport: true, WIcon: true, WButton: true } }
    })
    await wrapper.find('.w-dialog__wrapper').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('点击确定按钮应触发 confirm 并关闭', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true },
      global: { stubs: { teleport: true, WIcon: true, WButton: true } }
    })
    ;(wrapper.vm as any).confirm()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('切换全屏状态应更新类名和样式', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, fullscreen: false },
      global: { stubs: { teleport: true, WIcon: true, WButton: true } }
    })
    expect(wrapper.find('.w-dialog').classes()).not.toContain('is-fullscreen')
    ;(wrapper.vm as any).toggleFullscreen()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.w-dialog').classes()).toContain('is-fullscreen')
  })

  it('默认插槽内容应渲染', () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true },
      slots: { default: '<p class="dialog-body">弹窗内容</p>' },
      global: { stubs: { teleport: true, WIcon: true, WButton: true } }
    })
    expect(wrapper.find('.dialog-body').text()).toBe('弹窗内容')
  })
})
