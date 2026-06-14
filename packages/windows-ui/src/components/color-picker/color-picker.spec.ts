import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorPicker from './color-picker.vue'

describe('ColorPicker', () => {
  it('应渲染颜色块和触发器', () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#ff0000' }
    })
    expect(wrapper.find('.w-color-picker__trigger').exists()).toBe(true)
    expect(wrapper.find('.w-color-picker__color').attributes('style')).toContain('rgb(255, 0, 0)')
  })

  it('点击触发器后展示面板', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#ff0000' }
    })
    await wrapper.find('.w-color-picker__trigger').trigger('click')
    expect((wrapper.vm as any).open).toBe(true)
    expect(wrapper.find('.w-color-picker__popper').exists()).toBe(true)
  })

  it('modelValue 变更应更新颜色块', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#00ff00' }
    })
    await wrapper.setProps({ modelValue: '#0000ff' })
    expect(wrapper.find('.w-color-picker__color').attributes('style')).toContain('rgb(0, 0, 255)')
  })

  it('颜色面板触发 change 后更新 modelValue', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#000000' }
    })
    await wrapper.find('.w-color-picker__trigger').trigger('click')
    await wrapper.findComponent({ name: 'WColorPickerPanel' }).vm.$emit('change', '#ffffff')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['#ffffff'])
    expect(wrapper.emitted('change')![0]).toEqual(['#ffffff'])
  })
})
