import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Transfer from './transfer.vue'

describe('Transfer', () => {
  const data = [
    { key: 1, label: 'Item 1', disabled: false },
    { key: 2, label: 'Item 2', disabled: false },
    { key: 3, label: 'Item 3', disabled: true }
  ]

  it('应渲染左右两个面板', () => {
    const wrapper = mount(Transfer, {
      props: { data, modelValue: [] },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.findAll('.w-transfer__panel').length).toBe(2)
  })

  it('左侧显示未选中项，右侧显示已选中项', () => {
    const wrapper = mount(Transfer, {
      props: { data, modelValue: [1] },
      global: { stubs: ['WIcon'] }
    })
    const panels = wrapper.findAll('.w-transfer__panel')
    expect(panels[0].text()).toContain('Item 2')
    expect(panels[1].text()).toContain('Item 1')
  })

  it('点击向右按钮应移动选中项并更新 modelValue', async () => {
    const wrapper = mount(Transfer, {
      props: { data, modelValue: [] },
      global: { stubs: ['WIcon'] }
    })
    const leftCheckbox = wrapper.findAll('.w-transfer__panel')[0].find('.w-transfer__body input[type="checkbox"]')
    await leftCheckbox.setValue(true)
    await wrapper.findAll('.w-transfer__buttons button')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([[1]])
  })

  it('点击向左按钮应移除选中项并更新 modelValue', async () => {
    const wrapper = mount(Transfer, {
      props: { data, modelValue: [1, 2] },
      global: { stubs: ['WIcon'] }
    })
    const rightCheckbox = wrapper.findAll('.w-transfer__panel')[1].find('.w-transfer__body input[type="checkbox"]')
    await rightCheckbox.setValue(true)
    await wrapper.findAll('.w-transfer__buttons button')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([[2]])
  })

  it('自定义面板标题应生效', () => {
    const wrapper = mount(Transfer, {
      props: { data, modelValue: [], leftTitle: 'Source', rightTitle: 'Target' },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.text()).toContain('Source')
    expect(wrapper.text()).toContain('Target')
  })
})
