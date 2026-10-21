import { describe, it, expect, beforeEach } from 'vitest'
import type { FormLayout } from '@windows-ui/core'
import { setFormLayoutDesignContext } from './context'
import { formLayoutToComponents } from './convert'

beforeEach(() => {
  setFormLayoutDesignContext({
    formFields: [
      { field: 'name', label: '姓名', type: 'input', required: true },
      { field: 'phone', label: '手机号', type: 'input', required: false },
      { field: 'memo', label: '备注', type: 'textarea', required: false }
    ],
    models: [{ label: '订单', value: 'order' }]
  })
})

describe('formLayoutToComponents（旧布局迁移）', () => {
  it('无布局时应生成默认两列栅格并包含全部表单字段', () => {
    const components = formLayoutToComponents(undefined)
    expect(components).toHaveLength(1)
    const grid = components[0]
    expect(grid.type).toBe('form-grid')
    expect(grid.props.span).toBe(2)
    expect(grid.children).toHaveLength(3)
    expect(grid.children!.map((c) => c.props.field)).toEqual(['name', 'phone', 'memo'])
    expect(grid.children!.every((c) => c.type === 'form-field')).toBe(true)
  })

  it('字符串叶子应转换为 form-field 节点', () => {
    const layout: FormLayout = { type: 'root', children: ['name', 'phone'] }
    const components = formLayoutToComponents(layout)
    expect(components.map((c) => c.type)).toEqual(['form-field', 'form-field'])
    expect(components[0].props.field).toBe('name')
  })

  it('fieldset 应转换为 card 并保留标题与子节点', () => {
    const layout: FormLayout = {
      type: 'root',
      children: [{ type: 'fieldset', title: '基本信息', children: ['name'] }]
    }
    const components = formLayoutToComponents(layout)
    expect(components[0].type).toBe('card')
    expect(components[0].props.title).toBe('基本信息')
    expect(components[0].children![0].props.field).toBe('name')
  })

  it('tabs 应转换为 tabs 节点并通过 tab 属性关联子节点', () => {
    const layout: FormLayout = {
      type: 'root',
      children: [{
        type: 'tabs',
        tabs: [
          { title: '基本信息', name: 'base', children: ['name'] },
          { title: '其他信息', name: 'other', children: ['phone'] }
        ]
      }]
    }
    const components = formLayoutToComponents(layout)
    const tabsNode = components[0]
    expect(tabsNode.type).toBe('tabs')
    expect(tabsNode.props.tabs).toEqual([
      { label: '基本信息', name: 'base' },
      { label: '其他信息', name: 'other' }
    ])
    expect(tabsNode.children).toHaveLength(2)
    const base = tabsNode.children!.find((c) => c.tab === 'base')!
    const other = tabsNode.children!.find((c) => c.tab === 'other')!
    expect(base.props.field).toBe('name')
    expect(other.props.field).toBe('phone')
  })

  it('grid 应保留列数 span', () => {
    const layout: FormLayout = { type: 'root', children: [{ type: 'grid', span: 3, children: ['name'] }] }
    const components = formLayoutToComponents(layout)
    expect(components[0].type).toBe('form-grid')
    expect(components[0].props.span).toBe(3)
  })

  it('subtable 应完整转换子表属性', () => {
    const layout: FormLayout = {
      type: 'root',
      children: [{
        type: 'subtable',
        field: 'items',
        title: '订单明细',
        columns: [{ field: 'sku', label: 'SKU', width: 120 }],
        subModelCode: 'order_item',
        foreignField: 'order_id',
        localField: 'id'
      }]
    }
    const components = formLayoutToComponents(layout)
    const node = components[0]
    expect(node.type).toBe('form-subtable')
    expect(node.props).toEqual({
      field: 'items',
      title: '订单明细',
      columns: [{ field: 'sku', label: 'SKU', width: 120 }],
      subModelCode: 'order_item',
      foreignField: 'order_id',
      localField: 'id'
    })
  })
})
