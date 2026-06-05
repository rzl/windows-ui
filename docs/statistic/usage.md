# Statistic 统计数值 - 使用说明

## 基础用法

```vue
<template>
  <w-row :gutter="20">
    <w-col :span="8">
      <w-statistic title="DAU" :value="268500" />
    </w-col>
    <w-col :span="8">
      <w-statistic title="订单" :value="128" />
    </w-col>
  </w-row>
</template>

<script setup>
import { WStatistic, WRow, WCol } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 标题 | string | - |
| value | 值 | number | - |
| prefix | 前缀内容 | string | - |
| suffix | 后缀内容 | string | - |
| precision | 精度 | number | - |
| valueStyle | - | object | - |

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
