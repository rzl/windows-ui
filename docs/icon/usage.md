# Icon 图标 - 使用说明

## 基础用法

通过 `name` 属性使用内置图标：

```vue
<template>
  <w-space>
    <w-icon name="search" />
    <w-icon name="edit" />
    <w-icon name="delete" />
    <w-icon name="share" />
    <w-icon name="arrowUp" />
    <w-icon name="arrowDown" />
    <w-icon name="close" />
    <w-icon name="check" />
    <w-icon name="info" />
    <w-icon name="warning" />
  </w-space>
</template>

<script setup>
import { WIcon, WSpace } from '@windows-ui/core'
</script>
```

## 自定义 SVG

通过 `svg` 属性直接传入自定义 SVG 字符串，此时无需指定 `name`：

```vue
<template>
  <w-icon
    :svg="customSvg"
    size="large"
    color="#245edb"
  />
</template>

<script setup>
import { ref } from 'vue'
import { WIcon } from '@windows-ui/core'

const customSvg = ref('<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>')
</script>
```

> **注意**：传入的自定义 SVG 同样会受 `size` 和 `color` 属性控制。

## 图标尺寸

支持三种尺寸：`small`、`default`、`large`：

```vue
<w-space>
  <w-icon name="search" size="small" />
  <w-icon name="search" />
  <w-icon name="search" size="large" />
</w-space>
```

## 图标颜色

通过 `color` 属性统一覆盖图标的填充色与描边色：

```vue
<w-space>
  <w-icon name="heart" color="#d92b2b" />
  <w-icon name="star" color="#e4a010" />
  <w-icon name="check" color="#3a9e3a" />
</w-space>
```

## 内置图标列表

共计 **66** 个内置图标，按功能分组如下：

### 方向箭头
| 图标名 | 图标名 | 图标名 | 图标名 |
|--------|--------|--------|--------|
| arrowUp | arrowDown | arrowLeft | arrowRight |
| chevron-up | chevron-down | chevron-left | chevron-right |

### 操作交互
| 图标名 | 图标名 | 图标名 | 图标名 |
|--------|--------|--------|--------|
| close | search | more | delete |
| edit | plus | minus | check |
| refresh | settings | copy | upload |
| download | print | share | zoom-in |
| zoom-out | lock | unlock | eye |
| eye-off |

### 文件系统
| 图标名 | 图标名 | 图标名 | 图标名 |
|--------|--------|--------|--------|
| folder | file | image | video |
| music | document |

### 状态提示
| 图标名 | 图标名 | 图标名 | 图标名 |
|--------|--------|--------|--------|
| info | warning | error | success |
| help | loading |

### 通用界面
| 图标名 | 图标名 | 图标名 | 图标名 |
|--------|--------|--------|--------|
| user | star | menu | home |
| fullscreen | fullscreen-exit | heart | bell |
| calendar | clock | mail | phone |
| link | tag | bookmark | filter |
| sort | grid | list |

### 后台管理
| 图标名 | 图标名 | 图标名 | 图标名 |
|--------|--------|--------|--------|
| computer | logout | password | cart |
| pie-chart | bar-chart | setting |

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| name | 内置图标名称（与 `svg` 二选一） | string | - |
| svg | 自定义 SVG 字符串（与 `name` 二选一） | string | - |
| size | 尺寸 | string | default |
| color | 图标颜色，会统一替换 fill 与 stroke | string | - |

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
