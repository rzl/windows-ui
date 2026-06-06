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

## 全局尺寸

通过 `size` 属性可以统一设置旗下组件的尺寸，支持 `large`、`default`、`small`。

```vue
<template>
  <w-config-provider size="large">
    <w-button>大按钮</w-button>
    <w-input placeholder="大输入框" />
    <w-tag>大标签</w-tag>
    <w-text>大文本</w-text>
    <w-avatar icon="user" />
  </w-config-provider>
</template>
```

受影响的组件：`WButton`、`WInput`、`WTag`、`WText`、`WAvatar`、`WIcon`。

## 主题色配置

通过 `theme` 属性可以动态修改全局主题色，支持 `primary`、`success`、`warning`、`danger`、`info`、`bgColor`、`textColor`。

```vue
<template>
  <w-config-provider :theme="{ primary: '#c43e3e', bgColor: '#f5f0e8' }">
    <w-button type="primary">主题按钮</w-button>
    <w-link type="primary">主题链接</w-link>
    <w-tag type="primary">主题标签</w-tag>
  </w-config-provider>
</template>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| prefix | 前缀内容 | string | w |
| size | 尺寸 | string | default |
| zIndex | 层级 | number | 2000 |
| theme | 主题色配置 | `Record<string, string>` | `{}` |

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
