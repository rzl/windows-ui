import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import vLoading from './loading'

describe('v-loading directive', () => {
  it('布尔 true 时应显示 loading 遮罩', async () => {
    const wrapper = mount({
      template: '<div v-loading="true" class="box">content</div>',
      directives: { loading: vLoading }
    })
    expect(wrapper.find('.w-loading').exists()).toBe(true)
  })

  it('布尔 false 时不应显示 loading 遮罩', () => {
    const wrapper = mount({
      template: '<div v-loading="false" class="box">content</div>',
      directives: { loading: vLoading }
    })
    expect(wrapper.find('.w-loading').exists()).toBe(false)
  })

  it('字符串值时应作为 text 显示', () => {
    const wrapper = mount({
      template: '<div v-loading="\'加载中...\'" class="box">content</div>',
      directives: { loading: vLoading }
    })
    expect(wrapper.find('.w-loading__text').text()).toBe('加载中...')
  })

  it('对象值时按 visible / text 渲染', async () => {
    const wrapper = mount({
      template: '<div v-loading="opt" class="box">content</div>',
      data() { return { opt: { visible: true, text: '请稍候' } } },
      directives: { loading: vLoading }
    })
    expect(wrapper.find('.w-loading__text').text()).toBe('请稍候')
    await wrapper.setData({ opt: { visible: false, text: '请稍候' } })
    expect(wrapper.find('.w-loading').exists()).toBe(false)
  })
})
