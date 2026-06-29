import { type Directive } from 'vue'

let globalHas: ((code: string) => boolean) | null = null

export function setPermissionChecker(has: (code: string) => boolean) {
  globalHas = has
}

export function clearPermissionChecker() {
  globalHas = null
}

function checkPermission(value: unknown): boolean {
  if (!value) return true
  const codes = Array.isArray(value) ? value : [value]
  if (!codes.length) return true
  if (globalHas) {
    return codes.some(code => globalHas!(String(code)))
  }
  return true
}

const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    if (!checkPermission(binding.value)) {
      el.style.display = 'none'
    }
  },
  updated(el, binding) {
    el.style.display = checkPermission(binding.value) ? '' : 'none'
  }
}

export default vPermission
