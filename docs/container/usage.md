# Container 布局容器 - 使用说明

## 基础用法

```vue
<template>
  <w-container>
    <w-header>Header</w-header>
    <w-main>Main</w-main>
    <w-footer>Footer</w-footer>
  </w-container>
</template>

<script setup>
import { WContainer, WHeader, WMain, WFooter } from '@windows-ui/core'
</script>

<style scoped>
.w-header, .w-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.w-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| fluid | - | boolean | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |

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
