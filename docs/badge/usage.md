# Badge 徽标 - 使用说明

## 基础用法

```vue
<template>
  <w-badge :value="12" class="item">
    <w-button>评论</w-button>
  </w-badge>
  <w-badge :value="3" class="item" type="primary">
    <w-button>回复</w-button>
  </w-badge>
  <w-badge is-dot class="item">
    <w-button>消息</w-button>
  </w-badge>
</template>

<script setup>
import { WBadge, WButton } from '@windows-ui/core'
</script>

<style scoped>
.item { margin-right: 20px; }
</style>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| value | 值 | string | - |
| max | 最大值 | number | 99 |
| isDot | - | boolean | - |
| type | 类型 | string | danger |

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
