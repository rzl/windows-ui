# WQueryBuilder 高级查询

WQueryBuilder 提供多条件组合查询能力，支持条件分组（AND/OR）、字段类型自动匹配输入组件以及常用查询方案保存，适用于复杂列表筛选场景。

## 基础用法

```vue
<template>
  <w-query-builder
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
  { prop: 'username', label: '用户名' },
  { prop: 'age', label: '年龄', type: 'number' },
  { prop: 'status', label: '状态', type: 'select', options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] },
  { prop: 'createdAt', label: '创建时间', type: 'date' }
]

function handleSearch(conditions) {
  console.log(conditions)
  // [{ field: 'username', operator: 'like', value: 'admin' }]
}

function handleReset() {
  query.value = { logic: 'and', conditions: [] }
}
</script>
```

## 字段配置

每个字段为一个对象，支持以下属性：

| 属性 | 说明 | 类型 |
|------|------|------|
| prop | 字段名 | string |
| label | 显示名称 | string |
| type | 字段类型，决定输入组件与可用运算符 | string |
| options | 下拉选项（type 为 select 时有效） | { label, value }[] |
| searchMode | 默认运算符，如 `between` | string |

支持的字段类型：

- `text` / 默认：普通输入框
- `number`：数字输入框
- `date`：日期选择器
- `datetime`：日期时间选择器
- `select`：下拉选择器

## 条件分组

点击「添加分组」可创建嵌套的条件组，每组可独立设置 `and` 或 `or` 逻辑，支持多层嵌套。

```json
{
  "logic": "and",
  "conditions": [
    { "field": "username", "operator": "like", "value": "admin" },
    {
      "logic": "or",
      "conditions": [
        { "field": "age", "operator": "gte", "value": 18 },
        { "field": "status", "operator": "eq", "value": 1 }
      ]
    }
  ]
}
```

## 查询方案

点击「方案」可保存当前查询条件，后续可快速加载已保存的方案，也可删除不需要的方案。

## 操作符

| 操作符 | 说明 |
|--------|------|
| eq | 等于 |
| ne | 不等于 |
| like | 包含 |
| notLike | 不包含 |
| between | 范围（值使用数组 `[start, end]`） |
| gt / lt | 大于 / 小于 |
| gte / lte | 大于等于 / 小于等于 |

## 低代码场景

在低代码平台中，`WQueryBuilder` 已集成到动态业务页面。设计列表时，将字段标记为「可查询」，运行业务页面即可对该字段进行多条件筛选。

查询条件会以 JSON 数组格式提交到后端，例如：

```json
[
  { "field": "name", "operator": "like", "value": "张" },
  { "field": "age", "operator": "gte", "value": "18" }
]
```

后端根据操作符解析为对应 SQL 条件（`like`、`=`、`!=`、`>`、`<`、`>=`、`<=`）。

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model），包含分组结构 | object | null |
| fields | 可选字段列表 | array | [] |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| search | 点击查询按钮触发 | QueryCondition[] |
| reset | 点击重置按钮触发 | - |

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
