import { h, render, type Directive } from 'vue'
import WLoading from '../components/loading/loading.vue'

export interface LoadingBindingValue {
  visible?: boolean
  text?: string
}

const maskMap = new WeakMap<HTMLElement, HTMLDivElement>()

function resolveOptions(value: unknown): { visible: boolean; text: string } {
  if (typeof value === 'boolean') {
    return { visible: value, text: '' }
  }
  if (typeof value === 'string') {
    return { visible: true, text: value }
  }
  if (value && typeof value === 'object') {
    const opt = value as LoadingBindingValue
    return { visible: opt.visible !== false, text: opt.text || '' }
  }
  return { visible: false, text: '' }
}

function update(el: HTMLElement, value: unknown) {
  const mask = maskMap.get(el)
  if (!mask) return
  const { visible, text } = resolveOptions(value)
  render(h(WLoading, { visible, text }), mask)
}

const vLoading: Directive<HTMLElement, boolean | string | LoadingBindingValue> = {
  mounted(el, binding) {
    const computedStyle = window.getComputedStyle(el)
    if (computedStyle.position === 'static') {
      el.style.position = 'relative'
    }
    const mask = document.createElement('div')
    mask.className = 'w-loading-directive__mask'
    mask.style.cssText = 'position:absolute;inset:0;z-index:2000;overflow:hidden;'
    el.appendChild(mask)
    maskMap.set(el, mask)
    update(el, binding.value)
  },
  updated(el, binding) {
    update(el, binding.value)
  },
  unmounted(el) {
    const mask = maskMap.get(el)
    if (mask) {
      render(null, mask)
      mask.remove()
      maskMap.delete(el)
    }
  }
}

export default vLoading
