# Config Provider 全局配置 - 使用说明

## 基础用法

```vue
<template>
  <w-config-provider prefix="w">
    <w-button>默认按钮</w-button>
  </w-config-provider>
</template>

<script setup>
import { WConfigProvider, WButton } from '@windows-ui/core'
</script>
```

## 全局尺寸

通过 `size` 属性可以统一设置旗下组件的尺寸，支持 `large`、`default`、`small`。未传入 `size` 的组件会自动继承全局配置。

```vue
<template>
  <w-config-provider size="large">
    <w-button>大按钮</w-button>
    <w-input placeholder="大输入框" />
    <w-tag>大标签</w-tag>
    <w-text>大文本</w-text>
    <w-avatar icon="user" />
    <w-icon name="search" />
  </w-config-provider>
</template>
```

受影响的组件：`WButton`、`WInput`、`WTag`、`WText`、`WAvatar`、`WIcon`。

尺寸对应高度：

| 尺寸 | 高度 |
|------|------|
| small | 24px |
| default | 32px |
| large | 40px |

## 主题色配置

通过 `theme` 属性可以动态修改全局主题色。修改后，所有使用了对应 CSS 变量的组件（包括通过 `<teleport>` 渲染到 `body` 的 Dialog、Drawer、MessageBox 等）都会实时跟随变化。

### 支持的键

| 键 | 说明 | 对应 CSS 变量 |
|----|------|---------------|
| primary | 主色 | `--w-color-primary` |
| success | 成功色 | `--w-color-success` |
| warning | 警告色 | `--w-color-warning` |
| danger | 危险色 | `--w-color-danger` |
| info | 信息色 | `--w-color-info` |
| bgColor | 背景色 | `--w-bg-color` |
| textColor | 主文字色 | `--w-text-color-primary` |

传入主色后，系统会自动计算出 `lighter` / `light` / `dark` / `darker` 四个衍生色，以及标题栏渐变 `--w-xp-title-bar`，保证 Button 渐变、Card / Dialog / Drawer / MessageBox / Tour 标题栏等视觉效果的一致性。

### 基础示例

```vue
<template>
  <w-config-provider :theme="{ primary: '#c43e3e' }">
    <w-button type="primary">主题按钮</w-button>
    <w-link type="primary">主题链接</w-link>
    <w-tag type="primary">主题标签</w-tag>
    <w-card header="卡片标题">卡片内容</w-card>
  </w-config-provider>
</template>
```

### 多色同时配置

```vue
<template>
  <w-config-provider :theme="theme">
    <w-button type="primary">主色</w-button>
    <w-button type="success">成功</w-button>
    <w-button type="warning">警告</w-button>
    <w-button type="danger">危险</w-button>
  </w-config-provider>
</template>

<script setup>
const theme = {
  primary: '#245edb',
  success: '#3a9e3a',
  warning: '#e4a010',
  danger: '#d92b2b',
  bgColor: '#ece9d8'
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| prefix | 组件前缀 | string | w |
| size | 全局尺寸 | string | default |
| zIndex | 全局层级 | number | 2000 |
| theme | 主题色配置 | `Record<string, string>` | `{}` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |

## 主题定制

除了通过 `theme` 属性动态修改，也可以直接覆盖 CSS 变量：

```css
:root {
  --w-color-primary: #245edb;
  --w-color-success: #3a9e3a;
  --w-color-warning: #e4a010;
  --w-color-danger: #d92b2b;
  --w-bg-color: #ece9d8;
  --w-text-color-primary: #000;
  --w-border-radius-base: 3px;
  --w-font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
}
```
