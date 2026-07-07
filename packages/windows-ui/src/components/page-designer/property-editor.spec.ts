import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PropertyEditor from './property-editor.vue'

function createWrapper(node: any) {
  return mount(PropertyEditor, {
    props: { node },
    global: {
      stubs: {
        'w-form': {
          name: 'WFormStub',
          props: ['size', 'labelWidth'],
          template: '<form class="form-stub"><slot /></form>'
        },
        'w-form-item': {
          props: ['label', 'size'],
          template: '<div class="form-item-stub"><label v-if="label">{{ label }}</label><slot /></div>'
        },
        'w-input': {
          props: ['modelValue', 'placeholder', 'size'],
          emits: ['update:modelValue'],
          template: '<input class="input-stub" :value="modelValue" :placeholder="placeholder" @input="$emit(\'update:modelValue\', $event.target.value)" />'
        },
        'w-select': {
          props: ['modelValue', 'options', 'size'],
          emits: ['update:modelValue'],
          template: '<select class="select-stub" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select>'
        },
        'w-color-picker': {
          props: ['modelValue', 'size'],
          emits: ['update:modelValue'],
          template: '<input class="color-picker-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
        },
        'w-input-number': {
          props: ['modelValue', 'size'],
          emits: ['update:modelValue'],
          template: '<input type="number" class="input-number-stub" :value="modelValue" @input="$emit(\'update:modelValue\', Number($event.target.value))" />'
        },
        'w-switch': {
          props: ['modelValue', 'size'],
          emits: ['update:modelValue'],
          template: '<input type="checkbox" class="switch-stub" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />'
        }
      }
    }
  })
}

describe('WPagePropertyEditor', () => {
  it('应渲染组件类型与通用样式字段', () => {
    const wrapper = createWrapper({
      id: 't1',
      type: 'text',
      props: { content: '示例', tag: 'p', align: 'left' },
      styles: { margin: '16px', padding: '8px', backgroundColor: '#fff', color: '#333', fontSize: '14px', borderRadius: '4px', textAlign: 'center' }
    })
    expect(wrapper.text()).toContain('组件类型')
    expect(wrapper.text()).toContain('外观')
    expect(wrapper.text()).toContain('宽度')
    expect(wrapper.text()).toContain('外边距')
    expect(wrapper.text()).toContain('内边距')
    expect(wrapper.text()).toContain('背景色')
    expect(wrapper.text()).toContain('文字颜色')
    expect(wrapper.text()).toContain('字体大小')
    expect(wrapper.text()).toContain('圆角')
    expect(wrapper.text()).toContain('对齐')
  })

  it('修改样式应更新 node.styles', async () => {
    const wrapper = createWrapper({
      id: 't1',
      type: 'text',
      props: { content: '示例', tag: 'p', align: 'left' },
      styles: {}
    })
    const marginInput = wrapper.findAll('input').find((el) => el.attributes('placeholder') === '如 16px 或 8px 12px')
    expect(marginInput).toBeDefined()
    await marginInput!.setValue('20px')
    expect((wrapper.vm as any).node.styles.margin).toBe('20px')
  })

  it('属性表单应向表单组件注入全局尺寸', () => {
    const wrapper = createWrapper({
      id: 't1',
      type: 'text',
      props: { content: '示例', tag: 'p', align: 'left' },
      styles: {}
    })
    const form = wrapper.findComponent({ name: 'WFormStub' })
    expect(form.props('size')).toBe('default')
  })
})
