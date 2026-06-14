import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Popconfirm from './popconfirm.vue'

describe('Popconfirm', () => {
  it('点击触发元素应显示确认弹窗', async () => {
    const wrapper = mount(Popconfirm, {
      slots: { default: '<button>删除</button>' },
      global: { stubs: ['WIcon', 'WButton'] }
    })
    expect((wrapper.vm as any).open).toBe(false)
    await wrapper.find('button').trigger('click')
    expect((wrapper.vm as any).open).toBe(true)
  })

  it('应渲染标题', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: '确认删除？' },
      slots: { default: '<button>删除</button>' },
      global: { stubs: ['WIcon', 'WButton'] }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('确认删除？')
  })

  it('点击确定应触发 confirm', async () => {
    const wrapper = mount(Popconfirm, {
      slots: { default: '<button>删除</button>' },
      global: { stubs: ['WIcon', 'WButton'] }
    })
    await wrapper.find('button').trigger('click')
    const buttons = wrapper.findAllComponents({ name: 'WButton' })
    await buttons[1].trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('点击取消应触发 cancel', async () => {
    const wrapper = mount(Popconfirm, {
      slots: { default: '<button>删除</button>' },
      global: { stubs: ['WIcon', 'WButton'] }
    })
    await wrapper.find('button').trigger('click')
    const buttons = wrapper.findAllComponents({ name: 'WButton' })
    await buttons[0].trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
