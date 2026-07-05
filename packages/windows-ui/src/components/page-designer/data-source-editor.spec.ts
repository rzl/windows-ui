import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataSourceEditor from './data-source-editor.vue'

function createWrapper(modelValue: any = { type: '' }, size?: string) {
  return mount(DataSourceEditor, {
    props: { modelValue, size },
    global: {
      stubs: {
        'w-form-item': {
          name: 'WFormItemStub',
          props: ['label', 'size'],
          template: '<div class="form-item-stub"><label v-if="label">{{ label }}</label><slot /></div>'
        },
        'w-input': {
          props: ['modelValue', 'size'],
          emits: ['update:modelValue'],
          template: '<input class="input-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
        },
        'w-select': {
          props: ['modelValue', 'options', 'size'],
          emits: ['update:modelValue'],
          template: '<select class="select-stub" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select>'
        }
      }
    }
  })
}

describe('WPageDataSourceEditor', () => {
  it('应渲染数据源类型选择器', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('数据源类型')
    expect(wrapper.find('.select-stub').exists()).toBe(true)
  })

  it('切换数据源类型应重置并更新 modelValue', async () => {
    const wrapper = createWrapper()
    const select = wrapper.find('.select-stub')
    await select.setValue('api')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([
      { type: 'api', api: { method: 'GET', url: '', params: {}, body: {} } }
    ])
  })

  it('静态数据源应渲染静态值输入框', async () => {
    const wrapper = createWrapper({ type: 'static', value: 'hello' })
    expect(wrapper.text()).toContain('静态值')
    expect(wrapper.find('.input-stub').exists()).toBe(true)
  })

  it('应将 size 透传给表单组件', () => {
    const wrapper = createWrapper({ type: 'static', value: '' }, 'small')
    const selects = wrapper.findAllComponents({ name: 'WFormItemStub' })
    const sized = selects.filter((s) => s.props('size') === 'small')
    expect(sized.length).toBeGreaterThan(0)
  })
})
