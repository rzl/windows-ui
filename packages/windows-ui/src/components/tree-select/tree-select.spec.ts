import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeSelect from './tree-select.vue'

const treeData = [
  {
    label: '父节点1',
    value: '1',
    children: [
      { label: '子节点1-1', value: '1-1' }
    ]
  },
  { label: '叶子节点2', value: '2' }
]

describe('TreeSelect', () => {
  it('默认显示占位文本', () => {
    const wrapper = mount(TreeSelect, {
      props: { data: treeData },
      global: { stubs: ['WIcon', 'WTree'] }
    })
    expect(wrapper.find('.w-tree-select__placeholder').text()).toBe('请选择')
  })

  it('根据 modelValue 显示对应 label', () => {
    const wrapper = mount(TreeSelect, {
      props: { data: treeData, modelValue: '1-1' },
      global: { stubs: ['WIcon', 'WTree'] }
    })
    expect(wrapper.find('.w-tree-select__trigger').text()).toContain('子节点1-1')
  })

  it('点击 trigger 应切换下拉显示状态', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: treeData },
      global: { stubs: ['WIcon', 'WTree'] }
    })
    expect((wrapper.vm as any).open).toBe(false)
    await wrapper.find('.w-tree-select__trigger').trigger('click')
    expect((wrapper.vm as any).open).toBe(true)
  })

  it('选择树节点后应同步 modelValue 并关闭下拉', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: treeData },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('.w-tree-select__trigger').trigger('click')
    await wrapper.findComponent({ name: 'WTree' }).vm.$emit('node-click', { label: '子节点1-1', value: '1-1' })
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['1-1'])
    expect(wrapper.emitted('change')![0]).toEqual(['1-1'])
    expect((wrapper.vm as any).open).toBe(false)
  })

  it('清空按钮应清空选中值', async () => {
    const wrapper = mount(TreeSelect, {
      props: { data: treeData, modelValue: '2' },
      global: { stubs: { WIcon: true, WTree: true } }
    })
    await wrapper.find('.w-tree-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([undefined])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
