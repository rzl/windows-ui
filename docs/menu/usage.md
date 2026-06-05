# Menu 菜单 - 使用说明

## 基础用法

```vue
<template>
  <w-menu />
</template>

<script setup>
import { WMenu } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| items | 菜单项列表 | array | [] |
| mode | 菜单模式 | string | vertical |
| defaultActive | 默认激活项 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| select | 选中时触发 | (selection, row) |

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
