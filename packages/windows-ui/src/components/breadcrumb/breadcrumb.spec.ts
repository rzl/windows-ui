import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumb from './breadcrumb.vue'

describe('Breadcrumb', () => {
  it('应渲染面包屑项', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { label: '首页', href: '/' },
          { label: '产品', href: '/product' },
          { label: '详情' }
        ]
      }
    })
    const items = wrapper.findAll('.w-breadcrumb__item')
    expect(items.length).toBe(3)
    expect(items[0].text()).toContain('首页')
    expect(items[2].text()).toContain('详情')
  })

  it('最后一项应标记为 is-last', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { label: '首页', href: '/' },
          { label: '详情' }
        ]
      }
    })
    const items = wrapper.findAll('.w-breadcrumb__item')
    expect(items[0].classes('is-last')).toBe(false)
    expect(items[1].classes('is-last')).toBe(true)
  })

  it('非最后一项有 href 时应渲染链接', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { label: '首页', href: '/' },
          { label: '详情' }
        ]
      }
    })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('/')
  })

  it('自定义分隔符', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { label: 'A' },
          { label: 'B' }
        ],
        separator: '/'
      }
    })
    expect(wrapper.find('.w-breadcrumb__separator').text()).toBe('/')
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Breadcrumb, {
      props: { size: 'small', items: [{ label: 'A' }] }
    })
    expect(wrapperSmall.classes()).toContain('w-breadcrumb--small')

    const wrapperLarge = mount(Breadcrumb, {
      props: { size: 'large', items: [{ label: 'A' }] }
    })
    expect(wrapperLarge.classes()).toContain('w-breadcrumb--large')
  })
})
