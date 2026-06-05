# Tag 标签 - 使用说明

## 基础用法

```vue
<template>
  <w-tag />
</template>

<script setup>
import { WTag } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| type | 类型 | string | default |
| size | 尺寸 | string | default |
| closable | 是否可关闭 | boolean | - |
| hit | - | boolean | - |
| color | 文字颜色 | string | - |
| bgColor | 背景颜色 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| close | 关闭时触发 | - |

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
