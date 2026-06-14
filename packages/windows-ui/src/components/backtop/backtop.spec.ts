import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Backtop from './backtop.vue'

describe('Backtop', () => {
  it('默认不显示', () => {
    const wrapper = mount(Backtop, {
      global: { stubs: ['WIcon'] }
    })
    expect((wrapper.vm as any).visible).toBe(false)
  })

  it('滚动超过 visibilityHeight 后应显示', async () => {
    const wrapper = mount(Backtop, {
      props: { visibilityHeight: 200 },
      global: { stubs: ['WIcon'] }
    })
    window.scrollY = 250
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).visible).toBe(true)
  })

  it('点击应滚动到顶部', async () => {
    const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const wrapper = mount(Backtop, {
      props: { visibilityHeight: 0 },
      global: { stubs: ['WIcon'] }
    })
    window.scrollY = 300
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    await wrapper.find('.w-backtop').trigger('click')
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    scrollToMock.mockRestore()
  })
})
