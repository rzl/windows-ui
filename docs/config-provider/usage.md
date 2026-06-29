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
  bgColor: '#ffffff'
}
</script>
```

## 主题模式（light / dark / auto）

通过 `mode` 属性可以一键切换日光模式与暗黑模式。组件库会在 `document.documentElement` 上添加或移除 `dark` class，并切换 `color-scheme`。

- `light`：强制日光模式（默认）。
- `dark`：强制暗黑模式。
- `auto`：跟随系统 `prefers-color-scheme: dark` 自动切换。

```vue
<template>
  <w-config-provider mode="dark">
    <w-button type="primary">暗黑模式按钮</w-button>
    <w-card header="卡片标题">卡片内容</w-card>
  </w-config-provider>
</template>
```

### 与 theme 同时使用

`theme` 优先级高于默认调色盘。如需在暗黑模式下保持自定义背景，可直接传入 `theme.bgColor`。

```vue
<template>
  <w-config-provider mode="dark" :theme="{ primary: '#5a84ff', bgColor: '#1e1e1e' }">
    <w-button type="primary">自定义暗黑主题</w-button>
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
| theme | - | object | {} |
| locale | - | - | zh-CN |
| mode | 菜单模式 | string | light |

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
