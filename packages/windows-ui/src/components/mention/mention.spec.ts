import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WMention from './mention.vue'

describe('WMention', () => {
  it('应正常渲染', () => {
    const wrapper = mount(WMention, {
      props: {
        modelValue: '',
        options: [
          { label: '张三', value: 'zhangsan' },
          { label: '李四', value: 'lisi' }
        ]
      }
    })
    expect(wrapper.find('.w-mention').exists()).toBe(true)
  })
})
