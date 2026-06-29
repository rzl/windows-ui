# Scrollbar 滚动条 - 使用说明

## 基础用法

```vue
<template>
  <w-scrollbar height="200px">
    <p v-for="item in 20" :key="item">{{ item }}</p>
  </w-scrollbar>
</template>

<script setup>
import { WScrollbar } from '@windows-ui/core'
</script>
```

## 始终显示滚动条

设置 `always` 后，当内容溢出时会始终显示滚动条轨道。

```vue
<template>
  <w-scrollbar height="200px" always>
    <p v-for="item in 20" :key="item">{{ item }}</p>
  </w-scrollbar>
</template>
```

## 使用原生滚动条

设置 `native` 后，组件退化为原生滚动条容器。

```vue
<template>
  <w-scrollbar height="200px" native>
    <p v-for="item in 20" :key="item">{{ item }}</p>
  </w-scrollbar>
</template>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| height | 高度 | string/number | - |
| maxHeight | 最大高度 | string/number | - |
| native | 是否使用原生滚动条 | boolean | false |
| always | 是否始终显示滚动条 | boolean | false |
| barSize | 滚动条轨道宽度（px） | number | 12 |

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
