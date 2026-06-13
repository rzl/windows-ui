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
| date | 日期选择 |
| datetime | 日期时间选择 |
| upload | 文件上传（保存文件名） |
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
| required | boolean | 是否必填 |
| disabled | boolean / function | 是否禁用 |
| hidden | boolean / function | 是否隐藏 |
| rules | FormRule[] | 自定义校验规则 |
| validationRule | string | - | 后端校验规则编码 |
| dependsOn | object | - | 字段联动配置 |
| span | number | 占位列数（预留） |

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| model | Record<string, any> | {} | 表单数据 |
| fields | DynamicField[] | [] | 字段配置 |
| columns | number | 1 | 列数 |
| validateRules | (items) => Promise | - | 后端校验函数，用于校验绑定了 `validationRule` 的字段 |
| loadOptions | (config, model) => Promise | - | 动态选项加载函数，用于加载 `dynamicOptions` 配置的选项 |

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
