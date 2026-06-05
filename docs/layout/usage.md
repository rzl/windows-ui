# Layout 布局 - 使用说明

## 基础用法

```vue
<template>
  <w-row :gutter="20">
    <w-col :span="6"><div class="grid-content">1</div></w-col>
    <w-col :span="6"><div class="grid-content">2</div></w-col>
    <w-col :span="6"><div class="grid-content">3</div></w-col>
    <w-col :span="6"><div class="grid-content">4</div></w-col>
  </w-row>
</template>

<script setup>
import { WRow, WCol } from '@windows-ui/core'
</script>

<style scoped>
.grid-content {
  background: #d3dce6;
  border-radius: 4px;
  min-height: 36px;
  text-align: center;
  line-height: 36px;
}
</style>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| direction | 方向 | string | vertical |

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
