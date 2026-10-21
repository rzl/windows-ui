import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive, nextTick } from 'vue'
import DynamicForm from './dynamic-form.vue'
import WCard from '../card/card.vue'
import WTabs from '../tabs/tabs.vue'
import WTabPane from '../tabs/tab-pane.vue'
import WAlert from '../alert/alert.vue'
import WStatistic from '../statistic/statistic.vue'
import type { PageNode } from '../page-designer/types'

function node(partial: Partial<PageNode> & { type: string }): PageNode {
  return { id: Math.random().toString(36).slice(2), props: {}, styles: {}, ...partial } as PageNode
}

function fieldNode(field: string, tab?: string): PageNode {
  return node({ type: 'form-field', props: { field }, tab })
}

function mountForm(props: any) {
  return mount(DynamicForm, {
    props,
    global: {
      components: { WCard, WTabs, WTabPane, WAlert, WStatistic },
      stubs: ['WSpace', 'WIcon']
    }
  })
}

describe('DynamicForm PageNode 布局（页面设计器渲染器桥接）', () => {
  it('form-field 节点应渲染对应字段', () => {
    const model = reactive({ name: '' })
    const wrapper = mountForm({
      model,
      fields: [{ prop: 'name', label: '姓名', type: 'input' as const }],
      layout: { components: [fieldNode('name')] }
    })
    expect(wrapper.findAll('.w-form-item').length).toBe(1)
    expect(wrapper.text()).toContain('姓名')
  })

  it('form-grid 应按 span 渲染栅格列数', () => {
    const model = reactive({ name: '', phone: '' })
    const wrapper = mountForm({
      model,
      fields: [
        { prop: 'name', label: '姓名', type: 'input' as const },
        { prop: 'phone', label: '手机号', type: 'input' as const }
      ],
      layout: {
        components: [node({ type: 'form-grid', props: { span: 2 }, children: [fieldNode('name'), fieldNode('phone')] })]
      }
    })
    const grid = wrapper.find('.w-dynamic-form__grid')
    expect(grid.exists()).toBe(true)
    expect(grid.attributes('style')).toContain('grid-template-columns: repeat(2, 1fr)')
    expect(grid.findAll('.w-form-item').length).toBe(2)
  })

  it('card 节点应渲染分组标题（页面设计器渲染器分支）', () => {
    const model = reactive({ name: '' })
    const wrapper = mountForm({
      model,
      fields: [{ prop: 'name', label: '姓名', type: 'input' as const }],
      layout: {
        components: [node({ type: 'card', props: { title: '基本信息' }, children: [fieldNode('name')] })]
      }
    })
    expect(wrapper.text()).toContain('基本信息')
    expect(wrapper.findAll('.w-form-item').length).toBe(1)
  })

  it('tabs 节点应只渲染激活标签页的字段', () => {
    const model = reactive({ name: '', phone: '' })
    const wrapper = mountForm({
      model,
      fields: [
        { prop: 'name', label: '姓名', type: 'input' as const },
        { prop: 'phone', label: '手机号', type: 'input' as const }
      ],
      layout: {
        components: [
          node({
            type: 'tabs',
            props: { tabs: [{ label: '基本', name: 'base' }, { label: '其他', name: 'other' }], modelValue: 'base' },
            children: [fieldNode('name', 'base'), fieldNode('phone', 'other')]
          })
        ]
      }
    })
    expect(wrapper.text()).toContain('基本')
    expect(wrapper.text()).toContain('其他')
    expect(wrapper.findAll('.w-form-item').length).toBe(1)
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).not.toContain('手机号')
  })

  it('form-subtable 应支持增删行', async () => {
    const model = reactive<{ items: any[] }>({ items: [] })
    const wrapper = mountForm({
      model,
      fields: [],
      layout: {
        components: [
          node({ type: 'form-subtable', props: { field: 'items', title: '明细', columns: [{ field: 'sku', label: 'SKU' }] } })
        ]
      }
    })
    expect(wrapper.text()).toContain('明细')
    const addBtn = wrapper.findAll('button').find((b) => b.text().includes('新增行'))
    expect(addBtn).toBeTruthy()
    await addBtn!.trigger('click')
    expect(model.items.length).toBe(1)
  })

  it('渲染器全部能力：内置展示组件应直接渲染', () => {
    const model = reactive({})
    const wrapper = mountForm({
      model,
      fields: [],
      layout: {
        components: [
          node({ type: 'text', props: { content: '请如实填写', tag: 'p' } }),
          node({ type: 'divider', props: { text: '分隔' } }),
          node({ type: 'image', props: { src: 'https://example.com/a.png', alt: '示例' } }),
          node({ type: 'alert', props: { content: '注意填写规范', type: 'warning' } }),
          node({ type: 'statistic', props: { title: '已提交份数' }, dataSource: { type: 'static', value: 8 } })
        ]
      }
    })
    expect(wrapper.text()).toContain('请如实填写')
    expect(wrapper.find('.render-divider').exists()).toBe(true)
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/a.png')
    expect(wrapper.text()).toContain('注意填写规范')
    expect(wrapper.text()).toContain('已提交份数')
    expect(wrapper.text()).toContain('8')
  })

  it('栅格内嵌套内置组件应正常渲染', () => {
    const model = reactive({ name: '' })
    const wrapper = mountForm({
      model,
      fields: [{ prop: 'name', label: '姓名', type: 'input' as const }],
      layout: {
        components: [
          node({
            type: 'form-grid',
            props: { span: 2 },
            children: [
              fieldNode('name'),
              node({ type: 'text', props: { content: '栅格内说明', tag: 'p' } })
            ]
          })
        ]
      }
    })
    const grid = wrapper.find('.w-dynamic-form__grid')
    expect(grid.findAll('.w-form-item').length).toBe(1)
    expect(grid.text()).toContain('栅格内说明')
  })

  it('未注册的插件类型应显示未知组件占位', () => {
    const model = reactive({ name: '' })
    const wrapper = mountForm({
      model,
      fields: [{ prop: 'name', label: '姓名', type: 'input' as const }],
      layout: {
        components: [fieldNode('name'), node({ type: 'definitely-unregistered' })]
      }
    })
    expect(wrapper.text()).toContain('未知组件')
    expect(wrapper.findAll('.w-form-item').length).toBe(1)
  })

  it('PageNode 布局下必填校验应生效', async () => {
    const model = reactive({ name: '' })
    const wrapper = mountForm({
      model,
      fields: [{ prop: 'name', label: '姓名', type: 'input' as const, required: true }],
      layout: { components: [fieldNode('name')] }
    })
    await nextTick()
    const valid = await (wrapper.vm as any).validate()
    expect(valid).toBe(false)
  })
})
