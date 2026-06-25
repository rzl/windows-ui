# WDynamicForm 动态表单

WDynamicForm 通过 JSON 字段配置动态渲染表单，适用于低代码场景。

## 基础用法

```vue
<template>
  <w-dynamic-form v-model="form" :fields="fields" :columns="2" />
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({})
const fields = [
  { prop: 'username', label: '用户名', type: 'input', required: true },
  { prop: 'phone', label: '手机号', type: 'input', validationRule: 'phone' },
  { prop: 'age', label: '年龄', type: 'number' },
  { prop: 'gender', label: '性别', type: 'select', options: [{ label: '男', value: 1 }, { label: '女', value: 2 }] },
  { prop: 'status', label: '状态', type: 'switch', activeText: '启用', inactiveText: '禁用' }
]
</script>
```

## 字段类型

| 类型 | 说明 |
|------|------|
| input / text | 文本输入框 |
| number | 数字输入框 |
| textarea | 多行文本 |
| select | 下拉选择 |
| radio | 单选框 |
| checkbox | 多选框 |
| switch | 开关 |
| ref | 关联模型选择（需配置 refModel / refDisplayField / refRelation 之一，并传入 loadRefOptions） |
| date | 日期选择 |
| datetime | 日期时间选择 |
| upload | 文件上传（保存 URL，需配置 uploadRequest） |
| cascader | 级联选择 |
| rich-text | 富文本编辑器 |
| custom | 自定义插槽 |

## 字段配置

| 属性 | 类型 | 说明 |
|------|------|------|
| prop | string | 字段名 |
| label | string | 标签 |
| type | string | 字段类型 |
| placeholder | string | 占位提示 |
| options | {label,value}[] | 静态选项（select/radio/checkbox） |
| dynamicOptions | object | 动态选项配置（见下文） |
| refModel | string | 关联模型编码，`ref` 类型使用 |
| refDisplayField | string | 关联模型显示字段，`ref` 类型使用 |
| refRelation | string | 关联关系编码，`ref` 类型使用；配置后通过 loadRefOptions 加载关系选项 |
| refFilter | object | 关联数据筛选条件，`ref` 类型使用 |
| defaultValueType | string | 默认值类型：`constant`、`currentUser`、`currentTime`、`currentDept`、`field`、`expr` |
| defaultValueExpr | string | 默认值表达式 |
| required | boolean | 是否必填 |
| disabled | boolean / function | 是否禁用 |
| hidden | boolean / function | 是否隐藏 |
| rules | FormRule[] | 自定义校验规则 |
| validationRule | string | - | 后端校验规则编码 |
| dependsOn | object | - | 字段联动配置 |
| codingRule | string | - | 编码规则编码，新增时自动生成编码 |
| span | number | 占位列数（预留） |

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| model | Record<string, any> | {} | 表单数据 |
| fields | DynamicField[] | [] | 字段配置 |
| columns | number | 1 | 列数 |
| mobileColumns | number | 1 | 移动端列数，视口宽度 ≤768px 时 grid 布局自动降为该列数 |
| validateRules | (items) => Promise | - | 后端校验函数，用于校验绑定了 `validationRule` 的字段 |
| loadOptions | (config, model) => Promise | - | 动态选项加载函数，用于加载 `dynamicOptions` 配置的选项 |
| loadRefOptions | (modelCode, displayField, keyword, relationCode?) => Promise | - | 关联模型选项加载函数，用于 `ref` 字段查询关联记录；当字段配置了 `refRelation` 时，relationCode 有值，modelCode 与 displayField 为空字符串 |
| uploadRequest | (file) => Promise | - | 文件上传函数，用于 `upload` 字段真实上传文件并返回 URL |
| generateCode | (ruleCode) => Promise<string> | - | 编码规则生成函数，用于 `codingRule` 字段自动生成编码 |
| userInfo | object | - | 当前用户信息，用于 `currentUser` / `currentDept` 默认值 |

## 移动端适配

WDynamicForm 已针对移动端进行响应式适配：当视口宽度 ≤768px 时，表单 grid 布局会自动降为 `mobileColumns` 指定的列数（默认 1 列），避免多列字段在窄屏下被过度压缩。

新增 prop：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| mobileColumns | number | 1 | 移动端 grid 列数，视口宽度 ≤768px 时生效 |

使用示例：

```vue
<w-dynamic-form v-model="form" :fields="fields" :columns="3" :mobile-columns="1" />
```

注意事项：

- 移动端检测基于 `window.innerWidth`，并在窗口 resize 时自动响应。
- 传入自定义 `layout` 时，内部的 `grid` 节点同样会遵循 `mobileColumns`。
- 移动端下表单项 label 与内容区会自动纵向堆叠（由 WForm/WFormItem 适配）。
- 子表（`subtable` 布局）使用的 WTable 在移动端支持横向滚动，单元格内容不换行。
- 若动态表单置于 WDialog 中使用，弹窗在移动端会自动切换为全屏，支持点击全屏按钮退出并拖拽。

## 列表设计

动态表单常与 `WCrudTable` / `WTable` 配合使用。列表字段支持 `format`、`align`、`fixed`、`searchMode` 等配置：

```ts
const tableFields = [
  { field: 'amount', label: '金额', format: 'money', align: 'right' },
  { field: 'status', label: '状态', format: 'dict', align: 'center' },
  { field: 'createTime', label: '创建时间', format: 'datetime', searchMode: 'between' }
]
```

支持的 `format`：

| 值 | 说明 |
|---|------|
| `date` | 显示日期部分 |
| `datetime` | 显示日期时间 |
| `number` | 千分位数字 |
| `money` | 金额 `¥xx.xx` |
| `percent` | 百分比 |
| `boolean` | `是` / `否` |
| `dict` | 根据字段绑定的字典编码转换显示 |

## 方法

通过 `ref` 调用：

| 方法 | 说明 |
|------|------|
| validate | 执行本地校验 + 后端校验规则校验，返回 Promise<boolean> |

## 后端校验规则

配置字段的 `validationRule` 后，表单提交时会调用 `validateRules` 函数进行异步校验。`validateRules` 接收校验项数组，返回每项的校验结果：

```ts
validateRules([
  { code: 'phone', value: '13800138000' },
  { code: 'email', value: 'test@example.com' }
])
// 返回：[{ code: 'phone', valid: true, message: '' }, { code: 'email', valid: false, message: '邮箱格式不正确' }]
```

## 字段联动

通过 `dependsOn` 配置字段显示条件：

```ts
const fields = [
  { prop: 'gender', label: '性别', type: 'select', options: [{ label: '男', value: '1' }, { label: '女', value: '2' }] },
  { prop: 'husbandName', label: '丈夫姓名', type: 'input', dependsOn: { field: 'gender', value: '2', operator: 'eq' } }
]
```

`operator` 支持：

| 操作符 | 说明 |
|--------|------|
| eq | 依赖字段值等于 `value` 时显示 |
| ne | 依赖字段值不等于 `value` 时显示 |
| empty | 依赖字段值为空时显示 |
| notEmpty | 依赖字段值非空时显示 |

## 动态选项

字段支持通过 `dynamicOptions` 从字典、SQL、接口或脚本动态加载选项。当配置了 `dependsOn` 时，依赖字段值变化会自动重新加载。

```ts
const fields = [
  { prop: 'province', label: '省份', type: 'select', options: [{ label: '北京', value: 'bj' }] },
  {
    prop: 'city',
    label: '城市',
    type: 'select',
    dynamicOptions: {
      type: 'sql',
      dependsOn: 'province',
      sql: "SELECT name AS label, code AS value FROM city WHERE province_code = '${ctx.province}'"
    }
  }
]
```

`dynamicOptions.type` 支持：

| 类型 | 字段 | 说明 |
|------|------|------|
| dict | dictCode | 系统字典编码 |
| sql | sql | 只读 SELECT 查询，结果需包含 label/value |
| api | api.method / api.url | 调用内部接口 |
| script | script | 在线脚本，可访问 `ctx`、`db`、`http` |

使用动态选项时需要传入 `loadOptions` 函数：

```vue
<w-dynamic-form v-model="form" :fields="fields" :load-options="loadOptions" />

<script setup>
async function loadOptions(config, model) {
  return request.post('/lowcode/options/execute', { config, ctx: model })
}
</script>
```

## 编码规则自动生成

配置字段的 `codingRule` 后，表单初始化时会自动调用 `generateCode` 生成并回填编码，适用于工号、订单号、流水号等场景。

```ts
const fields = [
  { prop: 'orderNo', label: '订单编号', type: 'input', codingRule: 'ORDER_NO' }
]
```

```vue
<w-dynamic-form v-model="form" :fields="fields" :generate-code="generateCode" />

<script setup>
async function generateCode(ruleCode) {
  return request.get(`/lowcode/coding-rules/${ruleCode}/generate`)
}
</script>
```

> 注意：`codingRule` 只在字段值为空时触发，且同一次表单渲染中每个字段仅生成一次，避免重复调用。

## 默认值表达式

字段支持配置动态默认值，表单初始化时自动填充。

```ts
const fields = [
  { prop: 'createBy', label: '创建人', type: 'input', defaultValueType: 'currentUser' },
  { prop: 'createTime', label: '创建时间', type: 'datetime', defaultValueType: 'currentTime' },
  { prop: 'remark', label: '备注', type: 'input', defaultValueType: 'constant', defaultValueExpr: '暂无' }
]
```

```vue
<w-dynamic-form v-model="form" :fields="fields" :user-info="userInfo" />

<script setup>
const userInfo = { id: 1, deptId: 2 }
</script>
```

支持的 `defaultValueType`：

| 类型 | 说明 | `defaultValueExpr` |
|------|------|-------------------|
| `constant` | 常量 | 直接作为字段值 |
| `currentUser` | 当前用户 | 无需填写，取 `userInfo.id` |
| `currentDept` | 当前部门 | 无需填写，取 `userInfo.deptId` |
| `currentTime` | 当前时间 | 无需填写，根据字段类型返回日期/日期时间 |
| `field` | 关联字段 | 填写其他字段名 |
| `expr` | 表达式 | 填写 JS 表达式，例如 `new Date().getFullYear()` |

## 关联模型选择

配置字段类型为 `ref`，并传入 `refModel`、`refDisplayField` 与 `loadRefOptions`：

```ts
const fields = [
  { prop: 'customerId', label: '客户', type: 'ref', refModel: 'customer', refDisplayField: 'name' }
]
```

```vue
<w-dynamic-form v-model="form" :fields="fields" :load-ref-options="loadRefOptions" />

<script setup>
async function loadRefOptions(modelCode, displayField, keyword) {
  const result = await request.get(`/lowcode/${modelCode}`, { params: { page: 1, pageSize: 50, keyword } })
  return result.data.list.map(row => ({
    label: row[displayField] || `ID:${row.id}`,
    value: row.id
  }))
}
</script>
```

### 通过关联关系加载选项

当字段配置了 `refRelation` 时，`loadRefOptions` 会收到 `relationCode`，可直接调用关联关系选项接口：

```ts
const fields = [
  { prop: 'customerId', label: '客户', type: 'ref', refRelation: 'order_customer' }
]
```

```vue
<w-dynamic-form v-model="form" :fields="fields" :load-ref-options="loadRefOptions" />

<script setup>
async function loadRefOptions(modelCode, displayField, keyword, relationCode) {
  if (relationCode) {
    const result = await request.get(`/lowcode/relations/${relationCode}/options`, { params: { keyword } })
    return result.data.list.map(row => ({
      label: row.label || row.name || `ID:${row.id}`,
      value: row.id
    }))
  }
  const result = await request.get(`/lowcode/${modelCode}`, { params: { page: 1, pageSize: 50, keyword } })
  return result.data.list.map(row => ({
    label: row[displayField] || `ID:${row.id}`,
    value: row.id
  }))
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model | - | object | {} |
| fields | - | array | [] |
| columns | 列配置 | number | 1 |
| mobileColumns | 移动端列数 | number | 1 |
| layout | 布局 | object | - |
| validateRules | - | function | - |
| loadOptions | - | function | - |
| loadRefOptions | - | function | - |
| userInfo | - | object | - |
| generateCode | - | function | - |
| uploadRequest | - | function | - |

### Methods

| 方法名 | 说明 |
|--------|------|
| validate | 组件暴露的方法 |

## 主题定制

可通过 CSS 变量自定义主题色：

```css
:root {
  --w-color-primary: #245edb;
  --w-bg-color: #ece9d8;
  --w-text-color-primary: #000;
  --w-border-radius-base: 3px;
  --w-font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
}
```
