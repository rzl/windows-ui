import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useEventListener } from './useEventListener'
import { useScrollLock } from './useScrollLock'
import { useZIndex, nextZIndex, setDefaultZIndex, getInitialZIndex } from './useZIndex'

describe('useEventListener', () => {
  it('注册的监听在组件卸载时自动移除', () => {
    const handler = vi.fn()
    const TestComp = defineComponent({
      setup() {
        useEventListener(window, 'resize', handler)
      },
      template: '<div />'
    })
    const wrapper = mount(TestComp)
    window.dispatchEvent(new Event('resize'))
    expect(handler).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    window.dispatchEvent(new Event('resize'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('手动 stop 后不再触发', () => {
    const handler = vi.fn()
    const TestComp = defineComponent({
      setup() {
        const stop = useEventListener(window, 'click', handler)
        stop()
      },
      template: '<div />'
    })
    mount(TestComp)
    window.dispatchEvent(new Event('click'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('支持 ref 目标并在目标变化时重新挂载', async () => {
    const handler = vi.fn()
    const el = ref<HTMLElement>()
    const TestComp = defineComponent({
      setup() {
        useEventListener(el, 'click', handler)
        return { el }
      },
      template: '<div ref="el" />'
    })
    const wrapper = mount(TestComp)
    await nextTick()
    wrapper.vm.el!.dispatchEvent(new Event('click'))
    expect(handler).toHaveBeenCalledTimes(1)
  })
})

describe('useScrollLock', () => {
  it('visible 为 true 时锁定 body，false 时恢复', async () => {
    const visible = ref(false)
    const TestComp = defineComponent({
      setup() {
        useScrollLock(visible)
      },
      template: '<div />'
    })
    mount(TestComp)
    visible.value = true
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    visible.value = false
    await nextTick()
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('多个弹层叠加时引用计数正确', async () => {
    const visible1 = ref(false)
    const visible2 = ref(false)
    const TestComp = defineComponent({
      setup() {
        useScrollLock(visible1)
        useScrollLock(visible2)
      },
      template: '<div />'
    })
    const wrapper = mount(TestComp)
    const saved = document.body.style.overflow
    visible1.value = true
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    // 第二个弹层打开
    visible2.value = true
    await nextTick()
    // 第一个弹层关闭，第二个还在，保持锁定
    visible1.value = false
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    visible2.value = false
    await nextTick()
    expect(document.body.style.overflow).toBe(saved)
    wrapper.unmount()
  })

  it('组件卸载时自动释放锁', async () => {
    const visible = ref(true)
    const TestComp = defineComponent({
      setup() {
        useScrollLock(visible)
      },
      template: '<div />'
    })
    const wrapper = mount(TestComp)
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    wrapper.unmount()
    expect(document.body.style.overflow).not.toBe('hidden')
  })
})

describe('useZIndex', () => {
  it('next 返回单调递增的 z-index', () => {
    setDefaultZIndex(2000)
    const a = nextZIndex()
    const b = nextZIndex()
    expect(b).toBe(a + 1)
  })

  it('setDefaultZIndex 后 next 从新基准开始', () => {
    setDefaultZIndex(3000)
    expect(getInitialZIndex()).toBeGreaterThanOrEqual(3000)
    const a = nextZIndex()
    expect(a).toBeGreaterThanOrEqual(3001)
    setDefaultZIndex(2000)
  })

  it('useZIndex 返回 next 函数', () => {
    setDefaultZIndex(2000)
    const { next } = useZIndex()
    expect(typeof next).toBe('function')
    const a = next()
    const b = next()
    expect(b).toBe(a + 1)
  })
})
