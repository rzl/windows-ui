// 表单布局设计器上下文：打开设计器前由模型设计页注入当前模型的表单字段元数据，
// 注册的设计器组件（画布渲染 / 属性面板选项）都从这里的模块级状态读取。
export interface FormLayoutFieldMeta {
  /** 字段名（FormLayout 叶子引用的名称） */
  field: string
  /** 显示名称 */
  label: string
  /** 表单控件类型（input / select / date 等，与 dynamic-form 的 formType 一致） */
  type: string
  /** 是否必填（仅用于设计器预览展示必填星号） */
  required: boolean
  /** 静态选项（select / radio / checkbox / cascader 用） */
  options?: { label: string; value: any }[]
}

export interface FormLayoutDesignContext {
  formFields: FormLayoutFieldMeta[]
  /** 可选关联模型（子表配置用） */
  models: { label: string; value: string }[]
}

let currentContext: FormLayoutDesignContext = { formFields: [], models: [] }

export function setFormLayoutDesignContext(ctx: FormLayoutDesignContext) {
  currentContext = ctx
}

export function getFormLayoutDesignContext(): FormLayoutDesignContext {
  return currentContext
}
