import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Slider from './slider.vue'

describe('Slider', () => {
  it('根据 modelValue 渲染滑块位置', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 50, min: 0, max: 100 }
    })
    const bar = wrapper.find('.w-slider__bar')
    expect((bar.element as HTMLElement).style.width).toBe('50%')
  })

  it('点击轨道应更新 modelValue', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 0, min: 0, max: 100 }
    })
    const track = wrapper.find('.w-slider__track')
    ;(track.element as HTMLElement).getBoundingClientRect = () => ({ left: 0, width: 100, top: 0, height: 4, right: 100, bottom: 4, x: 0, y: 0 } as DOMRect)
    await track.trigger('click', { clientX: 30 })
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('step 应限制取值为步长整数倍', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 0, min: 0, max: 100, step: 10 }
    })
    const track = wrapper.find('.w-slider__track')
    ;(track.element as HTMLElement).getBoundingClientRect = () => ({ left: 0, width: 100, top: 0, height: 4, right: 100, bottom: 4, x: 0, y: 0 } as DOMRect)
    await track.trigger('click', { clientX: 34 })
    const emitted = wrapper.emitted('update:modelValue')![0][0] as number
    expect(emitted % 10).toBe(0)
  })

  it('rangeMin / rangeMax 应限制可选范围', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 50, min: 0, max: 100, rangeMin: 20, rangeMax: 80 }
    })
    const track = wrapper.find('.w-slider__track')
    ;(track.element as HTMLElement).getBoundingClientRect = () => ({ left: 0, width: 100, top: 0, height: 4, right: 100, bottom: 4, x: 0, y: 0 } as DOMRect)
    await track.trigger('click', { clientX: 90 })
    const emitted = wrapper.emitted('update:modelValue')![0][0] as number
    expect(emitted).toBeLessThanOrEqual(80)
  })

  it('showStops 应渲染刻度', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 0, min: 0, max: 10, step: 2, showStops: true }
    })
    expect(wrapper.find('.w-slider__stops').exists()).toBe(true)
    expect(wrapper.findAll('.w-slider__stop-item').length).toBe(4)
  })

  it('showMinMax 应显示最小最大值', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 0, min: 0, max: 100, showMinMax: true }
    })
    expect(wrapper.find('.w-slider__limits').exists()).toBe(true)
    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('100')
  })

  it('disabled 时点击轨道不更新值', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 0, disabled: true }
    })
    const track = wrapper.find('.w-slider__track')
    await track.trigger('click', { clientX: 50 })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('根据 size 渲染对应尺寸类名', () => {
    const wrapperSmall = mount(Slider, { props: { size: 'small' } })
    expect(wrapperSmall.classes()).toContain('w-slider--small')

    const wrapperLarge = mount(Slider, { props: { size: 'large' } })
    expect(wrapperLarge.classes()).toContain('w-slider--large')
  })
})
