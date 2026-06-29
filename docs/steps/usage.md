# Steps 步骤条 - 使用说明

## 基础用法

```vue
<template>
  <w-steps :active="1">
    <w-step title="步骤 1" description="描述信息" />
    <w-step title="步骤 2" description="描述信息" />
    <w-step title="步骤 3" description="描述信息" />
  </w-steps>
</template>

<script setup>
import { WSteps, WStep } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| items | 菜单项列表 | array | [] |
| active | - | number | 0 |
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
