# Infinite Scroll 无限滚动 - 使用说明

## 基础用法

```vue
<template>
  <w-infinite-scroll />
</template>

<script setup>
import { WInfiniteScroll } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| loading | 加载状态插槽 | boolean | - |
| noMore | - | boolean | - |
| distance | - | number | 0 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| load | 加载时触发 | (node, resolve) |

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
