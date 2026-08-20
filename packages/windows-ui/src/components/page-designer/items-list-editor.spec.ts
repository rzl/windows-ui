import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemsListEditor from './items-list-editor.vue'

function createWrapper(props: any) {
  return mount(ItemsListEditor, {
    props,
    global: {
      stubs: {
        'w-input': {
          props: ['modelValue', 'size'],
          emits: ['update:modelValue'],
          template: '<input class="input-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
        },
        'w-input-number': {
          props: ['modelValue', 'size'],
          emits: ['update:modelValue'],
          template: '<input type="number" class="input-number-stub" :value="modelValue" @input="$emit(\'update:modelValue\', Number($event.target.value))" />'
        },
        'w-button': {
          props: ['type', 'size', 'icon', 'title'],
          emits: ['click'],
          template: '<button class="button-stub" :title="title" @click="$emit(\'click\', $event)"><slot /></button>'
        }
      }
    }
  })
}

describe('WItemsListEditor', () => {
  const columns = [
    { key: 'label', label: '标签名' },
    { key: 'name', label: '标识' }
  ]

  it('应渲染表头与数据行', () => {
    const wrapper = createWrapper({
      modelValue: [
        { label: '标签1', name: 'tab1' },
        { label: '标签2', name: 'tab2' }
      ],
      columns
    })
    expect(wrapper.text()).toContain('标签名')
    expect(wrapper.text()).toContain('标识')
    expect(wrapper.findAll('tbody tr').length).toBe(2)
  })

  it('修改单元格应更新对应数据', async () => {
    const wrapper = createWrapper({
      modelValue: [{ label: '标签1', name: 'tab1' }],
      columns
    })
    const input = wrapper.find('.input-stub')
    await input.setValue('新标签')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([[{ label: '新标签', name: 'tab1' }]])
  })

  it('点击添加按钮应追加一行', async () => {
    const wrapper = createWrapper({
      modelValue: [{ label: '标签1', name: 'tab1' }],
      columns
    })
    const addBtn = wrapper.findAll('.button-stub').find((el) => el.text().includes('添加标签'))
    expect(addBtn).toBeDefined()
    await addBtn!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    const emitted = (wrapper.emitted('update:modelValue')![0] as any[])[0]
    expect(emitted.length).toBe(2)
    expect(emitted[1].name).toBe('tab2')
  })

  it('点击删除按钮应移除对应行', async () => {
    const wrapper = createWrapper({
      modelValue: [
        { label: '标签1', name: 'tab1' },
        { label: '标签2', name: 'tab2' }
      ],
      columns
    })
    const deleteBtns = wrapper.findAll('tbody tr').map((row) => row.findAll('.button-stub').find((el) => el.attributes('title') === '删除'))
    expect(deleteBtns[0]).toBeDefined()
    await deleteBtns[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    const emitted = (wrapper.emitted('update:modelValue')![0] as any[])[0]
    expect(emitted.length).toBe(1)
    expect(emitted[0].name).toBe('tab2')
  })

  it('点击上移/下移按钮应调整顺序', async () => {
    const wrapper = createWrapper({
      modelValue: [
        { label: '标签1', name: 'tab1' },
        { label: '标签2', name: 'tab2' }
      ],
      columns
    })
    const rows = wrapper.findAll('tbody tr')
    const downBtn = rows[0].findAll('.button-stub').find((el) => el.attributes('title') === '下移')
    await downBtn!.trigger('click')
    let emitted = (wrapper.emitted('update:modelValue')![0] as any[])[0]
    expect(emitted[0].name).toBe('tab2')
    expect(emitted[1].name).toBe('tab1')

    await wrapper.setProps({ modelValue: emitted })
    const rowsAfterDown = wrapper.findAll('tbody tr')
    const upBtn = rowsAfterDown[1].findAll('.button-stub').find((el) => el.attributes('title') === '上移')
    await upBtn!.trigger('click')
    emitted = (wrapper.emitted('update:modelValue')![1] as any[])[0]
    expect(emitted[0].name).toBe('tab1')
    expect(emitted[1].name).toBe('tab2')
  })

  it('name 为空或重复时应显示错误提示', async () => {
    const wrapper = createWrapper({
      modelValue: [
        { label: '标签1', name: 'tab1' },
        { label: '标签2', name: 'tab1' }
      ],
      columns
    })
    expect(wrapper.find('.items-error').exists()).toBe(true)
    expect(wrapper.text()).toContain('标识重复')

    const nameInput = wrapper.findAll('tbody tr')[0].findAll('.input-stub')[1]
    await nameInput.setValue('')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    await wrapper.setProps({
      modelValue: [
        { label: '标签1', name: '' },
        { label: '标签2', name: 'tab1' }
      ]
    })
    expect(wrapper.text()).toContain('标识不能为空')
  })
})
