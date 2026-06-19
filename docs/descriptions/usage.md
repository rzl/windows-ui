# Descriptions 描述列表 - 使用说明

用于展示多个只读字段的键值对信息，支持通过 `items` 属性或 `w-descriptions-item` 子组件两种方式传入数据。

## 基础用法

### 子组件形式

```vue
<template>
  <w-descriptions title="用户信息" :column="2" border>
    <w-descriptions-item label="用户名">kooriookami</w-descriptions-item>
    <w-descriptions-item label="手机号">18100000000</w-descriptions-item>
    <w-descriptions-item label="居住地">苏州市</w-descriptions-item>
    <w-descriptions-item label="邮箱">kooriookami@example.com</w-descriptions-item>
  </w-descriptions>
</template>

<script setup>
import { WDescriptions, WDescriptionsItem } from '@windows-ui/core'
</script>
```

### items 属性形式

```vue
<template>
  <w-descriptions title="订单信息" :column="2" :items="items" />
</template>

<script setup>
import { ref } from 'vue'
import { WDescriptions } from '@windows-ui/core'

const items = ref([
  { label: '订单号', value: '2024001' },
  { label: '金额', value: '¥199' },
  { label: '状态', value: '已完成' },
  { label: '时间', value: '2024-01-01' }
])
</script>
```

## API

### WDescriptions Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 标题 | string | - |
| items | 描述项列表，优先级高于默认插槽 | `{ label: string; value?: any; prop?: string }[]` | `[]` |
| column | 每行显示的列数 | number | 3 |
| border | 是否显示边框（当前组件默认已带边框，保留该属性以兼容写法） | boolean | false |

### WDescriptionsItem Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| label | 标签文本 | string | - |
| prop | 字段标识 | string | - |

### WDescriptions Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义描述项内容，通常放置 `w-descriptions-item` 组件 |

## 主题定制

可通过 CSS 变量自定义主题色：

```css
:root {
  --w-color-primary: #245edb;
  --w-bg-color: #ece9d8;
  --w-text-color-primary: #000;
  --w-text-color-secondary: #666;
  --w-border-radius-base: 3px;
  --w-font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
}
```
