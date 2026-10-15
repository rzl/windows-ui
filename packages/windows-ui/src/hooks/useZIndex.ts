/**
 * 全局弹层层级管理器：弹层打开时通过 next() 取得一个单调递增的 z-index，
 * 保证后打开的弹层始终压在先打开的弹层之上。
 * 初始基准值可通过 setDefaultZIndex（或 WConfigProvider 的 zIndex 配置）调整。
 */
let defaultInitialZIndex = 2000
let currentZIndex = 0

export function nextZIndex(): number {
  currentZIndex++
  // 防止极端情况下溢出到 32 位整数上限
  if (defaultInitialZIndex + currentZIndex > 2147483000) currentZIndex = 0
  return defaultInitialZIndex + currentZIndex
}

export function getInitialZIndex(): number {
  return defaultInitialZIndex + currentZIndex
}

export function setDefaultZIndex(z: number): void {
  if (typeof z !== 'number' || Number.isNaN(z)) return
  defaultInitialZIndex = z
}

export function useZIndex() {
  return {
    initialZIndex: getInitialZIndex(),
    next: nextZIndex
  }
}
