# Card 卡片 - 使用说明

## 基础用法

```vue
<template>
  <w-card />
</template>

<script setup>
import { WCard } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| header | 头部内容 | string | - |
| hover | - | boolean | - |
| shadow | - | string | always |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| footer | 底部内容 |
| header | 头部内容 |

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
