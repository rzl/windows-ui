# Config Provider 全局配置 - 使用说明

## 基础用法

```vue
<template>
  <w-config-provider :locale="locale" prefix="w">
    <w-button>默认按钮</w-button>
  </w-config-provider>
</template>

<script setup>
import { WConfigProvider, WButton } from '@windows-ui/core'
const locale = {
  name: 'zh-cn',
  button: { confirm: '确定', cancel: '取消' }
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| prefix | 前缀内容 | string | w |
| size | 尺寸 | string | default |
| zIndex | 层级 | number | 2000 |

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
