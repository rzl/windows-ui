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

## 操作符

| 操作符 | 说明 |
|--------|------|
| eq | 等于 |
| ne | 不等于 |
| like | 包含 |
| gt / lt | 大于 / 小于 |
| gte / lte | 大于等于 / 小于等于 |

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| fields | - | array | [] |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| search | - | - |
| reset | - | - |

## 移动端适配

`WQueryBuilder` 已内置移动端响应式适配：

- 当视口宽度 ≤768px 时，查询条件行会自动由横向排列切换为垂直堆叠。
- 每个条件内的字段选择器、操作符选择器、值输入框以及删除按钮均占满可用宽度，便于触控操作。
- 按钮区域自动换行，避免小屏幕下操作按钮被挤压。

在配合 `WDialog` 使用时，建议将 `WQueryBuilder` 放入弹窗内容区；弹窗在移动端会自动切换为全屏模式，关闭全屏后恢复原有尺寸与拖拽能力。

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
