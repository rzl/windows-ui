import { describe, it, expect, vi } from 'vitest'
import { usePageHistory } from './usePageHistory'

describe('usePageHistory', () => {
  it('初始为空时应无法撤销重做', () => {
    const history = usePageHistory<{ value: number }>()
    expect(history.canUndo.value).toBe(false)
    expect(history.canRedo.value).toBe(false)
  })

  it('init 后应能撤销到初始状态', () => {
    const onRestore = vi.fn()
    const history = usePageHistory<{ value: number }>({ onRestore })
    history.init({ value: 1 })
    expect(history.canUndo.value).toBe(false)

    history.record({ value: 2 })
    expect(history.canUndo.value).toBe(true)

    history.undo()
    expect(onRestore).toHaveBeenCalledWith({ value: 1 })
    expect(history.canRedo.value).toBe(true)
  })

  it('重做应恢复到最新状态', () => {
    const onRestore = vi.fn()
    const history = usePageHistory<{ value: number }>({ onRestore })
    history.init({ value: 1 })
    history.record({ value: 2 })
    history.undo()

    history.redo()
    expect(onRestore).toHaveBeenLastCalledWith({ value: 2 })
    expect(history.canRedo.value).toBe(false)
  })

  it('新记录应丢弃重做栈', () => {
    const history = usePageHistory<{ value: number }>()
    history.init({ value: 1 })
    history.record({ value: 2 })
    history.undo()
    expect(history.canRedo.value).toBe(true)

    history.record({ value: 3 })
    expect(history.canRedo.value).toBe(false)
  })

  it('超出最大长度时应移除最旧记录', () => {
    const onRestore = vi.fn()
    const history = usePageHistory<{ value: number }>({ maxLength: 3, onRestore })
    history.init({ value: 1 })
    history.record({ value: 2 })
    history.record({ value: 3 })
    history.record({ value: 4 })

    history.undo()
    history.undo()
    history.undo()
    expect(onRestore).toHaveBeenLastCalledWith({ value: 2 })
  })

  it('restore 时不应触发新记录', () => {
    const history = usePageHistory<{ value: number }>()
    history.init({ value: 1 })
    history.record({ value: 2 })

    const before = history.stack.value.length
    history.undo()
    expect(history.stack.value.length).toBe(before)
  })
})
