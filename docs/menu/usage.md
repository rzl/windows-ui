# Menu 菜单 - 使用说明

## 基础用法

```vue
<template>
  <w-menu default-active="1">
    <w-menu-item index="1">处理中心</w-menu-item>
    <w-sub-menu index="2" title="我的工作台">
      <w-menu-item index="2-1">选项一</w-menu-item>
      <w-menu-item index="2-2">选项二</w-menu-item>
    </w-sub-menu>
    <w-menu-item index="3">消息中心</w-menu-item>
  </w-menu>
</template>

<script setup>
import { WMenu, WMenuItem, WSubMenu } from '@windows-ui/core'
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
