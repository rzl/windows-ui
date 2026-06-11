# PageContainer 页面容器 - 使用说明

## 基础用法

```vue
<template>
  <w-page-container title="用户管理" :breadcrumb="breadcrumb">
    <template #extra>
      <w-button type="primary">新增</w-button>
    </template>
    <w-table :data="list" :columns="columns" />
  </w-page-container>
</template>

<script setup>
const breadcrumb = [
  { label: '首页', path: '/' },
  { label: '系统管理' },
  { label: '用户管理' }
]
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 标题 | string |  |
| breadcrumb | - | array | [] |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| extra | 自定义内容 |

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
