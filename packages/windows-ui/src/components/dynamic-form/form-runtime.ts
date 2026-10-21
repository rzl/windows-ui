// 字段运行时：承载 dynamic-form 的字段级行为（校验 / 联动 / 选项 / 默认值 / 编码）
// 与控件渲染，与布局引擎解耦，供平铺布局、legacy FormLayout 与 PageNode 布局引擎共用。
// 注意：本模块只以 import type 引用 dynamic-form.vue 中的类型（编译期擦除，无运行时循环依赖）。
import { computed, h, reactive, watch, onMounted, type ComputedRef, type Ref, type VNode } from 'vue'
import WFormItem from '../form/form-item.vue'
import WInput from '../input/input.vue'
import WInputNumber from '../input-number/input-number.vue'
import WSelect from '../select/select.vue'
import WRadio from '../radio/radio.vue'
import WCheckbox from '../checkbox/checkbox.vue'
import WSwitch from '../switch/switch.vue'
import WDatePicker from '../date-picker/date-picker.vue'
import WDateTimePicker from '../date-time-picker/date-time-picker.vue'
import WUpload from '../upload/upload.vue'
import WCascader from '../cascader/cascader.vue'
import WRichText from '../rich-text/rich-text.vue'
import WSpace from '../space/space.vue'
import WCard from '../card/card.vue'
import WTable from '../table/table.vue'
import WButton from '../button/button.vue'
import type { FormRule } from '../form/form.vue'
import type { DynamicField, LinkageCondition, ValidateRuleItem, ValidateRuleResult } from './dynamic-form.vue'

export interface DynamicFormFieldRuntimeProps {
  model: Record<string, any>
  fields: DynamicField[]
  validateRules?: (items: ValidateRuleItem[]) => Promise<ValidateRuleResult[]>
  loadOptions?: (config: DynamicField['dynamicOptions'], model: Record<string, any>) => Promise<{ label: string; value: any }[]>
  loadRefOptions?: (modelCode: string, displayField: string, keyword: string, relationCode?: string) => Promise<{ label: string; value: any }[]>
  userInfo?: { id?: number | string; deptId?: number | string; roleId?: number | string; [key: string]: any }
  parentModel?: Record<string, any>
  urlParams?: Record<string, any>
  generateCode?: (ruleCode: string) => Promise<string>
  uploadRequest?: (file: File) => Promise<{ url: string; name: string; size?: number }>
}

export interface DynamicFieldRuntime {
  validationErrors: Record<string, string>
  linkageHiddenMap: Record<string, boolean>
  linkageRequiredMap: Record<string, boolean>
  linkageDisabledMap: Record<string, boolean>
  linkageFilteredOptionsMap: Record<string, { label: string; value: any }[]>
  fieldOptionsMap: Record<string, { label: string; value: any }[]>
  refOptionsMap: Record<string, { label: string; value: any }[]>
  visibleFields: ComputedRef<DynamicField[]>
  rules: ComputedRef<Record<string, FormRule[]>>
  getField: (prop: string) => DynamicField | undefined
  isDependsOnHidden: (field: DynamicField) => boolean
  isDisabled: (field: DynamicField) => boolean
  getFieldOptions: (field: DynamicField) => { label: string; value: any }[]
  renderFieldControl: (field: DynamicField) => VNode | null
  renderFieldItem: (prop: string) => VNode | null
  validate: () => Promise<boolean>
}

/**
 * 子表编辑器：绑定 model 中某个数组字段的增删行表格，
 * 供 legacy FormLayout 与 PageNode 两种布局引擎共用。
 */
export function renderSubTableEditor(input: {
  model: Record<string, any>
  field: string
  title?: string
  columns?: { field: string; label: string; width?: number }[]
}): VNode {
  const { model, field } = input
  if (!model[field]) model[field] = []
  const rows: any[] = Array.isArray(model[field]) ? model[field] : []
  const columns = (input.columns || []).map((col) => ({
    prop: col.field,
    label: col.label,
    width: col.width
  }))

  function addRow() {
    if (!Array.isArray(model[field])) model[field] = []
    model[field].push({})
  }
  function removeRow(idx: number) {
    model[field].splice(idx, 1)
  }

  return h(WCard, { header: input.title || '子表', class: 'w-dynamic-form__subtable' }, () => [
    h(WTable, { data: rows, columns }, {
      action: ({ $index }: any) => h(WButton, { size: 'small', type: 'danger', onClick: () => removeRow($index) }, () => '删除')
    }),
    h(WButton, { type: 'primary', onClick: addRow }, () => '+ 新增行')
  ])
}

/**
 * 创建字段运行时。必须在组件 setup 内同步调用（内部注册了侦听器与生命周期钩子）。
 * @param props 表单 props（取其响应式字段）
 * @param formRef WForm 组件实例引用，用于本地校验
 */
export function createFieldRuntime(props: DynamicFormFieldRuntimeProps, formRef: Ref<any>): DynamicFieldRuntime {
  const validationErrors = reactive<Record<string, string>>({})
  const fieldOptionsMap = reactive<Record<string, { label: string; value: any }[]>>({})
  const refOptionsMap = reactive<Record<string, { label: string; value: any }[]>>({})
  const generatedCodeSet = new Set<string>()
  const linkageHiddenMap = reactive<Record<string, boolean>>({})
  const linkageRequiredMap = reactive<Record<string, boolean>>({})
  const linkageDisabledMap = reactive<Record<string, boolean>>({})
  const linkageFilteredOptionsMap = reactive<Record<string, { label: string; value: any }[]>>({})

  const visibleFields = computed(() => {
    return props.fields.filter((field) => {
      if (typeof field.hidden === 'function') return !field.hidden(props.model)
      if (field.hidden) return false
      if (linkageHiddenMap[field.prop]) return false
      return !isDependsOnHidden(field)
    })
  })

  const rules = computed(() => {
    const result: Record<string, FormRule[]> = {}
    visibleFields.value.forEach((field) => {
      const list: FormRule[] = []
      if (field.required || linkageRequiredMap[field.prop]) {
        list.push({ required: true, message: `${field.label} 不能为空` })
      }
      if (field.rules) {
        list.push(...field.rules)
      }
      if (list.length) {
        result[field.prop] = list
      }
    })
    return result
  })

  function getField(prop: string): DynamicField | undefined {
    return props.fields.find((f) => f.prop === prop)
  }

  function isDependsOnHidden(field: DynamicField): boolean {
    if (!field.dependsOn || !field.dependsOn.field) return false
    const targetValue = props.model[field.dependsOn.field]
    const operator = field.dependsOn.operator || 'eq'

    switch (operator) {
      case 'eq':
        return targetValue !== field.dependsOn.value
      case 'ne':
        return targetValue === field.dependsOn.value
      case 'empty':
        return targetValue !== undefined && targetValue !== '' && targetValue !== null
      case 'notEmpty':
        return targetValue === undefined || targetValue === '' || targetValue === null
      default:
        return false
    }
  }

  function isDisabled(field: DynamicField): boolean {
    if (typeof field.disabled === 'function') return field.disabled(props.model)
    if (field.disabled) return true
    return !!linkageDisabledMap[field.prop]
  }

  function renderFieldControl(field: DynamicField): VNode | null {
    const common = {
      modelValue: props.model[field.prop],
      'onUpdate:modelValue': (v: any) => { props.model[field.prop] = v },
      placeholder: field.placeholder,
      disabled: isDisabled(field)
    }

    if (field.type === 'input' || field.type === 'text') {
      return h(WInput, { ...common, type: field.inputType || 'text', clearable: field.clearable })
    }
    if (field.type === 'number') {
      return h(WInputNumber, { ...common, min: field.min, max: field.max })
    }
    if (field.type === 'textarea') {
      return h(WInput, { ...common, type: 'textarea', rows: field.rows || 3 })
    }
    if (field.type === 'select') {
      return h(WSelect, { ...common, options: getFieldOptions(field), clearable: field.clearable })
    }
    if (field.type === 'radio') {
      return h(WSpace, null, () => getFieldOptions(field).map((opt) =>
        h(WRadio, { modelValue: props.model[field.prop], 'onUpdate:modelValue': common['onUpdate:modelValue'], label: opt.value, disabled: common.disabled }, () => opt.label)
      ))
    }
    if (field.type === 'checkbox') {
      return h(WSpace, null, () => getFieldOptions(field).map((opt) =>
        h(WCheckbox, { modelValue: props.model[field.prop], 'onUpdate:modelValue': common['onUpdate:modelValue'], label: opt.value, disabled: common.disabled }, () => opt.label)
      ))
    }
    if (field.type === 'switch') {
      return h(WSwitch, { ...common, activeText: field.activeText, inactiveText: field.inactiveText })
    }
    if (field.type === 'date') {
      return h(WDatePicker, common)
    }
    if (field.type === 'datetime') {
      return h(WDateTimePicker, common)
    }
    if (field.type === 'ref') {
      return h(WSelect, {
        modelValue: props.model[field.prop],
        'onUpdate:modelValue': common['onUpdate:modelValue'],
        options: refOptionsMap[field.prop] || [],
        placeholder: field.placeholder || '请选择',
        disabled: common.disabled,
        clearable: field.clearable,
        filterable: true,
        onFocus: () => { loadRefOptions(field) }
      })
    }
    if (field.type === 'upload') {
      return h(WUpload, { buttonText: field.placeholder || '选择文件', disabled: common.disabled, httpRequest: props.uploadRequest, onChange: (v: any) => { props.model[field.prop] = v } })
    }
    if (field.type === 'cascader') {
      return h(WCascader, { ...common, options: getFieldOptions(field), clearable: field.clearable })
    }
    if (field.type === 'rich-text') {
      return h(WRichText, common)
    }
    return h('slot', { name: field.prop, field, model: props.model })
  }

  function renderFieldItem(prop: string): VNode | null {
    const field = getField(prop)
    if (!field) return null
    if (typeof field.hidden === 'function' ? field.hidden(props.model) : field.hidden) return null
    if (linkageHiddenMap[field.prop]) return null
    if (isDependsOnHidden(field)) return null
    return h(WFormItem, { label: field.label, prop: field.prop }, () => [
      renderFieldControl(field),
      validationErrors[field.prop] ? h('div', { class: 'w-dynamic-form__error' }, validationErrors[field.prop]) : null
    ])
  }

  function getFieldOptions(field: DynamicField) {
    if (linkageFilteredOptionsMap[field.prop]) return linkageFilteredOptionsMap[field.prop]
    if (fieldOptionsMap[field.prop]) return fieldOptionsMap[field.prop]
    return field.options || []
  }

  async function loadFieldOptions(field: DynamicField) {
    if (!field.dynamicOptions || !props.loadOptions) return
    try {
      const options = await props.loadOptions(field.dynamicOptions, props.model)
      fieldOptionsMap[field.prop] = options || []
    } catch (error) {
      console.error(`加载字段 ${field.prop} 选项失败`, error)
      fieldOptionsMap[field.prop] = []
    }
  }

  async function loadRefOptions(field: DynamicField) {
    if (!props.loadRefOptions) return
    if (field.refRelation) {
      try {
        const options = await props.loadRefOptions('', '', '', field.refRelation)
        refOptionsMap[field.prop] = options || []
      } catch (error) {
        console.error(`加载关联关系 ${field.refRelation} 选项失败`, error)
        refOptionsMap[field.prop] = []
      }
      return
    }
    if (!field.refModel || !field.refDisplayField) return
    try {
      const options = await props.loadRefOptions(field.refModel, field.refDisplayField, '')
      refOptionsMap[field.prop] = options || []
    } catch (error) {
      console.error(`加载关联模型 ${field.refModel} 选项失败`, error)
      refOptionsMap[field.prop] = []
    }
  }

  // 监听依赖字段变化，自动加载动态选项
  watch(
    () => props.fields,
    (fields) => {
      fields.forEach((field) => {
        if (field.dynamicOptions) {
          loadFieldOptions(field)
        }
        if (field.type === 'ref') {
          loadRefOptions(field)
        }
      })
    },
    { immediate: true, deep: true }
  )

  // 监听字段配置变化，自动为生码字段生成编码
  watch(
    () => props.fields,
    async (fields) => {
      if (!props.generateCode) return
      for (const field of fields) {
        if (!field.codingRule) continue
        if (props.model[field.prop] !== undefined && props.model[field.prop] !== '' && props.model[field.prop] !== null) continue
        if (generatedCodeSet.has(field.prop)) continue
        try {
          const code = await props.generateCode(field.codingRule)
          props.model[field.prop] = code
          generatedCodeSet.add(field.prop)
        } catch (error) {
          console.error(`生成编码失败: ${field.codingRule}`, error)
        }
      }
    },
    { immediate: true, deep: true }
  )

  // 监听字段配置变化，自动填充默认值
  watch(
    () => props.fields,
    (fields) => {
      fields.forEach((field) => {
        if (!field.defaultValueType || field.defaultValueType === 'constant') {
          if (field.defaultValueExpr !== undefined && (props.model[field.prop] === undefined || props.model[field.prop] === '' || props.model[field.prop] === null)) {
            props.model[field.prop] = field.defaultValueExpr
          }
          return
        }
        if (props.model[field.prop] !== undefined && props.model[field.prop] !== '' && props.model[field.prop] !== null) return
        const value = computeDefaultValue(field)
        if (value !== undefined) {
          props.model[field.prop] = value
        }
      })
    },
    { immediate: true, deep: true }
  )

  watch(
    () => props.model,
    (model, oldModel) => {
      props.fields.forEach((field) => {
        if (field.dynamicOptions?.dependsOn) {
          const depField = field.dynamicOptions.dependsOn
          if (model[depField] !== oldModel?.[depField]) {
            loadFieldOptions(field)
          }
        }
      })
    },
    { deep: true }
  )

  async function validate(): Promise<boolean> {
    // 清空历史后端校验错误
    Object.keys(validationErrors).forEach((k) => delete validationErrors[k])

    // 本地校验
    const localValid = formRef.value ? await formRef.value.validate() : true
    if (!localValid) return false

    // 后端校验规则
    const ruleFields = visibleFields.value.filter(
      (f) => f.validationRule && props.model[f.prop] !== undefined && props.model[f.prop] !== '' && props.model[f.prop] !== null
    )

    if (!ruleFields.length || !props.validateRules) return true

    const items: ValidateRuleItem[] = ruleFields.map((f) => ({
      code: f.validationRule as string,
      value: props.model[f.prop]
    }))

    try {
      const results = await props.validateRules(items)
      let valid = true
      results.forEach((result, index) => {
        const field = ruleFields[index]
        if (!result.valid) {
          valid = false
          validationErrors[field.prop] = result.message || `${field.label} 校验失败`
        }
      })
      return valid
    } catch (error) {
      console.error('校验规则调用失败', error)
      return false
    }
  }

  function evaluateLinkageRules() {
    props.fields.forEach((field) => {
      if (!field.linkageRules?.length) return

      // 重置该字段的联动状态
      linkageHiddenMap[field.prop] = false
      linkageRequiredMap[field.prop] = false
      linkageDisabledMap[field.prop] = false
      delete linkageFilteredOptionsMap[field.prop]

      field.linkageRules.forEach((rule) => {
        const matched = evaluateConditions(rule.conditions || [], rule.logic || 'and')
        if (!matched) return

        rule.actions.forEach((action) => {
          switch (action.type) {
            case 'show':
              linkageHiddenMap[field.prop] = false
              break
            case 'hide':
              linkageHiddenMap[field.prop] = true
              break
            case 'required':
              linkageRequiredMap[field.prop] = true
              break
            case 'unrequired':
              linkageRequiredMap[field.prop] = false
              break
            case 'enable':
              linkageDisabledMap[field.prop] = false
              break
            case 'disable':
              linkageDisabledMap[field.prop] = true
              break
            case 'setValue':
              props.model[field.prop] = action.value
              break
            case 'clear':
              props.model[field.prop] = undefined
              break
            case 'filterOptions':
              linkageFilteredOptionsMap[field.prop] = action.options || []
              break
          }
        })
      })
    })
  }

  function evaluateConditions(conditions: LinkageCondition[], logic: 'and' | 'or'): boolean {
    if (!conditions.length) return true
    const results = conditions.map((c) => evaluateCondition(c))
    if (logic === 'or') return results.some(Boolean)
    return results.every(Boolean)
  }

  function evaluateCondition(condition: LinkageCondition): boolean {
    const targetValue = props.model[condition.field]
    const op = condition.operator || 'eq'
    const expected = condition.value

    switch (op) {
      case 'eq':
        return targetValue === expected
      case 'ne':
        return targetValue !== expected
      case 'gt':
        return Number(targetValue) > Number(expected)
      case 'gte':
        return Number(targetValue) >= Number(expected)
      case 'lt':
        return Number(targetValue) < Number(expected)
      case 'lte':
        return Number(targetValue) <= Number(expected)
      case 'contains':
        return String(targetValue).includes(String(expected))
      case 'notContains':
        return !String(targetValue).includes(String(expected))
      case 'empty':
        return targetValue === undefined || targetValue === '' || targetValue === null
      case 'notEmpty':
        return targetValue !== undefined && targetValue !== '' && targetValue !== null
      case 'in':
        return Array.isArray(expected) ? expected.includes(targetValue) : String(expected).split(',').includes(String(targetValue))
      case 'notIn':
        return Array.isArray(expected) ? !expected.includes(targetValue) : !String(expected).split(',').includes(String(targetValue))
      default:
        return false
    }
  }

  watch(
    () => [props.fields, props.model],
    () => {
      evaluateLinkageRules()
    },
    { immediate: true, deep: true }
  )

  onMounted(() => {
    evaluateLinkageRules()
  })

  function evalExpr(expr: string, ctx: Record<string, any>) {
    try {
      const fn = new Function('ctx', `with(ctx) { return (${expr}) }`)
      return fn(ctx)
    } catch (error) {
      console.error(`默认值表达式执行失败: ${expr}`, error)
      return undefined
    }
  }

  function computeDefaultValue(field: DynamicField): any {
    if (field.defaultValueType === 'currentUser') {
      return props.userInfo?.id ?? undefined
    }
    if (field.defaultValueType === 'currentDept') {
      return props.userInfo?.deptId ?? undefined
    }
    if (field.defaultValueType === 'currentRole') {
      return props.userInfo?.roleId ?? undefined
    }
    if (field.defaultValueType === 'currentTime') {
      const now = new Date()
      if (field.type === 'date') return now.toISOString().slice(0, 10)
      if (field.type === 'datetime') return now.toISOString().slice(0, 19).replace('T', ' ')
      return now.toISOString()
    }
    if (field.defaultValueType === 'field') {
      return field.defaultValueExpr ? props.model[field.defaultValueExpr] : undefined
    }
    if (field.defaultValueType === 'urlParam') {
      return field.defaultValueExpr ? props.urlParams?.[field.defaultValueExpr] : undefined
    }
    if (field.defaultValueType === 'parentField') {
      return field.defaultValueExpr ? props.parentModel?.[field.defaultValueExpr] : undefined
    }
    if (field.defaultValueType === 'expr') {
      return evalExpr(field.defaultValueExpr || '', props.model)
    }
    return undefined
  }

  return {
    validationErrors,
    linkageHiddenMap,
    linkageRequiredMap,
    linkageDisabledMap,
    linkageFilteredOptionsMap,
    fieldOptionsMap,
    refOptionsMap,
    visibleFields,
    rules,
    getField,
    isDependsOnHidden,
    isDisabled,
    getFieldOptions,
    renderFieldControl,
    renderFieldItem,
    validate
  }
}
