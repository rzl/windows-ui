import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import vInfiniteScroll from './infinite-scroll'

describe('v-infinite-scroll directive', () => {
  it('滚动到底部时应触发 load 回调', async () => {
    const load = vi.fn()
    const wrapper = mount({
      template: `
        <div v-infinite-scroll="load" style="height:100px;overflow:auto;" data-testid="container">
          <div style="height:300px;">content</div>
        </div>
      `,
      directives: { 'infinite-scroll': vInfiniteScroll }
    }, { data: () => ({ load }) })

    const container = wrapper.find('[data-testid="container"]').element as HTMLElement
    container.scrollTop = 200
    await container.dispatchEvent(new Event('scroll'))
    expect(load).toHaveBeenCalled()
  })

  it('设置 infinite-scroll-disabled 后不应触发 load', async () => {
    const load = vi.fn()
    const wrapper = mount({
      template: `
        <div v-infinite-scroll="load" infinite-scroll-disabled="true" style="height:100px;overflow:auto;" data-testid="container">
          <div style="height:300px;">content</div>
        </div>
      `,
      directives: { 'infinite-scroll': vInfiniteScroll }
    }, { data: () => ({ load }) })

    const container = wrapper.find('[data-testid="container"]').element as HTMLElement
    container.scrollTop = 200
    await container.dispatchEvent(new Event('scroll'))
    expect(load).not.toHaveBeenCalled()
  })
})
