import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Affix from './affix.vue'

describe('Affix', () => {
  it('应渲染插槽内容', () => {
    const wrapper = mount(Affix, {
      slots: { default: '<div class="content">固钉内容</div>' }
    })
    expect(wrapper.find('.content').exists()).toBe(true)
    expect(wrapper.text()).toBe('固钉内容')
  })

  it('滚动超过元素位置时应切换 fixed 状态', async () => {
    const wrapper = mount(Affix, {
      props: { offset: 0 },
      attachTo: document.body
    })
    ;(wrapper.vm as any).rect = { top: 100, height: 40 } as DOMRect
    window.scrollY = 150
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).fixed).toBe(true)
  })
})
