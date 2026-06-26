import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive, nextTick } from 'vue'
import DynamicForm from './dynamic-form.vue'

function mountDynamicForm(props: any) {
  return mount(DynamicForm, {
    props,
    global: {
      stubs: ['WSpace', 'WIcon']
    }
  })
}

describe('DynamicForm', () => {
  it('应根据 fields 渲染对应表单项', () => {
    const model = reactive({})
    const fields = [
      { prop: 'name', label: '姓名', type: 'input' as const },
      { prop: 'age', label: '年龄', type: 'number' as const }
    ]
    const wrapper = mountDynamicForm({ model, fields })
    const formItems = wrapper.findAll('.w-form-item')
    expect(formItems.length).toBe(2)
  })

  it('必填字段为空时校验应失败', async () => {
    const model = reactive({})
    const fields = [
      { prop: 'name', label: '姓名', type: 'input' as const, required: true }
    ]
    const wrapper = mountDynamicForm({ model, fields })
    const valid = await (wrapper.vm as any).validate()
    expect(valid).toBe(false)
  })

  it('dependsOn 依赖条件不满足时应隐藏字段', async () => {
    const model = reactive({ type: '1' })
    const fields = [
      { prop: 'type', label: '类型', type: 'input' as const },
      { prop: 'extra', label: '扩展', type: 'input' as const, dependsOn: { field: 'type', value: '2', operator: 'eq' as const } }
    ]
    const wrapper = mountDynamicForm({ model, fields })
    const formItems = wrapper.findAll('.w-form-item')
    expect(formItems.length).toBe(1)

    model.type = '2'
    await nextTick()
    const formItemsAfter = wrapper.findAll('.w-form-item')
    expect(formItemsAfter.length).toBe(2)
  })

  it('应调用后端校验规则', async () => {
    const model = reactive({ phone: '13800138000' })
    const validateRules = vi.fn().mockResolvedValue([
      { code: 'phone', valid: true, message: '' }
    ])
    const fields = [
      { prop: 'phone', label: '手机号', type: 'input' as const, validationRule: 'phone' }
    ]
    const wrapper = mountDynamicForm({ model, fields, validateRules })
    const valid = await (wrapper.vm as any).validate()
    expect(valid).toBe(true)
    expect(validateRules).toHaveBeenCalledWith([{ code: 'phone', value: '13800138000' }])
  })

  it('应渲染 upload / cascader / rich-text 字段', () => {
    const model = reactive({})
    const fields = [
      { prop: 'file', label: '文件', type: 'upload' as const },
      { prop: 'city', label: '城市', type: 'cascader' as const },
      { prop: 'desc', label: '描述', type: 'rich-text' as const }
    ]
    const wrapper = mountDynamicForm({ model, fields })
    expect(wrapper.findComponent({ name: 'WUpload' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'WCascader' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'WRichText' }).exists()).toBe(true)
  })

  it('linkageRules 满足条件时应隐藏字段', async () => {
    const model = reactive({ type: '1' })
    const fields = [
      { prop: 'type', label: '类型', type: 'input' as const },
      {
        prop: 'extra',
        label: '扩展',
        type: 'input' as const,
        linkageRules: [
          {
            logic: 'and' as const,
            conditions: [{ field: 'type', operator: 'eq' as const, value: '2' }],
            actions: [{ type: 'hide' as const }]
          }
        ]
      }
    ]
    const wrapper = mountDynamicForm({ model, fields })
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('.w-form-item').length).toBe(2)

    model.type = '2'
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('.w-form-item').length).toBe(1)
  })

  it('linkageRules 满足条件时应设置字段值', async () => {
    const model = reactive<any>({ level: 'vip' })
    const fields = [
      { prop: 'level', label: '等级', type: 'input' as const },
      {
        prop: 'discount',
        label: '折扣',
        type: 'input' as const,
        linkageRules: [
          {
            logic: 'and' as const,
            conditions: [{ field: 'level', operator: 'eq' as const, value: 'vip' }],
            actions: [{ type: 'setValue' as const, value: '0.8' }]
          }
        ]
      }
    ]
    mountDynamicForm({ model, fields })
    await nextTick()
    expect(model.discount).toBe('0.8')
  })
})
