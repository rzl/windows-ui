import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Popover from './popover.vue'

describe('Popover', () => {
  it('click 触发模式下点击触发元素应显示内容', async () => {
    const wrapper = mount(Popover, {
      props: { title: '标题', content: '弹出内容', trigger: 'click' },
      slots: { default: '<button>触发</button>' }
    })
    expect((wrapper.vm as any).open).toBe(false)
    await wrapper.find('button').trigger('click')
    expect((wrapper.vm as any).open).toBe(true)
    expect(wrapper.find('.w-popover__title').text()).toBe('标题')
    expect(wrapper.find('.w-popover__content').text()).toBe('弹出内容')
  })

  it('hover 触发模式下悬停应显示内容', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'hover 内容', trigger: 'hover' },
      slots: { default: '<button>触发</button>' }
    })
    await wrapper.find('.w-popover > div').trigger('mouseenter')
    expect((wrapper.vm as any).open).toBe(true)
    await wrapper.find('.w-popover > div').trigger('mouseleave')
    expect((wrapper.vm as any).open).toBe(false)
  })

  it('width 应设置弹窗宽度', () => {
    const wrapper = mount(Popover, {
      props: { content: '内容', width: 200 },
      slots: { default: '<button>触发</button>' }
    })
    ;(wrapper.vm as any).open = true
    expect((wrapper.find('.w-popover__popper').element as HTMLElement).style.width).toBe('200px')
  })
})
