# WAdvancedQueryBuilder 高级查询面板

WAdvancedQueryBuilder 提供可嵌套 AND/OR 条件组的高级查询能力，适用于复杂列表筛选场景。

## 基础用法

```vue
<template>
  <w-advanced-query-builder
    v-model="query"
    :fields="fields"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup>
import { ref } from 'vue'

const query = ref({
  logic: 'and',
  conditions: []
})

const fields = [
  { prop: 'username', label: '用户名', type: 'string' },
  { prop: 'age', label: '年龄', type: 'number' },
  { prop: 'status', label: '状态', type: 'select' },
  { prop: 'createdAt', label: '创建时间', type: 'date' }
]

function handleSearch(condition) {
  console.log(condition)
}

function handleReset() {
  query.value = { logic: 'and', conditions: [] }
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | AdvancedConditionGroup \| null | null | 查询条件树 |
| fields | AdvancedQueryField[] | [] | 可选字段列表 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | AdvancedConditionGroup | 条件变化 |
| search | AdvancedConditionGroup | 点击查询按钮 |
| reset | - | 点击重置按钮 |

## 字段类型

`fields` 中每个字段需要包含 `prop`、`label` 与可选的 `type`：

```ts
interface AdvancedQueryField {
  prop: string
  label: string
  type?: 'string' | 'number' | 'date' | 'select'
}
```

组件根据 `type` 自动过滤可用运算符：

- `string` / `text`：等于、不等于、包含、不包含、开头是、结尾是、在列表中、不在列表中、为空、不为空
- `number` / `date` / `datetime`：等于、不等于、大于、大于等于、小于、小于等于、范围、为空、不为空
- `select` / `radio` / `checkbox` / `ref`：等于、不等于、在列表中、不在列表中、为空、不为空

## 条件对象结构

```ts
interface AdvancedCondition {
  field: string
  op: string
  value: any
}

interface AdvancedConditionGroup {
  logic: 'and' | 'or'
  conditions: (AdvancedCondition | AdvancedConditionGroup)[]
}
```

示例：

```json
{
  "logic": "and",
  "conditions": [
    { "field": "username", "op": "like", "value": "admin" },
    {
      "logic": "or",
      "conditions": [
        { "field": "age", "op": "gt", "value": 18 },
        { "field": "status", "op": "eq", "value": "vip" }
      ]
    }
  ]
}
```

## 运算符说明

| 运算符 | 说明 |
|--------|------|
| eq | 等于 |
| ne | 不等于 |
| like | 包含 |
| notLike | 不包含 |
| startsWith | 开头是 |
| endsWith | 结尾是 |
| in | 在列表中（逗号分隔） |
| notIn | 不在列表中（逗号分隔） |
| between | 范围（值使用数组 `[start, end]`） |
| gt / lt | 大于 / 小于 |
| gte / lte | 大于等于 / 小于等于 |
| isNull | 为空 |
| isNotNull | 不为空 |

## Slots

| 插槽名 | 说明 |
|--------|------|
| toolbar | 自定义工具栏内容，位于「添加条件」按钮左侧 |

## 常用查询集成

在低代码平台 `LowcodePage.vue` 中，组件通过 `toolbar` 插槽集成了常用查询下拉、保存查询、设为默认与删除功能。

## 移动端适配

当视口宽度 ≤768px 时，条件行会切换为垂直堆叠，每个选择器与输入框占满可用宽度，便于触控操作。

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
