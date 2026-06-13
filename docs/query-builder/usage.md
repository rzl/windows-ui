# WQueryBuilder 高级查询

WQueryBuilder 提供多条件组合查询能力，适用于复杂列表筛选场景。

## 基础用法

```vue
<template>
  <w-query-builder :fields="fields" @search="handleSearch" @reset="handleReset" />
</template>

<script setup>
const fields = [
  { prop: 'username', label: '用户名' },
  { prop: 'age', label: '年龄' },
  { prop: 'status', label: '状态' }
]

function handleSearch(conditions) {
  console.log(conditions)
  // [{ field: 'username', operator: 'like', value: 'admin' }]
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| fields | QueryField[] | [] | 可选字段列表 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| search | QueryCondition[] | 查询条件数组 |
| reset | - | 重置 |

## 操作符

| 操作符 | 说明 |
|--------|------|
| eq | 等于 |
| ne | 不等于 |
| like | 包含 |
| gt / lt | 大于 / 小于 |
| gte / lte | 大于等于 / 小于等于 |
