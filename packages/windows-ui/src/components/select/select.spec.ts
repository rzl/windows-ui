import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from './select.vue'

const options = [
  { label: '选项A', value: 'a' },
  { label: '选项B', value: 'b' },
  { label: '选项C', value: 'c' }
]

describe('Select', () => {
  it('默认显示占位文本', () => {
    const wrapper = mount(Select, {
      props: { options },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('.w-select__placeholder').text()).toBe('请选择')
  })

  it('根据 modelValue 显示对应 label', () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'b', options },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapper.find('.w-select__trigger').text()).toContain('选项B')
  })

  it('点击 trigger 展开/收起下拉列表', async () => {
    const wrapper = mount(Select, {
      props: { options },
      global: { stubs: ['WIcon'] }
    })
    expect((wrapper.vm as any).open).toBe(false)
    await wrapper.find('.w-select__trigger').trigger('click')
    expect((wrapper.vm as any).open).toBe(true)
    await wrapper.find('.w-select__trigger').trigger('click')
    expect((wrapper.vm as any).open).toBe(false)
  })

  it('点击选项应选中并触发事件', async () => {
    const wrapper = mount(Select, {
      props: { options },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('.w-select__trigger').trigger('click')
    const opts = wrapper.findAll('.w-select__option')
    expect(opts.length).toBe(3)
    await opts[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['b'])
    expect(wrapper.emitted('change')![0]).toEqual(['b'])
    expect(wrapper.find('.w-select__dropdown').isVisible()).toBe(false)
  })

  it('当前选中项应高亮', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'c', options },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('.w-select__trigger').trigger('click')
    const selected = wrapper.findAll('.w-select__option').find((o) => o.classes('is-selected'))
    expect(selected?.text()).toBe('选项C')
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Select, {
      props: { size: 'small', options },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapperSmall.classes()).toContain('w-select--small')

    const wrapperLarge = mount(Select, {
      props: { size: 'large', options },
      global: { stubs: ['WIcon'] }
    })
    expect(wrapperLarge.classes()).toContain('w-select--large')
  })

  it('点击清空按钮应清空选中值', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'a', options, clearable: true },
      global: { stubs: { WIcon: true } }
    })
    await wrapper.find('.w-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([undefined])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('点击外部应关闭下拉列表', async () => {
    const wrapper = mount(Select, {
      props: { options },
      attachTo: document.body,
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('.w-select__trigger').trigger('click')
    expect(wrapper.find('.w-select__dropdown').isVisible()).toBe(true)
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.w-select__dropdown').isVisible()).toBe(false)
    wrapper.unmount()
  })

  it('filterable 模式下 trigger 可输入并过滤选项', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('.w-select__trigger').trigger('click')
    const input = wrapper.find('.w-select__input')
    expect(input.exists()).toBe(true)
    await input.setValue('B')
    const opts = wrapper.findAll('.w-select__option')
    expect(opts.length).toBe(1)
    expect(opts[0].text()).toBe('选项B')
  })

  it('filterMethod 可自定义过滤规则', async () => {
    const filterMethod = (option: any, query: string) => {
      return String(option.value).toLowerCase().includes(query.toLowerCase())
    }
    const wrapper = mount(Select, {
      props: { options, filterable: true, filterMethod },
      global: { stubs: ['WIcon'] }
    })
    await wrapper.find('.w-select__trigger').trigger('click')
    const input = wrapper.find('.w-select__input')
    await input.setValue('c')
    const opts = wrapper.findAll('.w-select__option')
    expect(opts.length).toBe(1)
    expect(opts[0].text()).toBe('选项C')
  })
})
