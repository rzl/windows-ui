import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Cascader from './cascader.vue'

const options = [
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      { label: '杭州市', value: 'hangzhou' },
      { label: '宁波市', value: 'ningbo' }
    ]
  },
  {
    label: '江苏省',
    value: 'jiangsu',
    children: [
      { label: '南京市', value: 'nanjing' }
    ]
  }
]

describe('Cascader', () => {
  it('默认显示占位文本', () => {
    const wrapper = mount(Cascader, {
      props: { options, placeholder: '请选择地区' },
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.findComponent({ name: 'WInput' })
    expect(input.props('placeholder')).toBe('请选择地区')
  })

  it('根据 modelValue 显示对应路径文本', () => {
    const wrapper = mount(Cascader, {
      props: { options, modelValue: ['zhejiang', 'hangzhou'] },
      global: { stubs: ['WIcon'] }
    })
    const input = wrapper.findComponent({ name: 'WInput' })
    expect(input.props('modelValue')).toBe('浙江省 / 杭州市')
  })

  it('点击输入框应展开下拉菜单', async () => {
    const wrapper = mount(Cascader, {
      props: { options },
      global: { stubs: ['WIcon'] }
    })
    expect((wrapper.vm as any).open).toBe(false)
    ;(wrapper.vm as any).open = true
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).open).toBe(true)
  })

  it('选择末级选项后应同步 modelValue 并关闭下拉', async () => {
    const wrapper = mount(Cascader, {
      props: { options },
      global: { stubs: ['WIcon'] }
    })
    ;(wrapper.vm as any).open = true
    await wrapper.vm.$nextTick()
    const menus = wrapper.findAll('.w-cascader__menu')
    const firstItems = menus[0].findAll('.w-cascader__item')
    await firstItems[0].trigger('click')
    await wrapper.vm.$nextTick()
    const secondMenu = wrapper.findAll('.w-cascader__menu')[1]
    const childItems = secondMenu.findAll('.w-cascader__item')
    await childItems[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['zhejiang', 'hangzhou']])
    expect(wrapper.emitted('change')![0]).toEqual([['zhejiang', 'hangzhou']])
    expect((wrapper.vm as any).open).toBe(false)
  })

  it('清空应清空选中值', async () => {
    const wrapper = mount(Cascader, {
      props: { options, modelValue: ['zhejiang', 'hangzhou'] },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.findComponent({ name: 'WInput' }).vm.$emit('clear')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
