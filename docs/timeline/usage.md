# Timeline 时间线 - 使用说明

## 基础用法

```vue
<template>
  <w-timeline>
    <w-timeline-item timestamp="2024-01-01" placement="top">
      <w-card><h4>更新 Github 模板</h4></w-card>
    </w-timeline-item>
    <w-timeline-item timestamp="2024-01-02">
      <w-card><h4>更新组件库</h4></w-card>
    </w-timeline-item>
  </w-timeline>
</template>

<script setup>
import { WTimeline, WTimelineItem, WCard } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| items | 菜单项列表 | array | [] |
| size | 尺寸 | string | default（继承全局 size） |

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
