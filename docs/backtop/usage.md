# Backtop 回到顶部 - 使用说明

## 基础用法

```vue
<template>
  <div style="height: 2000px;">
    <p>向下滚动查看 Backtop 组件</p>
  </div>
  <w-backtop />
</template>

<script setup>
import { WBacktop } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| visibilityHeight | - | number | 200 |

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
