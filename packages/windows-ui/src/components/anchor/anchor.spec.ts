import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Anchor from './anchor.vue'

describe('Anchor', () => {
  it('应渲染锚点链接', () => {
    const wrapper = mount(Anchor, {
      props: {
        links: [
          { href: '#section1', title: '章节1' },
          { href: '#section2', title: '章节2', level: 2 }
        ]
      }
    })
    const links = wrapper.findAll('.w-anchor__link')
    expect(links.length).toBe(2)
    expect(links[0].text()).toBe('章节1')
    expect(links[1].text()).toBe('章节2')
    expect((links[1].element as HTMLElement).style.paddingLeft).toBe('24px')
  })

  it('点击锚点链接应调用 scrollIntoView', async () => {
    const mockScroll = vi.fn()
    const mockRect = { top: 100 } as DOMRect
    document.querySelector = () => ({ scrollIntoView: mockScroll, getBoundingClientRect: () => mockRect }) as any

    const wrapper = mount(Anchor, {
      props: {
        links: [{ href: '#section1', title: '章节1' }]
      }
    })
    await wrapper.find('.w-anchor__link').trigger('click')
    expect(mockScroll).toHaveBeenCalledWith({ behavior: 'smooth' })
  })
})
