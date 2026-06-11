# Card 卡片 - 使用说明

## 基础用法

```vue
<template>
  <w-card style="width: 400px">
    <template #header>
      <span>卡片名称</span>
      <w-button type="text">操作按钮</w-button>
    </template>
    <div v-for="o in 4" :key="o" class="text item">{{ "列表内容 " + o }}</div>
  </w-card>
</template>

<script setup>
import { WCard, WButton } from '@windows-ui/core'
</script>

<style scoped>
.text { font-size: 14px; }
.item { margin-bottom: 18px; }
</style>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| header | 头部内容 | string | - |
| hover | - | boolean | - |
| shadow | - | string | always |

### Slots

| 插槽名 | 说明 |
|--------|------|
| action | 操作区内容 |
| default | 默认内容 |
| footer | 底部内容 |
| header | 头部内容 |

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
