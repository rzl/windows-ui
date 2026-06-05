# Descriptions 描述列表 - 使用说明

## 基础用法

```vue
<template>
  <w-descriptions title="用户信息" border>
    <w-descriptions-item label="用户名">kooriookami</w-descriptions-item>
    <w-descriptions-item label="手机号">18100000000</w-descriptions-item>
    <w-descriptions-item label="居住地">苏州市</w-descriptions-item>
  </w-descriptions>
</template>

<script setup>
import { WDescriptions, WDescriptionsItem } from '@windows-ui/core'
</script>
```

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
