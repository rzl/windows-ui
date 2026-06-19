import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WDescriptions from './descriptions.vue'
import WDescriptionsItem from './descriptions-item.vue'

describe('WDescriptions', () => {
  it('应渲染 items 传入的数据', () => {
    const wrapper = mount(WDescriptions, {
      props: {
        title: '用户信息',
        items: [
          { label: '姓名', value: '张三' },
          { label: '年龄', value: '28' }
        ]
      }
    })
    expect(wrapper.text()).toContain('用户信息')
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('年龄')
    expect(wrapper.text()).toContain('28')
  })

  it('应支持 w-descriptions-item 子组件形式', () => {
    const wrapper = mount({
      components: { WDescriptions, WDescriptionsItem },
      template: `
        <w-descriptions :column="2">
          <w-descriptions-item label="操作系统">Linux</w-descriptions-item>
          <w-descriptions-item label="架构">x64</w-descriptions-item>
          <w-descriptions-item label="主机名">server-01</w-descriptions-item>
        </w-descriptions>
      `
    })
    expect(wrapper.text()).toContain('操作系统')
    expect(wrapper.text()).toContain('Linux')
    expect(wrapper.text()).toContain('架构')
    expect(wrapper.text()).toContain('x64')
    expect(wrapper.text()).toContain('主机名')
    expect(wrapper.text()).toContain('server-01')
  })

  it('应按 column 属性换行', () => {
    const wrapper = mount({
      components: { WDescriptions, WDescriptionsItem },
      template: `
        <w-descriptions :column="1">
          <w-descriptions-item label="A">1</w-descriptions-item>
          <w-descriptions-item label="B">2</w-descriptions-item>
        </w-descriptions>
      `
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
  })

  it('items 为空且没有子组件时不应渲染表格行', () => {
    const wrapper = mount(WDescriptions)
    expect(wrapper.findAll('tbody tr').length).toBe(0)
  })
})
