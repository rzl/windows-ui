import { describe, it, expect } from 'vitest'
import { computeInsertIndex } from './usePageDragDrop'

describe('usePageDragDrop', () => {
  it('computeInsertIndex 应在节点中点前插入', () => {
    const rects = [
      { top: 0, height: 40 },
      { top: 40, height: 40 },
      { top: 80, height: 40 }
    ]
    expect(computeInsertIndex(10, rects)).toBe(0)
    expect(computeInsertIndex(30, rects)).toBe(1)
    expect(computeInsertIndex(70, rects)).toBe(2)
    expect(computeInsertIndex(130, rects)).toBe(3)
  })

  it('computeInsertIndex 空列表应返回 0', () => {
    expect(computeInsertIndex(0, [])).toBe(0)
  })
})
