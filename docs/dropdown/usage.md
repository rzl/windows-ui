# Dropdown 下拉菜单 - 使用说明

## 基础用法

```vue
<template>
  <w-dropdown @command="handleCommand">
    <w-button>下拉菜单 <w-icon name="arrowDown" /></w-button>
    <template #dropdown>
      <w-dropdown-menu>
        <w-dropdown-item command="a">黄金糕</w-dropdown-item>
        <w-dropdown-item command="b">狮子头</w-dropdown-item>
        <w-dropdown-item command="c">螺蛳粉</w-dropdown-item>
      </w-dropdown-menu>
    </template>
  </w-dropdown>
</template>

<script setup>
import { WDropdown, WDropdownMenu, WDropdownItem, WButton, WIcon } from '@windows-ui/core'
const handleCommand = (cmd) => console.log(cmd)
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| items | 菜单项列表 | array | [] |
| triggerText | - | string | 下拉菜单 |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| command | 菜单项点击时触发 | command |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| trigger | 触发元素插槽 |

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
