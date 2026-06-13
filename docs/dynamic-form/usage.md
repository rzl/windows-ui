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
| custom | 自定义插槽 |

## 字段配置

| 属性 | 类型 | 说明 |
|------|------|------|
| prop | string | 字段名 |
| label | string | 标签 |
| type | string | 字段类型 |
| placeholder | string | 占位提示 |
| options | {label,value}[] | 选项（select/radio/checkbox） |
| required | boolean | 是否必填 |
| disabled | boolean / function | 是否禁用 |
| hidden | boolean / function | 是否隐藏 |
| rules | FormRule[] | 自定义校验规则 |
| span | number | 占位列数（预留） |

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| model | Record<string, any> | {} | 表单数据 |
| fields | DynamicField[] | [] | 字段配置 |
| columns | number | 1 | 列数 |
