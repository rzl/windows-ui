# Breadcrumb 面包屑 - 使用说明

## 基础用法

```vue
<template>
  <w-breadcrumb separator="/">
    <w-breadcrumb-item :to="{ path: '/' }">首页</w-breadcrumb-item>
    <w-breadcrumb-item>活动管理</w-breadcrumb-item>
    <w-breadcrumb-item>活动列表</w-breadcrumb-item>
  </w-breadcrumb>
</template>

<script setup>
import { WBreadcrumb, WBreadcrumbItem } from '@windows-ui/core'
</script>
```

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
