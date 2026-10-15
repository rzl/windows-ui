import type { Directive } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  _clickOutside?: (e: Event) => void
}

/**
 * 点击元素外部时触发回调：v-click-outside="() => close()"
 * 组件内部弹层（下拉、气泡等）统一使用本指令，替代各自重复的本地实现。
 */
const vClickOutside: Directive<ClickOutsideElement, (e: Event) => void> = {
  mounted(el, binding) {
    el._clickOutside = (e: Event) => {
      if (!el.contains(e.target as Node)) binding.value(e)
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside)
      delete el._clickOutside
    }
  }
}

export default vClickOutside
export { vClickOutside }
