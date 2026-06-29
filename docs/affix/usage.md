# Affix 固钉 - 使用说明

## 基础用法

```vue
<template>
  <w-affix :offset="80">
    <w-button type="primary">固定在顶部 80px</w-button>
  </w-affix>
</template>

<script setup>
import { WAffix, WButton } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| offset | 偏移量 | number | 0 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 值改变时触发 | value |

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
