import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from './tooltip.vue'

describe('Tooltip', () => {
  it('悬停触发元素应显示提示内容', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示文字' },
      slots: { default: '<button>按钮</button>' }
    })
    expect((wrapper.vm as any).open).toBe(false)
    await wrapper.find('.w-tooltip > div').trigger('mouseenter')
    expect((wrapper.vm as any).open).toBe(true)
    expect(wrapper.find('.w-tooltip__popper').text()).toBe('提示文字')
  })

  it('点击触发元素应切换提示显示', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示' },
      slots: { default: '<button>按钮</button>' }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.w-tooltip__popper').isVisible()).toBe(true)
    await wrapper.find('button').trigger('click')
    expect((wrapper.vm as any).open).toBe(false)
  })
})
