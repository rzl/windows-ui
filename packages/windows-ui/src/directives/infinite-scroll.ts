import { type Directive } from 'vue'

type LoadFn = () => void | Promise<void>

interface InfiniteScrollEl extends HTMLElement {
  _wInfiniteScrollHandler?: () => void
  _wInfiniteScrollLoading?: boolean
}

function getDistance(el: HTMLElement): number {
  const raw = el.getAttribute('infinite-scroll-distance')
  return raw ? Number(raw) : 0
}

function isDisabled(el: HTMLElement): boolean {
  return el.getAttribute('infinite-scroll-disabled') === 'true'
}

const vInfiniteScroll: Directive<InfiniteScrollEl, LoadFn> = {
  mounted(el, binding) {
    const load = binding.value
    if (typeof load !== 'function') return

    const handler = async () => {
      if ((el as InfiniteScrollEl)._wInfiniteScrollLoading || isDisabled(el)) return
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollHeight - scrollTop - clientHeight <= getDistance(el)) {
        ;(el as InfiniteScrollEl)._wInfiniteScrollLoading = true
        try {
          await load()
        } finally {
          ;(el as InfiniteScrollEl)._wInfiniteScrollLoading = false
        }
      }
    }

    ;(el as InfiniteScrollEl)._wInfiniteScrollHandler = handler
    el.addEventListener('scroll', handler)

    if (el.getAttribute('infinite-scroll-immediate') !== 'false') {
      handler()
    }
  },
  unmounted(el) {
    const handler = (el as InfiniteScrollEl)._wInfiniteScrollHandler
    if (handler) {
      el.removeEventListener('scroll', handler)
    }
  }
}

export default vInfiniteScroll
