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
| title | 页面标题 | string | '' |
| breadcrumb | 面包屑数据 | { label, path? }[] | [] |

### Slots

| 插槽名 | 说明 |
|--------|------|
| extra | 标题右侧操作区 |
| default | 页面内容 |

## 主题定制

```css
:root {
  --w-color-primary: #245edb;
  --w-bg-color: #ece9d8;
}
```
