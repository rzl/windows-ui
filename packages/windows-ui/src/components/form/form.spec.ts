import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Form from './form.vue'
import FormItem from './form-item.vue'

describe('Form', () => {
  it('默认渲染 form 元素', () => {
    const wrapper = mount(Form, {
      slots: { default: '内容' }
    })
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('form').classes()).toContain('w-form')
    expect(wrapper.text()).toContain('内容')
  })

  it('提交时应触发 submit 事件并返回 model', async () => {
    const model = { name: 'Tom' }
    const wrapper = mount(Form, {
      props: { model },
      slots: { default: '<input />' }
    })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect(wrapper.emitted('submit')![0][0]).toEqual(model)
  })

  it('必填校验失败时不提交并显示错误', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        rules: { name: [{ required: true, message: '请输入姓名' }] }
      },
      slots: { default: '<div class="item" data-prop="name"></div>' }
    })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.emitted('validate')![0]).toEqual([false, { name: '请输入姓名' }])
  })

  it('pattern 校验失败时显示错误', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { email: 'invalid' },
        rules: { email: [{ pattern: /^\S+@\S+\.\S+$/, message: '邮箱格式错误' }] }
      }
    })
    const valid = await (wrapper.vm as any).validate()
    expect(valid).toBe(false)
    expect(wrapper.emitted('validate')![0]).toEqual([false, { email: '邮箱格式错误' }])
  })

  it('min / max 校验失败时显示错误', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { code: '12' },
        rules: { code: [{ min: 3, message: '至少3位' }, { max: 5, message: '最多5位' }] }
      }
    })
    const valid = await (wrapper.vm as any).validate()
    expect(valid).toBe(false)
    expect(wrapper.emitted('validate')![0]).toEqual([false, { code: '至少3位' }])
  })

  it('自定义 validator 校验失败时显示错误', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { age: 15 },
        rules: { age: [{ validator: (v: number) => v >= 18 || '年龄必须大于18岁' }] }
      }
    })
    const valid = await (wrapper.vm as any).validate()
    expect(valid).toBe(false)
    expect(wrapper.emitted('validate')![0]).toEqual([false, { age: '年龄必须大于18岁' }])
  })

  it('resetFields 应清空 model', () => {
    const model = { name: 'Tom', age: 20 }
    const wrapper = mount(Form, {
      props: { model }
    })
    ;(wrapper.vm as any).resetFields()
    expect(model.name).toBeUndefined()
    expect(model.age).toBeUndefined()
  })

  it('clearValidate 应清空 errors', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        rules: { name: [{ required: true, message: '请输入姓名' }] }
      }
    })
    await (wrapper.vm as any).validate()
    expect(wrapper.emitted('validate')![0][0]).toBe(false)
    ;(wrapper.vm as any).clearValidate()
    expect(wrapper.emitted('validate')![0][0]).toBe(false)
  })
})

describe('FormItem', () => {
  it('应渲染 label 和插槽内容', () => {
    const wrapper = mount(FormItem, {
      props: { label: '用户名' },
      slots: { default: '<input />' }
    })
    expect(wrapper.find('.w-form-item__label').text()).toBe('用户名')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('注入 formErrors 后应根据 prop 显示错误', async () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        rules: { name: [{ required: true, message: '姓名必填' }] }
      },
      slots: {
        default: '<form-item label="姓名" prop="name"><input /></form-item>'
      },
      global: {
        components: { FormItem }
      }
    })
    await (wrapper.vm as any).validate()
    const item = wrapper.findComponent(FormItem)
    expect(item.find('.w-form-item__error').text()).toBe('姓名必填')
  })
})
