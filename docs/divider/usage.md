# Divider 分割线 - 使用说明

## 基础用法

```vue
<template>
  <span>雨纷纷</span>
  <w-divider direction="vertical" />
  <span>旧故里</span>
  <w-divider direction="vertical" />
  <span>草木深</span>
  <w-divider content-position="left">左侧文本</w-divider>
  <w-divider content-position="right">右侧文本</w-divider>
</template>

<script setup>
import { WDivider } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| direction | 方向 | string | horizontal |
| content | 内容 | string | - |
| contentPosition | 内容位置 | string | center |
| size | 尺寸 | string | default（继承全局 size） |

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
