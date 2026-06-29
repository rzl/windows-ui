# Avatar 头像 - 使用说明

## 基础用法

```vue
<template>
  <w-space>
    <w-avatar src="https://example.com/avatar.jpg" />
    <w-avatar icon="user" />
    <w-avatar>User</w-avatar>
    <w-avatar shape="square" icon="user" />
    <w-avatar :size="40" bg-color="#245edb">U</w-avatar>
  </w-space>
</template>

<script setup>
import { WAvatar, WSpace } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| src | 图片地址 | string | - |
| alt | 替代文本 | string | - |
| icon | 图标名称 | string | - |
| size | 尺寸 | - | default（继承全局 size） |
| shape | 形状 | string | circle |
| bgColor | 背景颜色 | string | - |
| color | 文字颜色 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| error | 错误时触发 | event |

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
