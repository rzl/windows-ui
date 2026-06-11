# Page Header 页头 - 使用说明

## 基础用法

```vue
<template>
  <w-page-header title="详情页面" content="详情内容" @back="goBack" />
</template>

<script setup>
import { WPageHeader } from '@windows-ui/core'
const goBack = () => console.log('返回上一页')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 标题 | string | - |
| showBack | - | boolean | true |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| back | - | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| action | 操作区内容 |
| extra | 自定义内容 |
| title | 标题插槽 |

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
